import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { userCanAccessChild } from "../lib/rbac.js"
import { audit, requireAuth, requirePerm } from "./helpers.js"
import type { AuthUser, Permission } from "../lib/rbac.js"
import { hasPermission } from "../lib/rbac.js"
import type { FastifyReply, FastifyRequest } from "fastify"

function requireAuthForExport(request: FastifyRequest, reply: FastifyReply): AuthUser | null {
  const user = requireAuth(request, reply)
  if (!user) return null
  const allowed: Permission[] = ["export:own", "export:institution"]
  if (!allowed.some((p) => hasPermission(user.role, p))) {
    reply.code(403).send({ error: "forbidden" })
    return null
  }
  return user
}

export const privacyRoutes: FastifyPluginAsync = async (app) => {
  app.get("/exports/:childId", async (request, reply) => {
    const user = requireAuthForExport(request, reply)
    if (!user) return
    const { childId } = request.params as { childId: string }

    const canOwn =
      user.role !== "ADMIN" && (await userCanAccessChild(user, childId))
    const canInstitution = user.role === "ADMIN"
    if (!canOwn && !canInstitution) {
      return reply.code(403).send({ error: "forbidden" })
    }

    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        guardianships: true,
        activities: true,
        accommodations: true,
        observations: true,
        consents: true,
        accessibilityProfile: true,
        competencyEvidence: true,
      },
    })
    if (!child) return reply.code(404).send({ error: "not_found" })

    await audit(request, "exports.child", "child_profile", childId, "ok")

    return {
      exported_at: new Date().toISOString(),
      format: "popy-structured-v1",
      child: {
        id: child.id,
        display_name: child.displayName,
        birth_year: child.birthYear,
        school_level: child.schoolLevel,
        locale: child.locale,
        current_xp: child.currentXp,
        current_level: child.currentLevel,
      },
      guardianships: child.guardianships,
      activities: child.activities,
      accommodations: child.accommodations,
      observations: child.observations,
      consents: child.consents,
      accessibility_profile: child.accessibilityProfile,
      competency_evidence: child.competencyEvidence,
    }
  })

  app.patch("/privacy/:childId", async (request, reply) => {
    const user = requirePerm(request, reply, "child:write")
    if (!user) return
    const { childId } = request.params as { childId: string }
    if (!(await userCanAccessChild(user, childId))) {
      return reply.code(403).send({ error: "forbidden" })
    }

    const body = z
      .object({
        display_name: z.string().optional(),
        locale: z.string().optional(),
        avatar: z.string().nullable().optional(),
      })
      .parse(request.body)

    const updated = await prisma.childProfile.update({
      where: { id: childId },
      data: {
        displayName: body.display_name,
        locale: body.locale,
        avatar: body.avatar === null ? null : body.avatar,
      },
    })

    await audit(request, "privacy.rectify", "child_profile", childId, "ok")
    return {
      id: updated.id,
      display_name: updated.displayName,
      locale: updated.locale,
      avatar: updated.avatar,
    }
  })

  app.delete("/privacy/:childId", async (request, reply) => {
    const user = requirePerm(request, reply, "privacy:erase")
    if (!user) return
    const { childId } = request.params as { childId: string }
    if (!(await userCanAccessChild(user, childId))) {
      return reply.code(403).send({ error: "forbidden" })
    }

    // Controlled cascade via Prisma onDelete Cascade
    await prisma.childProfile.delete({ where: { id: childId } })
    await audit(request, "privacy.erase", "child_profile", childId, "ok")
    return { erased: true, child_id: childId }
  })

  app.get("/privacy/retention", async (request, reply) => {
    const user = requirePerm(request, reply, "profile:read")
    if (!user) return
    return {
      audit_days: app.env.RETENTION_AUDIT_DAYS,
      sync_days: app.env.RETENTION_SYNC_DAYS,
      robot_events_days: app.env.RETENTION_ROBOT_EVENTS_DAYS,
      advertising: false,
      commercial_profiling: false,
    }
  })
}
