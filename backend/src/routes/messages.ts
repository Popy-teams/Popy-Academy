import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { broadcast } from "../services/realtime.js"
import { requirePerm } from "./helpers.js"

export const messageRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "message:read")
    if (!user) return
    const query = request.query as { thread_id?: string }
    if (query.thread_id) {
      return prisma.message.findMany({
        where: { threadId: query.thread_id },
        orderBy: { createdAt: "asc" },
      })
    }
    return prisma.message.findMany({
      where: { senderUserId: user.id },
      take: 100,
      orderBy: { createdAt: "desc" },
    })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "message:write")
    if (!user) return
    const body = z
      .object({
        thread_id: z.string(),
        body: z.string().min(1),
        message_type: z.string().default("text"),
        recipient_user_id: z.string().optional(),
      })
      .parse(request.body)

    const created = await prisma.message.create({
      data: {
        threadId: body.thread_id,
        senderUserId: user.id,
        messageType: body.message_type,
        body: body.body,
      },
    })

    broadcast({
      type: "message",
      roles: ["PARENT", "TEACHER", "AESH", "ADMIN"],
      userIds: body.recipient_user_id ? [body.recipient_user_id, user.id] : [user.id],
      payload: created,
    })

    return reply.code(201).send(created)
  })
}

export const notificationRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "notification:read")
    if (!user) return
    return prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  })

  app.post("/:id/read", async (request, reply) => {
    const user = requirePerm(request, reply, "notification:read")
    if (!user) return
    const { id } = request.params as { id: string }
    const updated = await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { readAt: new Date() },
    })
    if (!updated.count) return reply.code(404).send({ error: "not_found" })
    return { ok: true }
  })
}

export const consentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "consent:read")
    if (!user) return
    return prisma.consent.findMany({
      where: { guardianUserId: user.id },
    })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "consent:write")
    if (!user) return
    const body = z
      .object({
        child_id: z.string(),
        purpose: z.string(),
        status: z.enum(["GRANTED", "REVOKED", "PENDING"]),
        policy_version: z.string(),
        evidence: z.string().optional(),
      })
      .parse(request.body)

    const created = await prisma.consent.create({
      data: {
        childId: body.child_id,
        guardianUserId: user.id,
        purpose: body.purpose,
        status: body.status,
        policyVersion: body.policy_version,
        evidence: body.evidence,
        grantedAt: body.status === "GRANTED" ? new Date() : null,
        revokedAt: body.status === "REVOKED" ? new Date() : null,
      },
    })
    return reply.code(201).send(created)
  })
}
