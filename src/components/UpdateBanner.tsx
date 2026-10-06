import { useEffect, useState } from "react"
import { RefreshCw, X } from "lucide-react"

import { useI18n } from "../lib/i18n"
import {
  requestServiceWorkerUpdate,
  shouldShowUpdatePrompt,
} from "../lib/pwa"

export default function UpdateBanner() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    let cancelled = false

    navigator.serviceWorker.getRegistration().then((current) => {
      if (cancelled || !current) return
      setRegistration(current)
      if (shouldShowUpdatePrompt(current)) setVisible(true)
      current.addEventListener("updatefound", () => {
        const worker = current.installing
        if (!worker) return
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setVisible(true)
          }
        })
      })
    })

    const onControllerChange = () => window.location.reload()
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    )

    return () => {
      cancelled = true
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      )
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-20 z-[70] mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-2xl md:inset-x-auto md:right-6 md:bottom-6">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
        <RefreshCw size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-slate-900">
          {t("Mise à jour disponible")}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {t("Une nouvelle version de Popy Academy est prête.")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              await requestServiceWorkerUpdate(registration)
              window.location.reload()
            }}
            className="rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-black text-white"
          >
            {t("Actualiser maintenant")}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-600"
          >
            {t("Plus tard")}
          </button>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-400"
        aria-label={t("Plus tard")}
      >
        <X size={15} />
      </button>
    </div>
  )
}
