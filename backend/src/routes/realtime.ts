import type { FastifyPluginAsync } from "fastify"
import { verifyAccessToken } from "../lib/auth.js"
import { prisma } from "../lib/prisma.js"
import { addRealtimeClient } from "../services/realtime.js"

export const realtimeRoutes: FastifyPluginAsync = async (app) => {
  app.get("/ws", { websocket: true }, async (socket, request) => {
    const query = request.query as { token?: string }
    const token = query.token
    if (!token) {
      socket.close(4401, "unauthorized")
      return
    }

    try {
      const claims = await verifyAccessToken(app.env, token)
      const user = await prisma.user.findUnique({ where: { id: claims.sub } })
      if (!user || user.status !== "ACTIVE") {
        socket.close(4401, "unauthorized")
        return
      }

      addRealtimeClient({
        socket,
        userId: user.id,
        role: user.role,
      })

      socket.send(
        JSON.stringify({
          type: "notification",
          payload: {
            connected: true,
            note: "Realtime is optional; cached activities remain usable offline.",
          },
        }),
      )
    } catch {
      socket.close(4401, "unauthorized")
    }
  })
}
