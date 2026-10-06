import { describe, expect, it } from "vitest"

import {
  classifyEntity,
  createSyncOperation,
  getDefaultStrategy,
  requiresAdultResolution,
  resolveLocalConflict,
} from "./offline-db"

describe("createSyncOperation", () => {
  it("creates a pending upsert operation", () => {
    const operation = createSyncOperation("child-stars", 120)

    expect(operation.entity).toBe("child-stars")
    expect(operation.payload).toBe(120)
    expect(operation.action).toBe("upsert")
    expect(operation.status).toBe("pending")
    expect(operation.id).toBeTruthy()
    expect(operation.createdAt).toBeTruthy()
  })
})

describe("conflict classification", () => {
  it("classifies progression, consent and deletion entities", () => {
    expect(classifyEntity("child-campaign-xp")).toBe("progression")
    expect(classifyEntity("parent-consents")).toBe("consent")
    expect(classifyEntity("class-permissions")).toBe("permission")
    expect(classifyEntity("child-profile", "delete")).toBe("deletion")
    expect(classifyEntity("child-workspace-notebook")).toBe("general")
  })

  it("picks the default strategy for each entity kind", () => {
    expect(getDefaultStrategy("progression")).toBe("merge")
    expect(getDefaultStrategy("consent")).toBe("restrictive")
    expect(getDefaultStrategy("permission")).toBe("restrictive")
    expect(getDefaultStrategy("deletion")).toBe("restrictive")
    expect(getDefaultStrategy("general")).toBe("manual")
  })

  it("requires an adult for sensitive conflicts", () => {
    expect(requiresAdultResolution("progression")).toBe(false)
    expect(requiresAdultResolution("consent")).toBe(true)
    expect(requiresAdultResolution("general")).toBe(true)
  })
})

describe("resolveLocalConflict", () => {
  it("resolves with local or remote strategy", () => {
    expect(resolveLocalConflict(10, 12, "local")).toBe(10)
    expect(resolveLocalConflict(10, 12, "remote")).toBe(12)
  })

  it("merges progressions by keeping the highest values", () => {
    expect(resolveLocalConflict(10, 12, "merge")).toBe(12)
    expect(
      resolveLocalConflict(
        { xp: 40, stars: 12 },
        { xp: 55, stars: 8, level: 3 },
        "merge",
      ),
    ).toEqual({ xp: 55, stars: 12, level: 3 })
  })

  it("applies the most restrictive decision for consents", () => {
    expect(resolveLocalConflict(true, false, "restrictive")).toBe(false)
    expect(
      resolveLocalConflict(
        { status: "granted", active: true },
        { status: "revoked", active: false },
        "restrictive",
      ),
    ).toEqual({ status: "revoked", active: false })
  })
})
