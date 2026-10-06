export const schoolLevels = ["CP", "CE1", "CE2", "CM1", "CM2"] as const
export const curriculumSubjects = [
  "Français",
  "Mathématiques",
  "Sciences",
  "Histoire-Géographie",
  "Anglais",
  "Technologie",
] as const

export type SchoolLevel = (typeof schoolLevels)[number]
export type CurriculumSubject = (typeof curriculumSubjects)[number]
export type ValidationStatus = "draft" | "reviewed" | "institutional"

const subjectSkills: Record<CurriculumSubject, string[]> = {
  Français: [
    "Lire et comprendre un texte adapté au niveau",
    "Écrire une réponse organisée",
    "Mobiliser le vocabulaire et la grammaire",
  ],
  Mathématiques: [
    "Utiliser les nombres et les opérations",
    "Résoudre un problème",
    "Représenter l’espace et les grandeurs",
  ],
  Sciences: [
    "Observer et questionner le monde",
    "Conduire une expérience",
    "Expliquer un phénomène simplement",
  ],
  "Histoire-Géographie": [
    "Se repérer dans le temps",
    "Se repérer dans l’espace",
    "Lire un document historique ou géographique",
  ],
  Anglais: [
    "Comprendre des mots familiers",
    "S’exprimer avec des phrases simples",
    "Écouter et reproduire une prononciation",
  ],
  Technologie: [
    "Décrire un objet technique",
    "Construire une suite d’instructions",
    "Comprendre un système simple",
  ],
}

export type CurriculumCompetency = {
  id: string
  level: SchoolLevel
  subject: CurriculumSubject
  label: string
  sequence: number
  status: "structured"
}

export type LearningPack = {
  id: string
  competencyId: string
  level: SchoolLevel
  subject: CurriculumSubject
  title: string
  lesson: string
  exercise: string
  correction: string
  evaluation: string
  validationStatus: ValidationStatus
}

export const curriculumBank: CurriculumCompetency[] = schoolLevels.flatMap(
  (level) =>
    curriculumSubjects.flatMap((subject) =>
      subjectSkills[subject].map((label, index) => ({
        id: `${level.toLowerCase()}-${subject
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z]/g, "-")
          .toLowerCase()}-${index + 1}`,
        level,
        subject,
        label,
        sequence: index + 1,
        status: "structured" as const,
      })),
    ),
)

function buildLearningPack(competency: CurriculumCompetency): LearningPack {
  return {
    id: `pack-${competency.id}`,
    competencyId: competency.id,
    level: competency.level,
    subject: competency.subject,
    title: `${competency.subject} · ${competency.label}`,
    lesson: `Leçon ${competency.level} : ${competency.label}. Commence par un exemple concret, puis explique la notion en 3 phrases courtes adaptées au niveau.`,
    exercise: `Exercice : applique « ${competency.label} » en 2 questions progressives, avec un support visuel et une consigne audio possible.`,
    correction: `Correction : vérifier la compréhension de « ${competency.label} », accepter les formulations équivalentes et proposer un feedback bienveillant.`,
    evaluation: `Évaluation : 3 items (rappel, application, transfert) sur « ${competency.label} », avec barème maîtrisé / en cours / à soutenir.`,
    validationStatus: competency.sequence === 1 ? "reviewed" : "draft",
  }
}

export const learningPacks: LearningPack[] =
  curriculumBank.map(buildLearningPack)

export function getCompetencies(
  level: SchoolLevel,
  subject: CurriculumSubject,
) {
  return curriculumBank.filter(
    (competency) =>
      competency.level === level && competency.subject === subject,
  )
}

export function getLearningPack(competencyId: string) {
  return learningPacks.find((pack) => pack.competencyId === competencyId)
}

export function getLearningPacks(
  level: SchoolLevel,
  subject: CurriculumSubject,
) {
  return learningPacks.filter(
    (pack) => pack.level === level && pack.subject === subject,
  )
}

export function markPackInstitutional(pack: LearningPack): LearningPack {
  return { ...pack, validationStatus: "institutional" }
}

export type OfficialReferentialItem = {
  code: string
  level: SchoolLevel
  subject: CurriculumSubject
  label: string
}

export function importOfficialReferential(items: OfficialReferentialItem[]) {
  return items.map((item, index) => {
    const competencyId = `${item.level.toLowerCase()}-import-${item.code
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`
    const competency: CurriculumCompetency = {
      id: competencyId,
      level: item.level,
      subject: item.subject,
      label: item.label,
      sequence: index + 1,
      status: "structured",
    }
    return {
      competency,
      pack: {
        ...buildLearningPack(competency),
        validationStatus: "institutional" as const,
        title: `${item.code} · ${item.label}`,
      },
    }
  })
}
