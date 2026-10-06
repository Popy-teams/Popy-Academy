import Fastify from "fastify"
import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"
import websocket from "@fastify/websocket"
import type { Env } from "./lib/env.js"
import { verifyAccessToken } from "./lib/auth.js"
import { prisma } from "./lib/prisma.js"
import type { AuthUser } from "./lib/rbac.js"
import { authRoutes } from "./routes/auth.js"
import { profileRoutes } from "./routes/profiles.js"
import { childrenRoutes } from "./routes/children.js"
import { classRoutes } from "./routes/classes.js"
import { assignmentRoutes } from "./routes/assignments.js"
import { contentRoutes } from "./routes/contents.js"
import { activityRoutes } from "./routes/activities.js"
import { competencyRoutes } from "./routes/competencies.js"
import { accommodationRoutes } from "./routes/accommodations.js"
import { observationRoutes } from "./routes/observations.js"
import { messageRoutes } from "./routes/messages.js"
import { notificationRoutes } from "./routes/notifications.js"
import { consentRoutes } from "./routes/consents.js"
import { robotRoutes } from "./routes/robots.js"
import { syncRoutes } from "./routes/sync.js"
import { privacyRoutes } from "./routes/privacy.js"
import { realtimeRoutes } from "./routes/realtime.js"
import { subscriptionRoutes } from "./routes/subscriptions.js"
import { billingRoutes } from "./routes/billing.js"

declare module "fastify" {
  interface FastifyInstance {
    env: Env
  }
  interface FastifyRequest {
    user: AuthUser | null
  }
}

export async function buildApp(env: Env) {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  })

  app.decorate("env", env)
  app.decorateRequest("user", null)

  await app.register(cors, {
    origin: env.APP_ORIGIN,
    credentials: true,
  })

  await app.register(rateLimit, {
    max: env.NODE_ENV === "test" ? 10_000 : 200,
    timeWindow: "1 minute",
  })

  await app.register(websocket)

  app.addHook("preHandler", async (request) => {
    request.user = null
    const header = request.headers.authorization
    if (!header?.startsWith("Bearer ")) return
    const token = header.slice("Bearer ".length)
    try {
      const claims = await verifyAccessToken(env, token)
      const user = await prisma.user.findUnique({
        where: { id: claims.sub },
        include: { mfaSecret: true },
      })
      if (!user || user.status !== "ACTIVE") return
      const session = await prisma.session.findUnique({ where: { id: claims.sid } })
      if (!session || session.revokedAt || session.expiresAt < new Date()) return
      request.user = {
        id: user.id,
        role: user.role,
        email: user.email,
        displayName: user.displayName,
        mfaEnabled: Boolean(user.mfaSecret?.enabled),
      }
    } catch {
      request.user = null
    }
  })

  /** MFA obligatoire pour certains rôles (enseignants, admin) */
  app.addHook("preHandler", async (request, reply) => {
    if (!request.user) return
    const requiredRoles = env.MFA_REQUIRED_ROLES.split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    if (!requiredRoles.includes(request.user.role)) return
    if (request.user.mfaEnabled) return

    const path = request.url.split("?")[0] ?? ""
    const allowedPrefixes = [
      "/auth/mfa",
      "/auth/logout",
      "/auth/pin-policy",
      "/profiles/me",
      "/health",
      "/subscriptions/plans",
    ]
    if (allowedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      return
    }
    return reply.code(403).send({
      error: "mfa_setup_required",
      message: "Activez la MFA TOTP pour ce rôle avant d’accéder à l’API.",
    })
  })

  app.get("/health", async () => {
    await prisma.$queryRaw`SELECT 1`
    return { status: "ok", service: "popy-academy-api", database: "up" }
  })

  await app.register(authRoutes, { prefix: "/auth" })
  await app.register(profileRoutes, { prefix: "/profiles" })
  await app.register(childrenRoutes, { prefix: "/children" })
  await app.register(classRoutes, { prefix: "/classes" })
  await app.register(assignmentRoutes, { prefix: "/assignments" })
  await app.register(contentRoutes, { prefix: "/contents" })
  await app.register(activityRoutes, { prefix: "/activities" })
  await app.register(competencyRoutes, { prefix: "/competencies" })
  await app.register(accommodationRoutes, { prefix: "/accommodations" })
  await app.register(observationRoutes, { prefix: "/observations" })
  await app.register(messageRoutes, { prefix: "/messages" })
  await app.register(notificationRoutes, { prefix: "/notifications" })
  await app.register(consentRoutes, { prefix: "/consents" })
  await app.register(robotRoutes, { prefix: "/robots" })
  await app.register(syncRoutes, { prefix: "/sync" })
  await app.register(privacyRoutes)
  await app.register(subscriptionRoutes, { prefix: "/subscriptions" })
  await app.register(billingRoutes, { prefix: "/subscriptions/billing" })
  await app.register(realtimeRoutes, { prefix: "/realtime" })

  return app
}
