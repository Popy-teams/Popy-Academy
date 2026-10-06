import { describe, expect, it } from "vitest"
import { getApp, registerAndLogin } from "./setup.js"

describe("Phase 4 — domain APIs", () => {
  it("creates child and lists for parent", async () => {
    const app = await getApp()
    const parent = await registerAndLogin({
      email: "api-parent@example.invalid",
      display_name: "Parent API",
      role: "PARENT",
    })

    const create = await app.inject({
      method: "POST",
      url: "/children",
      headers: {
        authorization: `Bearer ${parent.token}`,
        "idempotency-key": "op-child-1",
      },
      payload: {
        display_name: "Lina Démo",
        birth_year: 2017,
        school_level: "CE2",
        operation_id: "op-child-1",
      },
    })
    expect(create.statusCode).toBe(201)
    const child = create.json() as { id: string }

    const again = await app.inject({
      method: "POST",
      url: "/children",
      headers: {
        authorization: `Bearer ${parent.token}`,
        "idempotency-key": "op-child-1",
      },
      payload: {
        display_name: "Lina Démo",
        birth_year: 2017,
        school_level: "CE2",
        operation_id: "op-child-1",
      },
    })
    expect(again.statusCode).toBe(200)
    expect(again.json().id).toBe(child.id)

    const list = await app.inject({
      method: "GET",
      url: "/children",
      headers: { authorization: `Bearer ${parent.token}` },
    })
    expect(list.statusCode).toBe(200)
    expect(list.json()).toHaveLength(1)
  })

  it("rejects unauthenticated content write", async () => {
    const app = await getApp()
    const res = await app.inject({
      method: "POST",
      url: "/contents",
      payload: {
        content_type: "exercise",
        subject: "maths",
        level: "CE2",
        title: "x",
        body: "y",
      },
    })
    expect(res.statusCode).toBe(401)
  })
})
