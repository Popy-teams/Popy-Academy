// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

import { trapFocus } from "../components/AccessibleModal"

describe("trapFocus", () => {
  it("cycles focus forward and backward inside a dialog", () => {
    document.body.innerHTML = `
      <div id="dialog">
        <button id="first">First</button>
        <button id="last">Last</button>
      </div>
    `
    const dialog = document.getElementById("dialog")!
    const first = document.getElementById("first")!
    const last = document.getElementById("last")!
    last.focus()

    const forward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    })
    expect(trapFocus(dialog, forward)).toBe(true)
    expect(document.activeElement).toBe(first)

    first.focus()
    const backward = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    expect(trapFocus(dialog, backward)).toBe(true)
    expect(document.activeElement).toBe(last)
  })
})
