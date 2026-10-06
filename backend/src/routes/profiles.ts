import type { FastifyPluginAsync } from "fastify"
import { prisma } from "../lib/prisma.js"
import { audit, requireAuth, requirePerm } from "./helpers.js"

export const profileRoutes: FastifyPluginAsync = async (app) => {
  app.get("/me", async (request, reply) => {
    const user = requireAuth(request, reply)
    if (!user) return
    const full = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        phone: true,
        lastLoginAt: true,
        mfaSecret: { select: { enabled: true } },
      },
    })
    await audit(request, "profiles.me", "user", user.id, "ok")
    return {
      id: full!.id,
      email: full!.email,
      display_name: full!.displayName,
      role: full!.role,
      status: full!.status,
      phone: full!.phone,
      last_login_at: full!.lastLoginAt,
      mfa_enabled: Boolean(full!.mfaSecret?.enabled),
    }
  })

  app.patch("/me", async (request, reply) => {
    const user = requirePerm(request, reply, "profile:write")
    if (!user) return
    const body = request.body as { display_name?: string; phone?: string }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: body.display_name,
        phone: body.phone,
      },
    })
    return {
      id: updated.id,
      display_name: updated.displayName,
      phone: updated.phone,
    }
  })
}
