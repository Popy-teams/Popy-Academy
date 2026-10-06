// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import Onboarding from "./Onboarding"

describe("Onboarding", () => {
  it("completes the profile setup journey", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<Onboarding onComplete={onComplete} />)

    await user.click(screen.getByRole("button", { name: /Parent/i }))
    await user.click(screen.getByRole("button", { name: /Continuer/i }))

    await user.click(screen.getByRole("button", { name: "CM1" }))
    await user.click(screen.getByRole("button", { name: /Séances courtes/i }))
    await user.click(screen.getByRole("button", { name: /Continuer/i }))

    expect(screen.getByText("Espace Parent")).toBeTruthy()
    expect(screen.getByText(/Niveau de référence : CM1/)).toBeTruthy()

    await user.click(screen.getByRole("button", { name: /Entrer dans Popy/i }))

    expect(onComplete).toHaveBeenCalledWith({
      role: "Parent",
      level: "CM1",
      needs: ["Lecture adaptée", "Séances courtes"],
    })
  })
})
