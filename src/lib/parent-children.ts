export type LinkedChild = {
  id: string
  name: string
  level: string
  relationship: string
  initials: string
  color: string
  focus: string
  activitiesDone: number
  learningMinutes: number
  goalsPercent: number
  streakDays: number
}

export const defaultLinkedChildren: LinkedChild[] = [
  {
    id: "child-leo",
    name: "Léo Martin",
    level: "CE2",
    relationship: "Fils",
    initials: "LM",
    color: "bg-amber-100 text-amber-800",
    focus: "Fractions et lecture fluide",
    activitiesDone: 18,
    learningMinutes: 200,
    goalsPercent: 82,
    streakDays: 7,
  },
  {
    id: "child-mia",
    name: "Mia Martin",
    level: "CP",
    relationship: "Fille",
    initials: "MM",
    color: "bg-rose-100 text-rose-800",
    focus: "Syllabes et numération",
    activitiesDone: 11,
    learningMinutes: 140,
    goalsPercent: 74,
    streakDays: 4,
  },
]
