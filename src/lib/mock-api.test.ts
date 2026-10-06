import { describe, expect, it } from "vitest"

import { MockApiError, mockRequest } from "./mock-api"

describe("mockRequest", () => {
  it("returns a cloned response", async () => {
    const payload = { score: 8 }
    const response = await mockRequest(payload, { latency: 0 })

    expect(response).toEqual(payload)
    expect(response).not.toBe(payload)
  })

  it("exposes an offline error state", async () => {
    await expect(
      mockRequest({}, { latency: 0, offline: true }),
    ).rejects.toBeInstanceOf(MockApiError)
  })
})
