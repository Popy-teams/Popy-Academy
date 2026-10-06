import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { requirePerm } from "./helpers.js"

export const classRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "class:read")
    if (!user) return

    if (user.role === "ADMIN") {
      return prisma.class.findMany({ include: { school: true, memberships: true } })
    }

    const assignments = await prisma.staffAssignment.findMany({
      where: { userId: user.id, classId: { not: null } },
      include: { class: { include: { school: true, memberships: true } } },
    })
    return assignments.map((a) => a.class).filter(Boolean)
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "class:write")
    if (!user) return
    const body = z
      .object({
        school_id: z.string(),
        name: z.string(),
        level: z.string(),
        school_year: z.string(),
      })
      .parse(request.body)

    const created = await prisma.class.create({
      data: {
        schoolId: body.school_id,
        name: body.name,
        level: body.level,
        schoolYear: body.school_year,
      },
    })
    return reply.code(201).send(created)
  })
}

export const assignmentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "assignment:read")
    if (!user) return
    if (user.role === "ADMIN") {
      return prisma.staffAssignment.findMany({ take: 200 })
    }
    return prisma.staffAssignment.findMany({ where: { userId: user.id } })
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "assignment:write")
    if (!user) return
    const body = z
      .object({
        user_id: z.string(),
        class_id: z.string().optional(),
        child_id: z.string().optional(),
        assignment_role: z.enum(["TEACHER", "AESH", "ADMIN"]),
      })
      .parse(request.body)

    const created = await prisma.staffAssignment.create({
      data: {
        userId: body.user_id,
        classId: body.class_id,
        childId: body.child_id,
        assignmentRole: body.assignment_role,
      },
    })
    return reply.code(201).send(created)
  })
}
