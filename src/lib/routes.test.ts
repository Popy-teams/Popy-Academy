import { describe, expect, it } from "vitest"

import { sectionSlug } from "./routes"

describe("sectionSlug", () => {
  it("creates stable shareable route segments", () => {
    expect(sectionSlug("Éditeur d’activités")).toBe("editeur-d-activites")
    expect(sectionSlug("Jeux & défis")).toBe("jeux-et-defis")
    expect(sectionSlug("Vue d’ensemble")).toBe("vue-d-ensemble")
  })
})
