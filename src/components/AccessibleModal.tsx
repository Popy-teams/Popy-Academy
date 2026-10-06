import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function trapFocus(
  container: HTMLElement,
  event: KeyboardEvent | ReactKeyboardEvent,
) {
  if (event.key !== "Tab") return false
  const focusable = [
    ...container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ].filter((node) => !node.hasAttribute("disabled") && node.tabIndex !== -1)
  if (!focusable.length) return false
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault()
    last.focus()
    return true
  }
  if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault()
    first.focus()
    return true
  }
  return false
}

export default function AccessibleModal({
  title,
  onClose,
  children,
  className = "max-w-3xl",
  align = "center",
}: {
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
  align?: "center" | "end"
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE)
    focusable?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (panel) trapFocus(panel, event)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-[80] bg-slate-950/50 p-4 backdrop-blur-sm ${
        align === "end" ? "flex justify-end" : "grid place-items-center"
      }`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-[30px] bg-white p-6 shadow-2xl outline-none ${className}`}
      >
        <span id={titleId} className="sr-only">
          {title}
        </span>
        {children}
      </div>
    </div>
  )
}

export function LiveRegion({
  message,
  politeness = "polite",
}: {
  message: string
  politeness?: "polite" | "assertive"
}) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live={politeness}
      className="rounded-xl bg-emerald-50 p-3 text-xs font-black text-emerald-800"
    >
      {message}
    </div>
  )
}
