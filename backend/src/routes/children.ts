import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { userCanAccessChild } from "../lib/rbac.js"
import { audit, getOperationId, requirePerm } from "./helpers.js"

export const childrenRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "child:read")
    if (!user) return

    if (user.role === "PARENT") {
      const links = await prisma.guardianship.findMany({
        where: { guardianUserId: user.id },
        include: { child: true },
      })
      return links.map((l) => serializeChild(l.child))
    }

    if (user.role === "ADMIN") {
      const children = await prisma.childProfile.findMany({ take: 200 })
      return children.map(serializeChild)
    }

    const assignments = await prisma.staffAssignment.findMany({
      where: { userId: user.id },
      include: {
        child: true,
        class: { include: { memberships: { include: { child: true } } } },
      },
    })
    const map = new Map<string, ReturnType<typeof serializeChild>>()
    for (const a of assignments) {
      if (a.child) map.set(a.child.id, serializeChild(a.child))
      for (const m of a.class?.memberships ?? []) {
        map.set(m.child.id, serializeChild(m.child))
      }
    }
    return [...map.values()]
  })

  app.post("/", async (request, reply) => {
    const user = requirePerm(request, reply, "child:write")
    if (!user) return
    const body = z
      .object({
        display_name: z.string().min(1),
        birth_year: z.number().int().min(2005).max(2025),
        school_level: z.string().min(1),
        avatar: z.string().optional(),
        locale: z.string().default("fr"),
        operation_id: z.string().optional(),
      })
      .parse(request.body)

    const opId = getOperationId(request) ?? body.operation_id
    if (opId) {
      const existing = await prisma.syncOperation.findUnique({ where: { operationId: opId } })
      if (existing?.entityId) {
        const child = await prisma.childProfile.findUnique({ where: { id: existing.entityId } })
        if (child) return reply.code(200).send(serializeChild(child))
      }
    }

    const child = await prisma.childProfile.create({
      data: {
        displayName: body.display_name,
        birthYear: body.birth_year,
        schoolLevel: body.school_level,
        avatar: body.avatar,
        locale: body.locale,
      },
    })

    if (user.role === "PARENT") {
      await prisma.guardianship.create({
        data: {
          childId: child.id,
          guardianUserId: user.id,
          relationship: "parent",
          isPrimary: true,
        },
      })
    }

    if (opId) {
      await prisma.syncOperation.create({
        data: {
          operationId: opId,
          userId: user.id,
          entityType: "child_profiles",
          entityId: child.id,
          operation: "create",
          payload: body,
          clientTimestamp: new Date(),
          status: "SYNCED",
        },
      })
    }

    await audit(request, "children.create", "child_profile", child.id, "ok")
    return reply.code(201).send(serializeChild(child))
  })

  app.get("/:id", async (request, reply) => {
    const user = requirePerm(request, reply, "child:read")
    if (!user) return
    const { id } = request.params as { id: string }
    if (!(await userCanAccessChild(user, id))) {
      await audit(request, "children.read", "child_profile", id, "forbidden")
      return reply.code(403).send({ error: "forbidden" })
    }
    const child = await prisma.childProfile.findUnique({ where: { id } })
    if (!child) return reply.code(404).send({ error: "not_found" })
    await audit(request, "children.read", "child_profile", id, "ok")
    return serializeChild(child)
  })
}

function serializeChild(child: {
  id: string
  displayName: string
  birthYear: number
  schoolLevel: string
  avatar: string | null
  locale: string
  currentXp: number
  currentLevel: number
}) {
  return {
    id: child.id,
    display_name: child.displayName,
    birth_year: child.birthYear,
    school_level: child.schoolLevel,
    avatar: child.avatar,
    locale: child.locale,
    current_xp: child.currentXp,
    current_level: child.currentLevel,
  }
}
