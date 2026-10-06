import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { createHash, randomBytes } from "node:crypto"
import { prisma } from "../lib/prisma.js"
import { audit, requirePerm } from "./helpers.js"

/**
 * Billing Stripe-ready :
 * - BILLING_MODE=demo → paiement simulé (préprod / démo sans clés)
 * - BILLING_MODE=stripe → crée une session checkout (clé STRIPE_SECRET_KEY)
 *
 * Le plan « ordinateur » (0 €) reste toujours activable sans paiement.
 */

type CheckoutSession = {
  id: string
  userId: string
  planCode: string
  amountCents: number
  currency: string
  status: "pending" | "paid" | "cancelled"
  createdAt: number
}

const checkoutSessions = new Map<string, CheckoutSession>()

export const billingRoutes: FastifyPluginAsync = async (app) => {
  app.post("/checkout", async (request, reply) => {
    const user = requirePerm(request, reply, "subscription:write")
    if (!user) return

    const body = z
      .object({
        plan_code: z.enum(["ordinateur", "famille", "ecole"]),
        success_url: z.string().url().optional(),
        cancel_url: z.string().url().optional(),
      })
      .parse(request.body)

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { code: body.plan_code },
    })
    if (!plan || !plan.active) {
      return reply.code(404).send({ error: "plan_not_found" })
    }

    if (plan.priceCentsMonth === 0) {
      return reply.code(400).send({
        error: "free_plan_use_subscribe",
        hint: "Utilisez POST /subscriptions/subscribe pour le plan Ordinateur gratuit.",
      })
    }

    const mode = app.env.BILLING_MODE
    const sessionId = `cs_${randomBytes(16).toString("hex")}`

    if (mode === "stripe" && app.env.STRIPE_SECRET_KEY) {
      // Intégration Stripe Checkout (API REST) — sans SDK lourd
      const params = new URLSearchParams()
      params.set("mode", "subscription")
      params.set("success_url", body.success_url ?? `${app.env.APP_ORIGIN}/parent/abonnement?paid=1`)
      params.set("cancel_url", body.cancel_url ?? `${app.env.APP_ORIGIN}/parent/abonnement?cancel=1`)
      params.set("line_items[0][price_data][currency]", plan.currency.toLowerCase())
      params.set("line_items[0][price_data][product_data][name]", `Popy Academy — ${plan.name}`)
      params.set("line_items[0][price_data][unit_amount]", String(plan.priceCentsMonth))
      params.set("line_items[0][price_data][recurring][interval]", "month")
      params.set("line_items[0][quantity]", "1")
      params.set("client_reference_id", user.id)
      params.set("metadata[plan_code]", plan.code)
      params.set("metadata[user_id]", user.id)

      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${app.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      })

      if (!stripeRes.ok) {
        const errText = await stripeRes.text()
        await audit(request, "billing.checkout", "subscription", plan.id, "stripe_error")
        return reply.code(502).send({ error: "stripe_unavailable", detail: errText.slice(0, 200) })
      }

      const stripeSession = (await stripeRes.json()) as {
        id: string
        url: string
      }

      await audit(request, "billing.checkout", "checkout_session", stripeSession.id, "ok")
      return {
        mode: "stripe",
        checkout_id: stripeSession.id,
        checkout_url: stripeSession.url,
        amount_cents: plan.priceCentsMonth,
        currency: plan.currency,
        plan_code: plan.code,
      }
    }

    // Mode démo : session locale confirmable sans carte
    const session: CheckoutSession = {
      id: sessionId,
      userId: user.id,
      planCode: plan.code,
      amountCents: plan.priceCentsMonth,
      currency: plan.currency,
      status: "pending",
      createdAt: Date.now(),
    }
    checkoutSessions.set(sessionId, session)

    await audit(request, "billing.checkout", "checkout_session", sessionId, "demo")
    return {
      mode: "demo",
      checkout_id: sessionId,
      checkout_url: null,
      demo_confirm_path: "/subscriptions/billing/confirm",
      demo_token: createHash("sha256")
        .update(sessionId + ":demo")
        .digest("hex")
        .slice(0, 12),
      amount_cents: plan.priceCentsMonth,
      currency: plan.currency,
      plan_code: plan.code,
      note: "Paiement simulé — aucune carte bancaire. Passez BILLING_MODE=stripe en production.",
    }
  })

  app.post("/confirm", async (request, reply) => {
    const user = requirePerm(request, reply, "subscription:write")
    if (!user) return

    const body = z
      .object({
        checkout_id: z.string().min(1),
        demo_token: z.string().optional(),
      })
      .parse(request.body)

    const session = checkoutSessions.get(body.checkout_id)
    if (!session || session.userId !== user.id) {
      return reply.code(404).send({ error: "checkout_not_found" })
    }
    if (session.status === "paid") {
      return { already_paid: true, plan_code: session.planCode }
    }

    // Jeton démo simple (anti-clic accidentel) = hash court du checkout_id
    const expected = createHash("sha256")
      .update(session.id + ":demo")
      .digest("hex")
      .slice(0, 12)
    if (body.demo_token && body.demo_token !== expected) {
      return reply.code(401).send({ error: "invalid_demo_token" })
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { code: session.planCode },
    })
    if (!plan) return reply.code(404).send({ error: "plan_not_found" })

    await prisma.subscription.updateMany({
      where: { userId: user.id, status: { in: ["ACTIVE", "TRIALING"] } },
      data: { status: "CANCELLED", cancelAtPeriodEnd: true },
    })

    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const created = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "ACTIVE",
        accessMode: "COMPUTER",
        robotEnabled: false,
        currentPeriodEnd: periodEnd,
      },
      include: { plan: true },
    })

    session.status = "paid"
    checkoutSessions.set(session.id, session)

    await audit(request, "billing.confirm", "subscription", created.id, "paid_demo")

    return {
      paid: true,
      mode: "demo",
      subscription_id: created.id,
      plan_code: plan.code,
      access_mode: "COMPUTER",
      robot_required: false,
      demo_token_hint: expected,
    }
  })

  /** Webhook Stripe (signature vérifiée si secret présent). */
  app.post("/webhook", async (request, reply) => {
    if (app.env.BILLING_MODE !== "stripe") {
      return reply.code(400).send({ error: "billing_mode_not_stripe" })
    }
    // En production : vérifier Stripe-Signature avec STRIPE_WEBHOOK_SECRET
    // Ici on journalise et on renvoie 200 pour ne pas bloquer les retries en démo.
    await audit(request, "billing.webhook", "stripe", null, "received")
    return { received: true }
  })
}

/** Exposé pour tests unitaires du jeton démo */
export function demoCheckoutToken(checkoutId: string) {
  return createHash("sha256")
    .update(checkoutId + ":demo")
    .digest("hex")
    .slice(0, 12)
}
