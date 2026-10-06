import { describe, expect, it } from "vitest"

import {
  isSelectiveCacheRequest,
  shouldShowUpdatePrompt,
} from "./pwa"

describe("pwa helpers", () => {
  it("caches only the app shell and static assets", () => {
    expect(isSelectiveCacheRequest("/")).toBe(true)
    expect(isSelectiveCacheRequest("/offline.html")).toBe(true)
    expect(isSelectiveCacheRequest("/assets/app.js")).toBe(true)
    expect(isSelectiveCacheRequest("/api/sync")).toBe(false)
    expect(isSelectiveCacheRequest("/profiles/leo")).toBe(false)
  })

  it("shows an update prompt when a worker is waiting", () => {
    expect(shouldShowUpdatePrompt({ waiting: {} })).toBe(true)
    expect(shouldShowUpdatePrompt({ waiting: undefined })).toBe(false)
    expect(shouldShowUpdatePrompt(null)).toBe(false)
  })
})
