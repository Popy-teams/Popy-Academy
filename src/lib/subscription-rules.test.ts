import { describe, expect, it } from "vitest"

/** Règle produit : le robot n’est jamais une condition d’accès. */
export function isRobotRequired(_planCode: string) {
  return false
}

export function defaultAccessMode(robotEnabled: boolean) {
  return robotEnabled ? "HYBRID" : "COMPUTER"
}

describe("subscription product rules", () => {
  it("never requires a robot", () => {
    for (const code of ["ordinateur", "famille", "ecole"]) {
      expect(isRobotRequired(code)).toBe(false)
    }
  })

  it("defaults to computer mode without robot", () => {
    expect(defaultAccessMode(false)).toBe("COMPUTER")
    expect(defaultAccessMode(true)).toBe("HYBRID")
  })
})
