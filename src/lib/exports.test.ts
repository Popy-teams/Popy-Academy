import { describe, expect, it } from "vitest"

import { toCsv } from "./exports"

describe("toCsv", () => {
  it("serializes rows and escapes quotes", () => {
    expect(
      toCsv([
        { name: "Léo", note: 'Il dit "bonjour"', score: 8 },
        { name: "Jade", note: "Validé", score: 10 },
      ]),
    ).toBe(
      '"name","note","score"\n"Léo","Il dit ""bonjour""","8"\n"Jade","Validé","10"',
    )
  })

  it("returns an empty value when no rows are provided", () => {
    expect(toCsv([])).toBe("")
  })
})
