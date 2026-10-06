import { describe, expect, it } from "vitest"
import { getApp, prisma, registerAndLogin } from "./setup.js"

describe("Phase 5 — sync", () => {
  it("syncs progression and conflicts on restrictive consent", async () => {
    const app = await getApp()
    const parent = await registerAndLogin({
      email: "sync@example.invalid",
      display_name: "Sync",
      role: "PARENT",
    })

    const child = await prisma.childProfile.create({
      data: {
        displayName: "Sync Kid",
        birthYear: 2018,
        schoolLevel: "CE1",
        currentXp: 50,
      },
    })
    await prisma.guardianship.create({
      data: {
        childId: child.id,
        guardianUserId: parent.user.id,
        relationship: "parent",
        isPrimary: true,
      },
    })

    const sync = await app.inject({
      method: "POST",
      url: "/sync",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: {
        operations: [
          {
            id: "sync-xp-1",
            entity: "child.xp",
            action: "upsert",
            payload: { child_id: child.id, value: 80 },
            client_timestamp: new Date().toISOString(),
          },
          {
            id: "sync-consent-1",
            entity: "consent.learning",
            action: "upsert",
            payload: {
              child_id: child.id,
              value: true,
              remote_value: false,
            },
            client_timestamp: new Date().toISOString(),
          },
        ],
      },
    })

    expect(sync.statusCode).toBe(200)
    const results = sync.json().results as Array<{ id: string; status: string }>
    expect(results.find((r) => r.id === "sync-xp-1")?.status).toBe("synced")
    expect(results.find((r) => r.id === "sync-consent-1")?.status).toBe("conflict")

    const updated = await prisma.childProfile.findUnique({ where: { id: child.id } })
    expect(updated?.currentXp).toBe(80)

    // idempotent replay
    const replay = await app.inject({
      method: "POST",
      url: "/sync",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: {
        operations: [
          {
            id: "sync-xp-1",
            entity: "child.xp",
            action: "upsert",
            payload: { child_id: child.id, value: 80 },
            client_timestamp: new Date().toISOString(),
          },
        ],
      },
    })
    expect(replay.json().results[0].status).toBe("synced")
  })

  it("rejects sync outside guardianship", async () => {
    const app = await getApp()
    const parent = await registerAndLogin({
      email: "sync2@example.invalid",
      display_name: "Sync2",
      role: "PARENT",
    })
    const strangerChild = await prisma.childProfile.create({
      data: { displayName: "Other", birthYear: 2018, schoolLevel: "CE1" },
    })

    const sync = await app.inject({
      method: "POST",
      url: "/sync",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: {
        operations: [
          {
            id: "sync-deny-1",
            entity: "child.xp",
            action: "upsert",
            payload: { child_id: strangerChild.id, value: 10 },
            client_timestamp: new Date().toISOString(),
          },
        ],
      },
    })
    expect(sync.json().results[0].status).toBe("rejected")
  })
})
