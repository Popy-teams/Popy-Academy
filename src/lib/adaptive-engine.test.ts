import { describe, expect, it } from "vitest"

import { getAdaptivePlan } from "./adaptive-engine"

describe("getAdaptivePlan", () => {
  it("reduces load when fatigue is high", () => {
    const plan = getAdaptivePlan({
      profile: "Standard",
      successes: 1,
      errorStreak: 2,
      fatigue: "high",
    })

    expect(plan.difficulty).toBe("support")
    expect(plan.sessionMinutes).toBe(5)
    expect(plan.breakRecommended).toBe(true)
    expect(plan.hintLevel).toBe(2)
  })

  it("offers a challenge after repeated success", () => {
    const plan = getAdaptivePlan({
      profile: "Standard",
      successes: 4,
      errorStreak: 0,
      fatigue: "low",
    })

    expect(plan.difficulty).toBe("challenge")
    expect(plan.hintLevel).toBe(0)
  })

  it("keeps sessions short for a TDAH profile", () => {
    const plan = getAdaptivePlan({
      profile: "TDAH",
      successes: 1,
      errorStreak: 0,
      fatigue: "low",
    })

    expect(plan.sessionMinutes).toBe(10)
    expect(plan.textDensity).toBe("reduced")
  })
})
