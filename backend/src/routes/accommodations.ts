import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { userCanAccessChild } from "../lib/rbac.js"
import { audit, requirePerm } from "./helpers.js"

export const accommodationRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "accommodation:read")
    if (!user) return
    const query = request.query as { child_id?: string }
    if (!query.child_id) return reply.code(400).send({ error: "child_id_required" })
    if (!(await userCanAccessChild(user, query.child_id))) {
      return reply.code(403).send({ error: "forbidden" })
    }
    return prisma.accommodation.findMany({ where: { childId: query.child_id } })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "accommodation:write")
    if (!user) return
    const body = z
      .object({
        child_id: z.string(),
        document_type: z.string(),
        objective: z.string(),
        adaptation: z.string(),
        frequency: z.string().optional(),
      })
      .parse(request.body)

    if (!(await userCanAccessChild(user, body.child_id))) {
      return reply.code(403).send({ error: "forbidden" })
    }

    const created = await prisma.accommodation.create({
      data: {
        childId: body.child_id,
        documentType: body.document_type,
        objective: body.objective,
        adaptation: body.adaptation,
        frequency: body.frequency,
        responsibleUserId: user.id,
      },
    })
    return reply.code(201).send(created)
  })
}

export const observationRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "observation:read")
    if (!user) return
    const query = request.query as { child_id?: string }
    if (!query.child_id) return reply.code(400).send({ error: "child_id_required" })
    if (!(await userCanAccessChild(user, query.child_id))) {
      await audit(request, "observations.read", "observation", query.child_id, "forbidden")
      return reply.code(403).send({ error: "forbidden" })
    }
    return prisma.observation.findMany({ where: { childId: query.child_id } })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "observation:write")
    if (!user) return
    const body = z
      .object({
        child_id: z.string(),
        context: z.string(),
        fact_text: z.string(),
        strategy_used: z.string().optional(),
        result_text: z.string().optional(),
        visibility_scope: z.string().default("staff"),
      })
      .parse(request.body)

    if (!(await userCanAccessChild(user, body.child_id))) {
      return reply.code(403).send({ error: "forbidden" })
    }

    const created = await prisma.observation.create({
      data: {
        childId: body.child_id,
        authorUserId: user.id,
        context: body.context,
        factText: body.fact_text,
        strategyUsed: body.strategy_used,
        resultText: body.result_text,
        visibilityScope: body.visibility_scope,
      },
    })
    await audit(request, "observations.create", "observation", created.id, "ok")
    return reply.code(201).send(created)
  })
}
