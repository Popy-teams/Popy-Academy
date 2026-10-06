import { describe, expect, it } from "vitest"
import { getApp, prisma, registerAndLogin } from "./setup.js"

describe("Phase 3 — RBAC", () => {
  it("refuses cross-parent child access", async () => {
    const app = await getApp()
    const parentA = await registerAndLogin({
      email: "pa@example.invalid",
      display_name: "PA",
      role: "PARENT",
    })
    const parentB = await registerAndLogin({
      email: "pb@example.invalid",
      display_name: "PB",
      role: "PARENT",
    })

    const create = await app.inject({
      method: "POST",
      url: "/children",
      headers: { authorization: `Bearer ${parentA.token}` },
      payload: {
        display_name: "Enfant A",
        birth_year: 2018,
        school_level: "CE1",
      },
    })
    const child = create.json() as { id: string }

    const denied = await app.inject({
      method: "GET",
      url: `/children/${child.id}`,
      headers: { authorization: `Bearer ${parentB.token}` },
    })
    expect(denied.statusCode).toBe(403)

    const logs = await prisma.auditLog.findMany({
      where: { action: "children.read", result: "forbidden" },
    })
    expect(logs.length).toBeGreaterThan(0)
  })

  it("blocks AESH from consent write", async () => {
    const app = await getApp()
    const aesh = await registerAndLogin({
      email: "aesh@example.invalid",
      display_name: "AESH",
      role: "AESH",
    })
    const res = await app.inject({
      method: "POST",
      url: "/consents",
      headers: { authorization: `Bearer ${aesh.token}` },
      payload: {
        child_id: "x",
        purpose: "x",
        status: "GRANTED",
        policy_version: "1",
      },
    })
    expect(res.statusCode).toBe(403)
  })
})
