import { describe, expect, it } from "vitest"

import {
  curriculumBank,
  getCompetencies,
  getLearningPacks,
  importOfficialReferential,
  learningPacks,
  markPackInstitutional,
  schoolLevels,
  curriculumSubjects,
} from "./curriculum"

describe("curriculum bank", () => {
  it("covers every level and subject", () => {
    for (const level of schoolLevels) {
      for (const subject of curriculumSubjects) {
        expect(getCompetencies(level, subject).length).toBeGreaterThan(0)
      }
    }
  })

  it("contains unique competency identifiers", () => {
    const identifiers = curriculumBank.map((item) => item.id)
    expect(new Set(identifiers).size).toBe(identifiers.length)
  })

  it("provides complete lesson packs for each competency", () => {
    expect(learningPacks.length).toBe(curriculumBank.length)
    const pack = getLearningPacks("CE2", "Mathématiques")[0]
    expect(pack.lesson).toContain("Leçon")
    expect(pack.exercise).toContain("Exercice")
    expect(pack.correction).toContain("Correction")
    expect(pack.evaluation).toContain("Évaluation")
  })

  it("imports an official referential and marks it institutional", () => {
    const imported = importOfficialReferential([
      {
        code: "MATH-CE2-01",
        level: "CE2",
        subject: "Mathématiques",
        label: "Utiliser les fractions simples",
      },
    ])
    expect(imported[0].pack.validationStatus).toBe("institutional")
    expect(imported[0].competency.label).toContain("fractions")
    expect(markPackInstitutional(learningPacks[0]).validationStatus).toBe(
      "institutional",
    )
  })
})
