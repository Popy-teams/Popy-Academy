import { describe, expect, it } from "vitest"

import { getLearningPacks } from "../data/curriculum"
import { translateLabel } from "./i18n"
import { sectionSlug } from "./routes"
import {
  createReviewCard,
  getDueCards,
  scheduleReview,
} from "./spaced-repetition"

describe("child and adult learning journeys", () => {
  it("links child homework review to spaced repetition", () => {
    const now = new Date("2026-10-05T10:00:00.000Z")
    const card = createReviewCard(
      {
        id: "journey-math",
        subject: "Mathématiques",
        prompt: "1/2 ?",
        answer: "moitié",
      },
      now,
    )
    const reviewed = scheduleReview(card, "good", now)
    expect(getDueCards([reviewed], now)).toHaveLength(0)
    expect(reviewed.intervalDays).toBe(1)
  })

  it("provides teacher packs for a selected class level", () => {
    const packs = getLearningPacks("CE2", "Français")
    expect(packs.length).toBeGreaterThan(0)
    expect(packs.every((pack) => pack.correction && pack.evaluation)).toBe(
      true,
    )
  })

  it("keeps parent/teacher routes bilingual-friendly", () => {
    expect(sectionSlug("Vue d’ensemble")).toBe("vue-d-ensemble")
    expect(translateLabel("en", "Suivi de Léo")).toBe("Leo's progress")
    expect(translateLabel("es", "Ma classe")).toBe("Mi clase")
  })
})
