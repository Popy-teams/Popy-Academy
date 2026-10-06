import { Monitor, Bot } from "lucide-react"

/** Bannière produit : ordinateur = expérience complète ; robot = option. */
export default function ComputerFirstBanner({
  compact = false,
}: {
  compact?: boolean
}) {
  if (compact) {
    return (
      <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">
        Tout fonctionne sur ordinateur. Le robot Popy est optionnel.
      </p>
    )
  }

  return (
    <aside className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white">
          <Monitor size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-black text-slate-900">
            Apprendre sans robot, c’est prévu
          </h2>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600">
            Popy Academy est entièrement utilisable sur ordinateur ou tablette.
            Le robot est un complément pour les familles ou classes qui en ont
            un — jamais une condition d’accès.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
            <span className="rounded-full bg-white px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
              Ordinateur inclus
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-slate-500 ring-1 ring-slate-200">
              <Bot size={12} /> Robot optionnel
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
