import type { FastifyPluginAsync } from "fastify"
import { z } from "zod"
import { randomBytes } from "node:crypto"
import { prisma } from "../lib/prisma.js"
import { broadcast } from "../services/realtime.js"
import { audit, requirePerm } from "./helpers.js"

export const robotRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:read")
    if (!user) return
    const robots = await prisma.robotDevice.findMany({
      include: { pairings: { where: { revokedAt: null } } },
    })
    return robots.map((r) => ({
      id: r.id,
      serial_number: r.serialNumber,
      nickname: r.nickname,
      status: r.status,
      firmware_version: r.firmwareVersion,
      last_seen_at: r.lastSeenAt,
      pairings: r.pairings.length,
    }))
  })

  app.post("/register", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:write")
    if (!user) return
    const body = z
      .object({
        serial_number: z.string().min(4),
        school_id: z.string().optional(),
        nickname: z.string().optional(),
        firmware_version: z.string().optional(),
      })
      .parse(request.body)

    const created = await prisma.robotDevice.create({
      data: {
        serialNumber: body.serial_number,
        schoolId: body.school_id,
        nickname: body.nickname,
        firmwareVersion: body.firmware_version,
        pairingSecret: randomBytes(24).toString("hex"),
        status: "OFFLINE",
      },
    })
    return reply.code(201).send({
      id: created.id,
      serial_number: created.serialNumber,
      pairing_secret: created.pairingSecret,
    })
  })

  app.post("/:id/pair", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:write")
    if (!user) return
    const { id } = request.params as { id: string }
    const body = z
      .object({
        pairing_secret: z.string(),
        child_id: z.string().optional(),
        class_id: z.string().optional(),
      })
      .parse(request.body)

    const robot = await prisma.robotDevice.findUnique({ where: { id } })
    if (!robot || robot.status === "REVOKED") {
      return reply.code(404).send({ error: "robot_not_found" })
    }
    if (robot.pairingSecret !== body.pairing_secret) {
      await audit(request, "robots.pair", "robot", id, "auth_failed")
      return reply.code(401).send({ error: "invalid_pairing_secret" })
    }

    const pairing = await prisma.robotPairing.create({
      data: {
        robotId: id,
        childId: body.child_id,
        classId: body.class_id,
        pairedById: user.id,
      },
    })

    await prisma.robotDevice.update({
      where: { id },
      data: { status: "ONLINE", lastSeenAt: new Date() },
    })

    await prisma.robotEvent.create({
      data: {
        robotId: id,
        eventType: "paired",
        severity: "info",
        payload: { pairing_id: pairing.id, child_id: body.child_id },
      },
    })

    broadcast({
      type: "robot",
      roles: ["TEACHER", "ADMIN"],
      payload: { robot_id: id, event: "paired" },
    })

    return reply.code(201).send(pairing)
  })

  app.post("/:id/command", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:write")
    if (!user) return
    const { id } = request.params as { id: string }
    const body = z
      .object({
        command: z.enum(["move", "led", "voice", "volume", "stop", "profile"]),
        params: z.record(z.unknown()).default({}),
      })
      .parse(request.body)

    const robot = await prisma.robotDevice.findUnique({ where: { id } })
    if (!robot || robot.status === "REVOKED") {
      return reply.code(404).send({ error: "robot_not_found" })
    }

    const event = await prisma.robotEvent.create({
      data: {
        robotId: id,
        eventType: `command:${body.command}`,
        severity: body.command === "stop" ? "critical" : "info",
        payload: { params: body.params, by: user.id },
      },
    })

    broadcast({
      type: "robot",
      roles: ["TEACHER", "ADMIN"],
      payload: { robot_id: id, command: body.command, event_id: event.id },
    })

    return { accepted: true, event_id: event.id }
  })

  app.post("/:id/emergency-stop", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:emergency")
    if (!user) return
    const { id } = request.params as { id: string }

    const event = await prisma.robotEvent.create({
      data: {
        robotId: id,
        eventType: "emergency_stop",
        severity: "critical",
        payload: { by: user.id, priority: 0 },
      },
    })

    await prisma.robotDevice.update({
      where: { id },
      data: { status: "MAINTENANCE", lastSeenAt: new Date() },
    })

    broadcast({
      type: "robot",
      roles: ["TEACHER", "ADMIN", "AESH"],
      payload: { robot_id: id, event: "emergency_stop", priority: 0 },
    })

    await audit(request, "robots.emergency_stop", "robot", id, "ok")
    return { accepted: true, priority: 0, event_id: event.id }
  })

  app.post("/:id/revoke", async (request, reply) => {
    const user = requirePerm(request, reply, "robot:write")
    if (!user) return
    const { id } = request.params as { id: string }

    await prisma.robotDevice.update({
      where: { id },
      data: { status: "REVOKED" },
    })
    await prisma.robotPairing.updateMany({
      where: { robotId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    await prisma.robotEvent.create({
      data: {
        robotId: id,
        eventType: "revoked",
        severity: "warning",
        payload: { by: user.id },
      },
    })

    await audit(request, "robots.revoke", "robot", id, "ok")
    return { revoked: true }
  })
}
