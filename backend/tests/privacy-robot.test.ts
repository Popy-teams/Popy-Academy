import { describe, expect, it } from "vitest"
import { getApp, prisma, registerAndLogin } from "./setup.js"
import { broadcast, realtimeClientCount, addRealtimeClient } from "../src/services/realtime.js"

describe("Phase 6–8 — realtime, privacy, robot", () => {
  it("tracks realtime clients and broadcasts", async () => {
    const fakeSocket = {
      readyState: 1,
      sent: [] as string[],
      send(data: string) {
        this.sent.push(data)
      },
      on() {},
    }
    addRealtimeClient({
      socket: fakeSocket as never,
      userId: "u1",
      role: "PARENT",
    })
    expect(realtimeClientCount()).toBe(1)
    broadcast({
      type: "message",
      userIds: ["u1"],
      payload: { hello: true },
    })
    expect(fakeSocket.sent.length).toBe(1)
  })

  it("exports and erases child data", async () => {
    const app = await getApp()
    const parent = await registerAndLogin({
      email: "rgpd@example.invalid",
      display_name: "RGPD",
      role: "PARENT",
    })
    const create = await app.inject({
      method: "POST",
      url: "/children",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: {
        display_name: "Enfant RGPD",
        birth_year: 2018,
        school_level: "CE1",
      },
    })
    const child = create.json() as { id: string }

    const exported = await app.inject({
      method: "GET",
      url: `/exports/${child.id}`,
      headers: { authorization: `Bearer ${parent.token}` },
    })
    expect(exported.statusCode).toBe(200)
    expect(exported.json().format).toBe("popy-structured-v1")

    const erased = await app.inject({
      method: "DELETE",
      url: `/privacy/${child.id}`,
      headers: { authorization: `Bearer ${parent.token}` },
    })
    expect(erased.statusCode).toBe(200)
    expect(await prisma.childProfile.findUnique({ where: { id: child.id } })).toBeNull()
  })

  it("pairs robot and prioritizes emergency stop", async () => {
    const app = await getApp()
    const teacher = await registerAndLogin({
      email: "robot@example.invalid",
      display_name: "Robot Teacher",
      role: "TEACHER",
    })

    const registered = await app.inject({
      method: "POST",
      url: "/robots/register",
      headers: { authorization: `Bearer ${teacher.token}` },
      payload: { serial_number: "POPY-TEST-001", nickname: "Bot" },
    })
    expect(registered.statusCode).toBe(201)
    const robot = registered.json() as { id: string; pairing_secret: string }

    const paired = await app.inject({
      method: "POST",
      url: `/robots/${robot.id}/pair`,
      headers: { authorization: `Bearer ${teacher.token}` },
      payload: { pairing_secret: robot.pairing_secret },
    })
    expect(paired.statusCode).toBe(201)

    const stop = await app.inject({
      method: "POST",
      url: `/robots/${robot.id}/emergency-stop`,
      headers: { authorization: `Bearer ${teacher.token}` },
    })
    expect(stop.statusCode).toBe(200)
    expect(stop.json().priority).toBe(0)

    const events = await prisma.robotEvent.findMany({
      where: { robotId: robot.id, eventType: "emergency_stop" },
    })
    expect(events).toHaveLength(1)
  })
})
