import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react"

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="size-11 rounded-xl bg-slate-200" />
      <div className="mt-5 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
    </div>
  )
}

export function StatePanel({
  state,
  title,
  description,
  onRetry,
}: {
  state: "empty" | "error" | "offline"
  title: string
  description: string
  onRetry?: () => void
}) {
  const Icon: LucideIcon = state === "empty" ? Inbox : AlertTriangle
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div
        className={`mx-auto grid size-12 place-items-center rounded-2xl ${
          state === "error"
            ? "bg-rose-50 text-rose-600"
            : state === "offline"
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon size={22} />
      </div>
      <h2 className="mt-4 font-display text-lg font-black text-slate-900">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-slate-500">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
        >
          <RefreshCw size={16} /> Réessayer
        </button>
      )}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <span className="text-sm font-extrabold text-indigo-600">
          {eyebrow}
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
