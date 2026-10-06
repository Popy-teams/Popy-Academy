import { describe, expect, it } from "vitest"
import { getApp, prisma, registerAndLogin } from "./setup.js"

async function seedPlans() {
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        code: "ordinateur",
        name: "Ordinateur",
        description: "PC only",
        priceCentsMonth: 0,
        maxChildren: 2,
        computerAccess: true,
        robotOptional: true,
        robotIncluded: false,
        features: ["computer"],
        sortOrder: 1,
      },
      {
        code: "famille",
        name: "Famille",
        description: "Family",
        priceCentsMonth: 1299,
        maxChildren: 5,
        computerAccess: true,
        robotOptional: true,
        robotIncluded: false,
        features: ["computer", "multi"],
        sortOrder: 2,
      },
      {
        code: "ecole",
        name: "École",
        description: "School",
        priceCentsMonth: 9900,
        maxChildren: 200,
        computerAccess: true,
        robotOptional: true,
        robotIncluded: false,
        features: ["school"],
        sortOrder: 3,
      },
    ],
  })
}

describe("Subscriptions + computer-first", () => {
  it("lists plans where computer access is always true and robot never required", async () => {
    await seedPlans()
    const app = await getApp()
    const res = await app.inject({ method: "GET", url: "/subscriptions/plans" })
    expect(res.statusCode).toBe(200)
    const body = res.json() as {
      principle: string
      plans: Array<{ computer_access: boolean; robot_included: boolean }>
    }
    expect(body.principle).toMatch(/ordinateur/i)
    expect(body.plans.length).toBe(3)
    expect(body.plans.every((p) => p.computer_access)).toBe(true)
    expect(body.plans.every((p) => p.robot_included === false)).toBe(true)
  })

  it("subscribes parent to computer plan without robot", async () => {
    await seedPlans()
    const app = await getApp()
    const parent = await registerAndLogin({
      email: "sub@example.invalid",
      display_name: "Sub Parent",
      role: "PARENT",
    })

    const sub = await app.inject({
      method: "POST",
      url: "/subscriptions/subscribe",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: {
        plan_code: "ordinateur",
        access_mode: "COMPUTER",
        robot_enabled: false,
      },
    })
    expect(sub.statusCode).toBe(201)
    expect(sub.json().robot_required).toBe(false)
    expect(sub.json().access_mode).toBe("COMPUTER")

    const me = await app.inject({
      method: "GET",
      url: "/subscriptions/me",
      headers: { authorization: `Bearer ${parent.token}` },
    })
    expect(me.statusCode).toBe(200)
    expect(me.json().effective_access.computer_ok).toBe(true)
    expect(me.json().effective_access.robot_required).toBe(false)
  })

  it("blocks AESH from changing subscription", async () => {
    await seedPlans()
    const app = await getApp()
    const aesh = await registerAndLogin({
      email: "aesh-sub@example.invalid",
      display_name: "AESH",
      role: "AESH",
    })
    const res = await app.inject({
      method: "POST",
      url: "/subscriptions/subscribe",
      headers: { authorization: `Bearer ${aesh.token}` },
      payload: { plan_code: "ordinateur" },
    })
    expect(res.statusCode).toBe(403)
  })
})
