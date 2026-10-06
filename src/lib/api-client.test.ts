// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from "vitest"
import { fetchSubscriptionPlans } from "./api-client"

describe("api-client subscriptions", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("reads public plans catalogue", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          principle: "ordinateur",
          plans: [
            {
              code: "ordinateur",
              computer_access: true,
              robot_included: false,
            },
          ],
        }),
      }),
    )
    const result = await fetchSubscriptionPlans()
    expect(result.plans[0].computer_access).toBe(true)
    expect(result.plans[0].robot_included).toBe(false)
  })
})
