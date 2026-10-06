import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { processSyncOperations } from "../services/sync.js"
import { broadcast } from "../services/realtime.js"
import { requireAuth } from "./helpers.js"

export const syncRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (request, reply) => {
    const user = requireAuth(request, reply)
    if (!user) return

    const body = z
      .object({
        operations: z.array(
          z.object({
            id: z.string(),
            entity: z.string(),
            action: z.string(),
            payload: z.unknown(),
            client_timestamp: z.string(),
            device_id: z.string().optional(),
          }),
        ),
      })
      .parse(request.body)

    const results = await processSyncOperations(user, body.operations)

    if (results.some((r) => r.status === "synced")) {
      broadcast({
        type: "sync",
        userIds: [user.id],
        payload: { synced: results.filter((r) => r.status === "synced").length },
      })
    }

    return { results }
  })
}
