import { describe, expect, it } from "vitest"

import {
  buildEvaluation,
  createReviewCard,
  getDueCards,
  scheduleReview,
} from "./spaced-repetition"

describe("spaced repetition", () => {
  it("schedules a successful review into the future", () => {
    const now = new Date("2026-10-05T10:00:00.000Z")
    const card = createReviewCard(
      {
        id: "math-1",
        subject: "Mathématiques",
        prompt: "2 + 2 ?",
        answer: "4",
      },
      now,
    )

    const reviewed = scheduleReview(card, "good", now)

    expect(reviewed.repetitions).toBe(1)
    expect(reviewed.intervalDays).toBe(1)
    expect(reviewed.nextReviewAt).toBe("2026-10-06T10:00:00.000Z")
  })

  it("resets the interval after a failed review", () => {
    const now = new Date("2026-10-05T10:00:00.000Z")
    const card = scheduleReview(
      createReviewCard(
        {
          id: "fr-1",
          subject: "Français",
          prompt: "Pluriel de chat ?",
          answer: "chats",
        },
        now,
      ),
      "good",
      now,
    )

    const failed = scheduleReview(card, "again", now)
    expect(failed.repetitions).toBe(0)
    expect(failed.intervalDays).toBe(0)
    expect(failed.nextReviewAt).toBe(now.toISOString())
  })

  it("returns due cards and builds an evaluation set", () => {
    const now = new Date("2026-10-05T10:00:00.000Z")
    const dueCard = createReviewCard(
      {
        id: "due",
        subject: "Sciences",
        prompt: "L’eau bouillante devient ?",
        answer: "vapeur",
      },
      now,
    )
    const laterCard = {
      ...createReviewCard(
        {
          id: "later",
          subject: "Sciences",
          prompt: "La glace est ?",
          answer: "solide",
        },
        now,
      ),
      nextReviewAt: "2026-10-08T10:00:00.000Z",
    }

    expect(getDueCards([dueCard, laterCard], now).map((card) => card.id)).toEqual([
      "due",
    ])
    expect(buildEvaluation([dueCard, laterCard], 2, now)).toHaveLength(2)
  })
})
