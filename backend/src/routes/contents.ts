import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { requirePerm } from "./helpers.js"

export const contentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "content:read")
    if (!user) return
    return prisma.learningContent.findMany({
      where: { validationStatus: "VALIDATED" },
      take: 200,
    })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "content:write")
    if (!user) return
    const body = z
      .object({
        content_type: z.string(),
        subject: z.string(),
        level: z.string(),
        title: z.string(),
        body: z.string(),
        accessibility_metadata: z.record(z.unknown()).optional(),
      })
      .parse(request.body)

    const created = await prisma.learningContent.create({
      data: {
        contentType: body.content_type,
        subject: body.subject,
        level: body.level,
        title: body.title,
        body: body.body,
        accessibilityMetadata: body.accessibility_metadata,
        validationStatus: "DRAFT",
      },
    })
    return reply.code(201).send(created)
  })
}

export const activityRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "activity:read")
    if (!user) return
    const query = request.query as { child_id?: string }
    if (query.child_id) {
      return prisma.activity.findMany({ where: { childId: query.child_id } })
    }
    return prisma.activity.findMany({ take: 100 })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "activity:write")
    if (!user) return
    const body = z
      .object({
        content_id: z.string(),
        child_id: z.string(),
        offline_origin_id: z.string().optional(),
        operation_id: z.string().optional(),
      })
      .parse(request.body)

    if (body.offline_origin_id) {
      const existing = await prisma.activity.findUnique({
        where: { offlineOriginId: body.offline_origin_id },
      })
      if (existing) return existing
    }

    const created = await prisma.activity.create({
      data: {
        contentId: body.content_id,
        childId: body.child_id,
        assignedById: user.id,
        offlineOriginId: body.offline_origin_id,
      },
    })
    return reply.code(201).send(created)
  })

  app.patch("/:id", async (request, reply) => {
    const user = requirePerm(request, reply, "activity:write")
    if (!user) return
    const { id } = request.params as { id: string }
    const body = z
      .object({
        status: z.enum(["ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
        score: z.number().optional(),
        duration_seconds: z.number().int().optional(),
      })
      .parse(request.body)

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        status: body.status,
        score: body.score,
        durationSeconds: body.duration_seconds,
        startedAt: body.status === "IN_PROGRESS" ? new Date() : undefined,
        completedAt: body.status === "COMPLETED" ? new Date() : undefined,
      },
    })
    return updated
  })
}

export const competencyRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "competency:read")
    if (!user) return
    return prisma.competency.findMany({ take: 200 })
  })

  app.post("/evidence", async (request, reply) => {
    const user = requirePerm(request, reply, "competency:write")
    if (!user) return
    const body = z
      .object({
        child_id: z.string(),
        competency_id: z.string(),
        activity_id: z.string().optional(),
        mastery_level: z.number().int().min(0).max(4),
        evidence_type: z.string(),
      })
      .parse(request.body)

    const created = await prisma.competencyEvidence.create({
      data: {
        childId: body.child_id,
        competencyId: body.competency_id,
        activityId: body.activity_id,
        masteryLevel: body.mastery_level,
        evidenceType: body.evidence_type,
        observedById: user.id,
      },
    })
    return reply.code(201).send(created)
  })
}
