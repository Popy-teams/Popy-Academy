import { useEffect, useState } from "react"
import { Cloud, CloudOff, RefreshCw } from "lucide-react"

import {
  checkApiHealth,
  loadStoredAuth,
  pushSyncQueue,
} from "../lib/hybrid-sync"
import { fetchMySubscription } from "../lib/api-client"

/**
 * Au démarrage : santé API, sync file IndexedDB, rappel abonnement.
 * Ne bloque jamais l’UI — l’app reste utilisable hors ligne.
 */
export default function SessionBootstrap() {
  const [status, setStatus] = useState<"idle" | "syncing" | "ok" | "offline">(
    "idle",
  )
  const [detail, setDetail] = useState("")

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const healthy = await checkApiHealth()
      if (cancelled) return
      if (!healthy) {
        setStatus("offline")
        setDetail("Mode hors ligne — données locales disponibles")
        return
      }

      const auth = loadStoredAuth()
      if (auth?.access_token) {
        setStatus("syncing")
        try {
          const result = await pushSyncQueue()
          if (!cancelled) {
            setDetail(
              result.offline
                ? "Sync reportée (réseau)"
                : `Sync : ${result.synced} ok · ${result.conflict} conflits · ${result.rejected} refus`,
            )
          }
          const sub = await fetchMySubscription().catch(() => null)
          if (!cancelled && sub?.effective_access) {
            setDetail(
              (prev) =>
                `${prev} · Accès ${sub.effective_access.mode === "COMPUTER" ? "ordinateur" : "hybride"}`,
            )
          }
        } catch {
          if (!cancelled) setDetail("Sync différée")
        }
      } else {
        setDetail("API joignable — connectez un compte adulte pour synchroniser")
      }
      if (!cancelled) setStatus("ok")
    }

    void boot()
    const onOnline = () => void boot()
    window.addEventListener("online", onOnline)
    return () => {
      cancelled = true
      window.removeEventListener("online", onOnline)
    }
  }, [])

  if (status === "idle") return null

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-30 max-w-xs rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-lg backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {status === "offline" ? (
          <CloudOff size={14} className="text-amber-500" />
        ) : status === "syncing" ? (
          <RefreshCw size={14} className="animate-spin text-indigo-500" />
        ) : (
          <Cloud size={14} className="text-emerald-500" />
        )}
        <span>{detail || (status === "ok" ? "Prêt" : "…")}</span>
      </div>
    </div>
  )
}
