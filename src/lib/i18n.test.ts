import { describe, expect, it } from "vitest"

import { translateLabel } from "./i18n"
import { sectionSlug } from "./routes"

describe("global navigation i18n", () => {
  it("translates child and adult navigation labels", () => {
    expect(translateLabel("en", "Mon bureau")).toBe("My desk")
    expect(translateLabel("es", "Éditeur d’activités")).toBe(
      "Editor de actividades",
    )
    expect(translateLabel("en", "Pilotage")).toBe("Operations")
    expect(translateLabel("es", "Mode hors ligne")).toBe("Modo sin conexión")
    expect(translateLabel("en", "Rechercher une activité...")).toBe(
      "Search an activity...",
    )
  })

  it("translates pedagogical competency labels", () => {
    expect(
      translateLabel("en", "Résoudre un problème"),
    ).toBe("Solve a problem")
    expect(
      translateLabel("es", "Révision espacée"),
    ).toBe("Repaso espaciado")
    expect(translateLabel("en", "Aller au contenu principal")).toBe(
      "Skip to main content",
    )
  })
})
