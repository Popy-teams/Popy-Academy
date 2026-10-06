export type ReviewQuality = "again" | "hard" | "good" | "easy"

export type ReviewCard = {
  id: string
  prompt: string
  answer: string
  subject: string
  easeFactor: number
  intervalDays: number
  repetitions: number
  nextReviewAt: string
  lastResult?: ReviewQuality
}

const qualityScores: Record<ReviewQuality, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
}

export function createReviewCard(
  input: Pick<ReviewCard, "id" | "prompt" | "answer" | "subject">,
  now = new Date(),
): ReviewCard {
  return {
    ...input,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: now.toISOString(),
  }
}

export function scheduleReview(
  card: ReviewCard,
  quality: ReviewQuality,
  now = new Date(),
): ReviewCard {
  const score = qualityScores[quality]
  let easeFactor = card.easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
  easeFactor = Math.max(1.3, Number(easeFactor.toFixed(2)))

  let repetitions = card.repetitions
  let intervalDays = card.intervalDays

  if (score < 3) {
    repetitions = 0
    intervalDays = 0
  } else {
    repetitions += 1
    if (repetitions === 1) intervalDays = 1
    else if (repetitions === 2) intervalDays = 3
    else intervalDays = Math.max(1, Math.round(card.intervalDays * easeFactor))
    if (quality === "hard") intervalDays = Math.max(1, Math.round(intervalDays * 0.8))
    if (quality === "easy") intervalDays = Math.max(1, Math.round(intervalDays * 1.3))
  }

  const nextReviewAt = new Date(now)
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays)

  return {
    ...card,
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt: nextReviewAt.toISOString(),
    lastResult: quality,
  }
}

export function getDueCards(cards: ReviewCard[], now = new Date()) {
  const timestamp = now.getTime()
  return cards
    .filter((card) => new Date(card.nextReviewAt).getTime() <= timestamp)
    .sort(
      (a, b) =>
        new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime(),
    )
}

export function buildEvaluation(
  cards: ReviewCard[],
  count = 5,
  now = new Date(),
) {
  const due = getDueCards(cards, now)
  const pool = due.length >= count ? due : [...due, ...cards]
  const unique = new Map(pool.map((card) => [card.id, card]))
  return [...unique.values()].slice(0, count)
}

export const defaultReviewDeck: ReviewCard[] = [
  createReviewCard({
    id: "math-half",
    subject: "Mathématiques",
    prompt: "Quelle part représente 1/2 ?",
    answer: "La moitié",
  }),
  createReviewCard({
    id: "math-add",
    subject: "Mathématiques",
    prompt: "Combien font 7 + 5 ?",
    answer: "12",
  }),
  createReviewCard({
    id: "fr-verb",
    subject: "Français",
    prompt: "Les oiseaux ___ .",
    answer: "chantent",
  }),
  createReviewCard({
    id: "science-vapor",
    subject: "Sciences",
    prompt: "Quand l’eau chauffe, elle devient…",
    answer: "de la vapeur",
  }),
  createReviewCard({
    id: "tech-algo",
    subject: "Technologie",
    prompt: "Un algorithme est…",
    answer: "une suite d’instructions",
  }),
  createReviewCard({
    id: "hist-time",
    subject: "Histoire-Géographie",
    prompt: "Se repérer dans le temps, c’est…",
    answer: "ordonner des événements passés",
  }),
]
