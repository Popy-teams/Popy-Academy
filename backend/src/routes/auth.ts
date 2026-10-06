import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import {
  createTotpSecret,
  generateRefreshToken,
  hashIp,
  hashPassword,
  hashToken,
  PARENTAL_PIN_NOTE,
  signAccessToken,
  verifyPassword,
  verifyTotp,
} from "../lib/auth.js"
import { prisma } from "../lib/prisma.js"
import { writeAuditLog } from "../lib/rbac.js"

function requireUser(request: { user: unknown }, reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  if (!request.user) {
    reply.code(401).send({ error: "unauthorized" })
    return false
  }
  return true
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.get("/pin-policy", async () => ({ note: PARENTAL_PIN_NOTE }))

  app.post("/register", async (request, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(10),
        display_name: z.string().min(1),
        role: z.enum(["PARENT", "TEACHER", "AESH", "ADMIN"]),
      })
      .parse(request.body)

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      return reply.code(409).send({ error: "email_taken" })
    }

    const passwordHash = await hashPassword(body.password)
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        displayName: body.display_name,
        role: body.role,
      },
    })

    await writeAuditLog({
      actorUserId: user.id,
      action: "auth.register",
      resourceType: "user",
      resourceId: user.id,
      result: "ok",
      ipHash: hashIp(request.ip),
    })

    return reply.code(201).send({
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      role: user.role,
    })
  })

  app.post("/login", async (request, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
        mfa_token: z.string().optional(),
      })
      .parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
      include: { mfaSecret: true },
    })

    if (!user?.passwordHash || user.status !== "ACTIVE") {
      await writeAuditLog({
        action: "auth.login",
        resourceType: "user",
        result: "failed",
        ipHash: hashIp(request.ip),
      })
      return reply.code(401).send({ error: "invalid_credentials" })
    }

    const valid = await verifyPassword(user.passwordHash, body.password)
    if (!valid) {
      return reply.code(401).send({ error: "invalid_credentials" })
    }

    if (user.mfaSecret?.enabled) {
      if (!body.mfa_token || !verifyTotp(user.mfaSecret.secret, body.mfa_token)) {
        return reply.code(401).send({ error: "mfa_required" })
      }
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        userAgent: request.headers["user-agent"]?.slice(0, 255),
        ipHash: hashIp(request.ip),
        expiresAt: new Date(Date.now() + app.env.JWT_ACCESS_TTL_SECONDS * 1000),
      },
    })

    const refresh = generateRefreshToken()
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refresh),
        expiresAt: new Date(Date.now() + app.env.JWT_REFRESH_TTL_SECONDS * 1000),
      },
    })

    const accessToken = await signAccessToken(app.env, user, session.id)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    await writeAuditLog({
      actorUserId: user.id,
      action: "auth.login",
      resourceType: "user",
      resourceId: user.id,
      result: "ok",
      ipHash: hashIp(request.ip),
    })

    return {
      access_token: accessToken,
      refresh_token: refresh,
      token_type: "Bearer",
      expires_in: app.env.JWT_ACCESS_TTL_SECONDS,
      mfa_setup_required:
        app.env.MFA_REQUIRED_ROLES.split(",")
          .map((item) => item.trim())
          .includes(user.role) && !user.mfaSecret?.enabled,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.displayName,
        role: user.role,
        mfa_enabled: Boolean(user.mfaSecret?.enabled),
      },
    }
  })

  app.post("/refresh", async (request, reply) => {
    const body = z.object({ refresh_token: z.string().min(1) }).parse(request.body)
    const tokenHash = hashToken(body.refresh_token)
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } })

    if (!stored || stored.expiresAt < new Date()) {
      return reply.code(401).send({ error: "invalid_refresh" })
    }

    // Stolen refresh reuse: already rotated token presented again
    if (stored.replacedBy) {
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      await prisma.session.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      await writeAuditLog({
        actorUserId: stored.userId,
        action: "auth.refresh_reuse",
        resourceType: "refresh_token",
        resourceId: stored.id,
        result: "revoked_family",
        ipHash: hashIp(request.ip),
      })
      return reply.code(401).send({ error: "refresh_reuse_detected" })
    }

    if (stored.revokedAt) {
      return reply.code(401).send({ error: "invalid_refresh" })
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user || user.status !== "ACTIVE") {
      return reply.code(401).send({ error: "invalid_refresh" })
    }

    const newRefresh = generateRefreshToken()
    const replacement = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(newRefresh),
        expiresAt: new Date(Date.now() + app.env.JWT_REFRESH_TTL_SECONDS * 1000),
      },
    })

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date(), replacedBy: replacement.id },
    })

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        ipHash: hashIp(request.ip),
        expiresAt: new Date(Date.now() + app.env.JWT_ACCESS_TTL_SECONDS * 1000),
      },
    })

    const accessToken = await signAccessToken(app.env, user, session.id)
    return {
      access_token: accessToken,
      refresh_token: newRefresh,
      token_type: "Bearer",
      expires_in: app.env.JWT_ACCESS_TTL_SECONDS,
    }
  })

  app.post("/mfa/enroll", async (request, reply) => {
    if (!requireUser(request, reply)) return
    const user = request.user!
    if (!user.email) {
      return reply.code(400).send({ error: "email_required" })
    }

    const { secret, uri } = createTotpSecret(app.env, user.email)
    await prisma.mfaSecret.upsert({
      where: { userId: user.id },
      create: { userId: user.id, secret, enabled: false },
      update: { secret, enabled: false, verifiedAt: null },
    })

    return { secret, otpauth_uri: uri }
  })

  app.post("/mfa/verify", async (request, reply) => {
    if (!requireUser(request, reply)) return
    const body = z.object({ token: z.string().length(6) }).parse(request.body)
    const mfa = await prisma.mfaSecret.findUnique({ where: { userId: request.user!.id } })
    if (!mfa) return reply.code(400).send({ error: "mfa_not_enrolled" })
    if (!verifyTotp(mfa.secret, body.token)) {
      return reply.code(401).send({ error: "invalid_mfa_token" })
    }
    await prisma.mfaSecret.update({
      where: { userId: request.user!.id },
      data: { enabled: true, verifiedAt: new Date() },
    })
    return { enabled: true }
  })

  app.post("/logout", async (request, reply) => {
    if (!requireUser(request, reply)) return
    const body = z.object({ refresh_token: z.string().optional() }).parse(request.body ?? {})
    if (body.refresh_token) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(body.refresh_token), userId: request.user!.id },
        data: { revokedAt: new Date() },
      })
    }
    await prisma.session.updateMany({
      where: { userId: request.user!.id, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    return { ok: true }
  })
}
