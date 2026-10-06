import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { audit, requirePerm } from "./helpers.js"

function serializePlan(plan: {
  id: string
  code: string
  name: string
  description: string
  priceCentsMonth: number
  currency: string
  maxChildren: number
  computerAccess: boolean
  robotOptional: boolean
  robotIncluded: boolean
  features: string[]
}) {
  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    description: plan.description,
    price_cents_month: plan.priceCentsMonth,
    currency: plan.currency,
    max_children: plan.maxChildren,
    computer_access: plan.computerAccess,
    robot_optional: plan.robotOptional,
    robot_included: plan.robotIncluded,
    features: plan.features,
  }
}

export const subscriptionRoutes: FastifyPluginAsync = async (app) => {
  /** Public catalogue — l’ordinateur suffit, robot jamais obligatoire. */
  app.get("/plans", async () => {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    })
    return {
      principle:
        "Popy Academy fonctionne entièrement sur ordinateur. Le robot est un complément optionnel.",
      plans: plans.map(serializePlan),
    }
  })

  app.get("/me", async (request, reply) => {
    const user = requirePerm(request, reply, "subscription:read")
    if (!user) return

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      const free = await prisma.subscriptionPlan.findUnique({
        where: { code: "ordinateur" },
      })
      return {
        subscription: null,
        effective_access: {
          mode: "COMPUTER",
          computer_ok: true,
          robot_required: false,
          robot_enabled: false,
          plan: free ? serializePlan(free) : null,
        },
      }
    }

    return {
      subscription: {
        id: subscription.id,
        status: subscription.status,
        access_mode: subscription.accessMode,
        robot_enabled: subscription.robotEnabled,
        current_period_end: subscription.currentPeriodEnd,
        cancel_at_period_end: subscription.cancelAtPeriodEnd,
        plan: serializePlan(subscription.plan),
      },
      effective_access: {
        mode: subscription.accessMode,
        computer_ok: subscription.plan.computerAccess,
        robot_required: false,
        robot_enabled: subscription.robotEnabled && subscription.plan.robotOptional,
        plan: serializePlan(subscription.plan),
      },
    }
  })

  app.post("/subscribe", async (request, reply) => {
    const user = requirePerm(request, reply, "subscription:write")
    if (!user) return

    const body = z
      .object({
        plan_code: z.enum(["ordinateur", "famille", "ecole"]),
        access_mode: z.enum(["COMPUTER", "HYBRID"]).default("COMPUTER"),
        robot_enabled: z.boolean().default(false),
      })
      .parse(request.body)

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { code: body.plan_code },
    })
    if (!plan || !plan.active) {
      return reply.code(404).send({ error: "plan_not_found" })
    }

    // Robot never required — HYBRID only if user opts in
    const accessMode =
      body.robot_enabled && plan.robotOptional ? body.access_mode : "COMPUTER"
    const robotEnabled = Boolean(body.robot_enabled && plan.robotOptional)

    await prisma.subscription.updateMany({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
      data: { status: "CANCELLED", cancelAtPeriodEnd: true },
    })

    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const created = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: plan.priceCentsMonth === 0 ? "ACTIVE" : "TRIALING",
        accessMode,
        robotEnabled,
        currentPeriodEnd: periodEnd,
      },
      include: { plan: true },
    })

    await audit(request, "subscription.subscribe", "subscription", created.id, "ok")

    return reply.code(201).send({
      id: created.id,
      status: created.status,
      access_mode: created.accessMode,
      robot_enabled: created.robotEnabled,
      robot_required: false,
      plan: serializePlan(created.plan),
      current_period_end: created.currentPeriodEnd,
    })
  })

  app.patch("/me", async (request, reply) => {
    const user = requirePerm(request, reply, "subscription:write")
    if (!user) return

    const body = z
      .object({
        access_mode: z.enum(["COMPUTER", "HYBRID"]).optional(),
        robot_enabled: z.boolean().optional(),
        cancel_at_period_end: z.boolean().optional(),
      })
      .parse(request.body)

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      return reply.code(404).send({ error: "no_active_subscription" })
    }

    const robotEnabled =
      body.robot_enabled === undefined
        ? subscription.robotEnabled
        : body.robot_enabled && subscription.plan.robotOptional

    const accessMode =
      body.access_mode ??
      (robotEnabled ? subscription.accessMode : "COMPUTER")

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        robotEnabled,
        accessMode: robotEnabled ? accessMode : "COMPUTER",
        cancelAtPeriodEnd: body.cancel_at_period_end,
      },
      include: { plan: true },
    })

    return {
      id: updated.id,
      access_mode: updated.accessMode,
      robot_enabled: updated.robotEnabled,
      robot_required: false,
      cancel_at_period_end: updated.cancelAtPeriodEnd,
      plan: serializePlan(updated.plan),
    }
  })
}
