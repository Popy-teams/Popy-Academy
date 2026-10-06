import { describe, expect, it } from "vitest"
import { getApp } from "./setup.js"

describe("Phase 0 — health", () => {
  it("GET /health returns ok with database up", async () => {
    const app = await getApp()
    const res = await app.inject({ method: "GET", url: "/health" })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchObject({ status: "ok", database: "up" })
  })
})
