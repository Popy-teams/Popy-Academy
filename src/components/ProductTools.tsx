import { useEffect, useState } from "react"
import {
  Accessibility,
  AlertTriangle,
  Battery,
  Bot,
  ChevronDown,
  ChevronUp,
  Contrast,
  Database,
  Download,
  Eye,
  Gauge,
  Lightbulb,
  Mic,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
  Palette,
  Pause,
  RotateCcw,
  RefreshCw,
  Settings,
  Volume2,
  Wifi,
  Upload,
  X,
  Zap,
} from "lucide-react"

import { exportJson } from "../lib/exports"
import {
  clearAllLocalData,
  clearSyncedOperations,
  classifyEntity,
  getDefaultStrategy,
  getSyncQueue,
  markOperationConflict,
  resolveSyncConflict,
  simulateSyncPass,
  type ConflictStrategy,
  type SyncOperation,
  writeLocalData,
} from "../lib/offline-db"
import { usePersistentState } from "../lib/persistence"
import { pushSyncQueue } from "../lib/hybrid-sync"
import AccessibleModal, { LiveRegion } from "./AccessibleModal"

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = usePersistentState("accessibility-global", {
    textSize: "Normal",
    contrast: false,
    reduceMotion: false,
    dysMode: false,
    largeTargets: false,
    calmMode: false,
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("a11y-high-contrast", settings.contrast)
    root.classList.toggle("a11y-reduce-motion", settings.reduceMotion)
    root.classList.toggle("a11y-dys", settings.dysMode)
    root.classList.toggle("a11y-large-targets", settings.largeTargets)
    root.classList.toggle("a11y-calm", settings.calmMode)
    root.dataset.textSize = settings.textSize
  }, [settings])

  const toggle = (key: keyof typeof settings) =>
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 grid size-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-xl"
        aria-label="Ouvrir les réglages d’accessibilité"
      >
        <Accessibility size={22} />
      </button>
      {open && (
        <AccessibleModal
          title="Réglages d’accessibilité"
          onClose={() => setOpen(false)}
          align="end"
          className="h-full max-w-md rounded-none"
        >
          <aside>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Réglages universels
                </p>
                <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
                  Mon confort
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"
                aria-label="Fermer les réglages d’accessibilité"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-7 text-xs font-black text-slate-500">
              Taille du texte
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Normal", "Grand", "Très grand"].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSettings((current) => ({
                      ...current,
                      textSize: size,
                    }))
                  }
                  className={`rounded-xl py-3 text-xs font-black ${
                    settings.textSize === size
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["contrast", "Contraste renforcé", Contrast],
                ["reduceMotion", "Réduire les animations", Pause],
                ["dysMode", "Lecture DYS globale", Eye],
                ["largeTargets", "Grandes zones tactiles", Accessibility],
                ["calmMode", "Interface apaisée", Palette],
              ].map(([key, label, Icon]) => {
                const SettingIcon = Icon as typeof Contrast
                const active = settings[
                  key as keyof typeof settings
                ] as boolean
                return (
                  <button
                    key={key as string}
                    onClick={() => toggle(key as keyof typeof settings)}
                    aria-pressed={active}
                    className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-white text-indigo-700">
                      <SettingIcon size={19} />
                    </span>
                    <span className="flex-1 text-sm font-black text-slate-800">
                      {label as string}
                    </span>
                    <span
                      className={`relative h-6 w-11 rounded-full ${
                        active ? "bg-emerald-600" : "bg-slate-400"
                      }`}
                    >
                      <span
                        className={`absolute top-1 size-4 rounded-full bg-white transition ${
                          active ? "left-6" : "left-1"
                        }`}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        </AccessibleModal>
      )}
    </>
  )
}

export function RobotSimulator() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [battery, setBattery] = useState(73)
  const [online, setOnline] = useState(true)
  const [listening, setListening] = useState(false)
  const [led, setLed] = useState("Indigo")
  const [lastAction, setLastAction] = useState("Popy attend une commande.")

  const move = (direction: string) => {
    setLastAction(`Déplacement simulé : ${direction}.`)
    setBattery((current) => Math.max(0, current - 1))
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-20 z-40 grid size-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-xl"
        aria-label="Ouvrir le simulateur robot (optionnel)"
      >
        <Bot size={22} />
      </button>
      {open && (
        <AccessibleModal
          title="Simulateur Popy (optionnel)"
          onClose={() => setOpen(false)}
          className="max-w-4xl overflow-hidden p-0"
        >
          <section>
            <header className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-violet-500/20 text-violet-300">
                  <Bot size={21} />
                </div>
                <div>
                  <h2 className="font-display font-black">
                    Simulateur robot (optionnel)
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400">
                    L’app fonctionne sans robot — ceci est un complément
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="grid size-9 place-items-center rounded-xl bg-white/10"
                  aria-label={
                    expanded
                      ? "Réduire le simulateur"
                      : "Développer le simulateur"
                  }
                >
                  {expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronUp size={18} />
                  )}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-9 place-items-center rounded-xl bg-white/10"
                  aria-label="Fermer le simulateur du robot"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {expanded && (
              <div className="grid gap-5 p-5 md:grid-cols-[0.8fr_1.2fr]">
                <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500">
                  <div className="popy-robot-simulator">
                    <Bot size={100} strokeWidth={1.4} className="text-white" />
                  </div>
                  <span
                    className="absolute bottom-5 rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white"
                    aria-live="polite"
                  >
                    {lastAction}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <StatusCard
                      icon={Battery}
                      label="Batterie"
                      value={`${battery}%`}
                    />
                    <StatusCard
                      icon={Wifi}
                      label="Connexion"
                      value={online ? "Connecté" : "Hors ligne"}
                    />
                    <StatusCard
                      icon={Gauge}
                      label="Température"
                      value="32 °C"
                    />
                    <StatusCard icon={Zap} label="Obstacle" value="0,8 m" />
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Déplacements
                    </p>
                    <div className="mx-auto mt-3 grid w-36 grid-cols-3 gap-2">
                      <span />
                      <ControlButton
                        icon={MoveUp}
                        label="Avancer"
                        onClick={() => move("avant")}
                      />
                      <span />
                      <ControlButton
                        icon={MoveLeft}
                        label="Gauche"
                        onClick={() => move("gauche")}
                      />
                      <ControlButton
                        icon={RotateCcw}
                        label="Rotation"
                        onClick={() => move("rotation")}
                      />
                      <ControlButton
                        icon={MoveRight}
                        label="Droite"
                        onClick={() => move("droite")}
                      />
                      <span />
                      <ControlButton
                        icon={MoveDown}
                        label="Reculer"
                        onClick={() => move("arrière")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setListening(!listening)
                        setLastAction(
                          listening
                            ? "Microphones en pause."
                            : "Popy écoute le mot d’activation.",
                        )
                      }}
                      className={`flex items-center gap-2 rounded-xl p-3 text-xs font-black ${
                        listening
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Mic size={17} />
                      {listening ? "Écoute active" : "Activer l’écoute"}
                    </button>
                    <button
                      onClick={() => setOnline(!online)}
                      className="flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-xs font-black text-slate-600"
                    >
                      <Settings size={17} />
                      {online ? "Passer hors ligne" : "Reconnecter"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" />
                    {["Indigo", "Cyan", "Ambre"].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setLed(color)
                          setLastAction(`LED réglées sur ${color}.`)
                        }}
                        className={`rounded-lg px-3 py-2 text-[10px] font-black ${
                          led === color
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </AccessibleModal>
      )}
    </>
  )
}

export function DataManagement() {
  const [open, setOpen] = useState(false)
  const [queue, setQueue] = useState<SyncOperation[]>([])
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState("")

  const refreshQueue = async () => {
    setQueue(await getSyncQueue())
  }

  useEffect(() => {
    if (open) refreshQueue()
  }, [open])

  const conflicts = queue.filter((operation) => operation.status === "conflict")

  const exportBackup = () => {
    const data = Object.fromEntries(
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("popy-academy:"))
        .map((key) => [key, window.localStorage.getItem(key)]),
    )
    exportJson("popy-academy-sauvegarde-locale.json", {
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    })
    setMessage("Sauvegarde exportée.")
  }

  const importBackup = async (file: File) => {
    try {
      const backup = JSON.parse(await file.text()) as {
        version?: number
        data?: Record<string, string>
      }
      if (backup.version !== 1 || !backup.data) {
        throw new Error("Format incompatible")
      }
      await Promise.all(
        Object.entries(backup.data)
          .filter(([key]) => key.startsWith("popy-academy:"))
          .map(async ([key, value]) => {
            window.localStorage.setItem(key, value)
            const databaseKey = key.replace("popy-academy:", "")
            await writeLocalData(databaseKey, JSON.parse(value))
          }),
      )
      setMessage(
        "Sauvegarde importée. Rechargez l’application pour l’appliquer.",
      )
    } catch {
      setMessage("Le fichier sélectionné n’est pas une sauvegarde Popy valide.")
    }
  }

  const resolveConflict = async (
    operation: SyncOperation,
    strategy: ConflictStrategy,
  ) => {
    try {
      const kind = classifyEntity(operation.entity, operation.action)
      const adultConfirmed =
        operation.requiresAdult ||
        kind === "consent" ||
        kind === "permission" ||
        kind === "deletion" ||
        kind === "general"
          ? window.confirm(
              "Confirmer la résolution de ce conflit sensible en tant qu’adulte ?",
            )
          : false
      if (
        (operation.requiresAdult ||
          kind === "consent" ||
          kind === "permission" ||
          kind === "deletion" ||
          kind === "general") &&
        strategy !== "restrictive" &&
        !adultConfirmed
      ) {
        setMessage("Résolution annulée : confirmation adulte requise.")
        return
      }
      await resolveSyncConflict(operation.id, strategy, { adultConfirmed: true })
      await refreshQueue()
      setMessage(`Conflit résolu avec la stratégie « ${strategy} ».`)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de résoudre ce conflit.",
      )
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-[8.75rem] z-40 grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xl"
        aria-label="Ouvrir la gestion des données"
      >
        <Database size={21} />
      </button>
      {open && (
        <AccessibleModal
          title="Sauvegarde et synchronisation"
          onClose={() => setOpen(false)}
        >
          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                  Données hors ligne
                </p>
                <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
                  Sauvegarde et synchronisation
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"
                aria-label="Fermer la gestion des données"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5">
              <LiveRegion message={message} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                onClick={exportBackup}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs font-black text-indigo-700"
              >
                <Download size={17} /> Exporter
              </button>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-50 px-4 py-3 text-xs font-black text-cyan-700">
                <Upload size={17} /> Importer
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) importBackup(file)
                  }}
                />
              </label>
              <button
                disabled={working}
                onClick={async () => {
                  setWorking(true)
                  try {
                    const remote = await pushSyncQueue()
                    if (remote.offline) {
                      const results = await simulateSyncPass()
                      await refreshQueue()
                      setMessage(
                        `Backend indisponible — sync locale : ${results.synced} synchronisée(s), ${results.conflict} conflit(s), ${results.rejected} rejet(s).`,
                      )
                    } else {
                      await refreshQueue()
                      setMessage(
                        `Sync backend : ${remote.synced} synchronisée(s), ${remote.conflict} conflit(s), ${remote.rejected} rejet(s).`,
                      )
                    }
                  } catch {
                    const results = await simulateSyncPass()
                    await refreshQueue()
                    setMessage(
                      `Sync locale de secours : ${results.synced} synchronisée(s), ${results.conflict} conflit(s), ${results.rejected} rejet(s).`,
                    )
                  }
                  setWorking(false)
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={working ? "animate-spin" : ""}
                />
                Synchroniser
              </button>
            </div>

            {conflicts.length > 0 && (
              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-700" />
                  <h3 className="font-display text-lg font-black text-amber-950">
                    Conflits à résoudre
                  </h3>
                </div>
                <p className="mt-1 text-xs font-semibold text-amber-800/80">
                  Les consentements, permissions et suppressions exigent une
                  confirmation adulte. Les progressions peuvent être fusionnées.
                </p>
                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
                  {conflicts.map((operation) => {
                    const kind = classifyEntity(
                      operation.entity,
                      operation.action,
                    )
                    const suggested = getDefaultStrategy(kind)
                    return (
                      <div
                        key={operation.id}
                        className="rounded-xl bg-white p-3 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-xs font-black text-slate-800">
                              {operation.entity}
                            </div>
                            <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                              {kind} · suggestion {suggested}
                            </div>
                            <p className="mt-2 text-[11px] font-semibold text-slate-500">
                              {operation.conflictReason ||
                                "Version locale et distante différentes."}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(
                            [
                              ["local", "Garder local"],
                              ["remote", "Garder distant"],
                              ["merge", "Fusionner"],
                              ["restrictive", "Plus restrictif"],
                            ] as Array<[ConflictStrategy, string]>
                          ).map(([strategy, label]) => (
                            <button
                              key={strategy}
                              onClick={() =>
                                resolveConflict(operation, strategy)
                              }
                              className={`rounded-lg px-3 py-2 text-[10px] font-black ${
                                strategy === suggested
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-7 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-black text-slate-900">
                  File de synchronisation
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  {queue.length} opération(s) enregistrée(s) localement
                </p>
              </div>
              <button
                onClick={async () => {
                  await clearSyncedOperations()
                  await refreshQueue()
                }}
                className="text-xs font-black text-slate-500"
              >
                Nettoyer les opérations terminées
              </button>
            </div>

            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {queue.length ? (
                queue.slice(0, 30).map((operation) => (
                  <div
                    key={operation.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <span
                      className={`size-2 rounded-full ${
                        operation.status === "synced"
                          ? "bg-emerald-500"
                          : operation.status === "conflict"
                            ? "bg-rose-500"
                            : operation.status === "rejected"
                              ? "bg-slate-500"
                              : "bg-amber-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-black text-slate-700">
                        {operation.entity}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        {new Date(operation.createdAt).toLocaleString("fr-FR")}
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {operation.status}
                    </span>
                    {operation.status === "pending" && (
                      <button
                        onClick={async () => {
                          await markOperationConflict(
                            operation.id,
                            operation.payload,
                            "Conflit simulé pour démonstration.",
                          )
                          await refreshQueue()
                        }}
                        className="text-rose-500"
                        aria-label="Simuler un conflit"
                      >
                        <AlertTriangle size={16} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs font-bold text-slate-400">
                  Aucune opération en attente.
                </div>
              )}
            </div>

            <div className="mt-7 rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <h3 className="text-sm font-black text-rose-800">
                Réinitialiser cette démonstration
              </h3>
              <p className="mt-1 text-xs font-semibold text-rose-700/70">
                Supprime les profils, progrès et réglages présents sur cet
                appareil.
              </p>
              <button
                onClick={async () => {
                  if (
                    !window.confirm(
                      "Supprimer toutes les données locales Popy ?",
                    )
                  )
                    return
                  await clearAllLocalData()
                  Object.keys(window.localStorage)
                    .filter((key) => key.startsWith("popy-academy:"))
                    .forEach((key) => window.localStorage.removeItem(key))
                  window.location.reload()
                }}
                className="mt-3 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white"
              >
                Supprimer les données locales
              </button>
            </div>
          </section>
        </AccessibleModal>
      )}
    </>
  )
}

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Battery
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <Icon size={17} className="text-indigo-600" />
      <p className="mt-2 text-[10px] font-black uppercase text-slate-400">
        {label}
      </p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  )
}

function ControlButton({
  icon: Icon,
  onClick,
  label,
}: {
  icon: typeof MoveUp
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid aspect-square place-items-center rounded-xl bg-white text-indigo-700 shadow-sm active:scale-95"
    >
      <Icon size={18} />
    </button>
  )
}
