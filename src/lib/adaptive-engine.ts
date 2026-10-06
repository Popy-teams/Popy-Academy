export type LearnerProfile = "Standard" | "TDAH" | "Dyslexie" | "Dyspraxie" | "TSA"

export type LearnerContext = {
  profile: LearnerProfile
  successes: number
  errorStreak: number
  fatigue: "low" | "medium" | "high"
}

export type AdaptivePlan = {
  difficulty: "support" | "standard" | "challenge"
  sessionMinutes: number
  hintLevel: 0 | 1 | 2
  textDensity: "reduced" | "standard"
  audioEnabled: boolean
  breakRecommended: boolean
  message: string
}

export function getAdaptivePlan(context: LearnerContext): AdaptivePlan {
  const needsSupport = context.errorStreak >= 2 || context.fatigue === "high"
  const canIncreaseDifficulty =
    context.successes >= 3 &&
    context.errorStreak === 0 &&
    context.fatigue === "low"

  const sessionMinutes =
    context.fatigue === "high"
      ? 5
      : context.profile === "TDAH"
        ? 10
        : context.fatigue === "medium"
          ? 12
          : 15

  return {
    difficulty: needsSupport
      ? "support"
      : canIncreaseDifficulty
        ? "challenge"
        : "standard",
    sessionMinutes,
    hintLevel: needsSupport ? 2 : context.errorStreak === 1 ? 1 : 0,
    textDensity:
      context.profile === "Dyslexie" ||
      context.profile === "TDAH" ||
      context.fatigue !== "low"
        ? "reduced"
        : "standard",
    audioEnabled: context.profile === "Dyslexie" || context.fatigue === "high",
    breakRecommended:
      context.fatigue === "high" ||
      (context.profile === "TDAH" && context.successes >= 2),
    message: needsSupport
      ? "Popy simplifie la prochaine étape et propose un indice visuel."
      : canIncreaseDifficulty
        ? "Popy propose un petit défi supplémentaire."
        : "Le rythme actuel semble adapté.",
  }
}
