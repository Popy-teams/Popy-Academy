import { useEffect, useState } from "react"
import {
  Accessibility,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Gamepad2,
  Heart,
  LayoutGrid,
  Lightbulb,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Moon,
  MoreHorizontal,
  NotebookPen,
  Palette,
  Pause,
  Play,
  Plus,
  Puzzle,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Smile,
  Target,
  Trophy,
  Users,
  Volume2,
  WandSparkles,
  Wifi,
  Zap,
} from "lucide-react"

import FeatureWorkspace from "./RoleWorkspace"
import ComputerFirstBanner from "../components/ComputerFirstBanner"
import SubscriptionPanel from "../components/SubscriptionPanel"
import { usePersistentState } from "../lib/persistence"
import {
  defaultLinkedChildren,
  type LinkedChild,
} from "../lib/parent-children"
import { fetchMyChildren } from "../lib/api-client"
import { loadStoredAuth } from "../lib/hybrid-sync"

function mapApiChild(child: {
  id: string
  display_name: string
  school_level: string
  current_xp: number
  current_level: number
}): LinkedChild {
  const initials = child.display_name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return {
    id: child.id,
    name: child.display_name,
    level: child.school_level,
    relationship: "Enfant",
    initials: initials || "EN",
    color: "bg-indigo-100 text-indigo-800",
    focus: `Niveau ${child.current_level} · ${child.current_xp} XP`,
    activitiesDone: 0,
    learningMinutes: 0,
    goalsPercent: Math.min(100, child.current_level * 20),
    streakDays: 0,
  }
}

function useParentChildren() {
  const [children, setChildren] = usePersistentState<LinkedChild[]>(
    "parent-linked-children",
    defaultLinkedChildren,
  )
  const [activeChildId, setActiveChildId] = usePersistentState(
    "parent-active-child",
    defaultLinkedChildren[0].id,
  )

  useEffect(() => {
    if (!loadStoredAuth()?.access_token) return
    void fetchMyChildren()
      .then((list) => {
        if (!list.length) return
        const mapped = list.map(mapApiChild)
        setChildren(mapped)
        setActiveChildId(mapped[0].id)
      })
      .catch(() => {
        /* cache local hors ligne */
      })
  }, [setChildren, setActiveChildId])

  const activeChild =
    children.find((child) => child.id === activeChildId) ?? children[0]

  return {
    children,
    setChildren,
    activeChildId,
    setActiveChildId,
    activeChild,
  }
}

function ParentDashboard({
  setActive,
}: {
  setActive: (label: string) => void
}) {
  const { children, activeChild, activeChildId, setActiveChildId, setChildren } =
    useParentChildren()
  const learningProfiles = {
    Standard: {
      label: "Sans besoin spécifique",
      description:
        "Parcours équilibré avec difficulté progressive et autonomie guidée.",
      adaptations: [
        "Difficulté progressive",
        "Rappels doux",
        "Bilan hebdomadaire",
      ],
      tone: "bg-slate-100 text-slate-700",
    },
    TDAH: {
      label: "Attention & concentration",
      description:
        "Séances courtes, objectifs uniques et pauses actives régulières.",
      adaptations: [
        "Temps fractionné",
        "Mode sans distraction",
        "Pauses guidées",
        "Consignes en 1 étape",
      ],
      tone: "bg-amber-100 text-amber-800",
    },
    Dyslexie: {
      label: "Lecture adaptée",
      description:
        "Présentation aérée, lecture audio et repères visuels renforcés.",
      adaptations: [
        "Consignes audio",
        "Police adaptée",
        "Espacement renforcé",
        "Surlignage syllabique",
      ],
      tone: "bg-violet-100 text-violet-800",
    },
    Dyspraxie: {
      label: "Gestes & organisation",
      description:
        "Interactions simplifiées, grandes zones d’action et guidage pas à pas.",
      adaptations: [
        "Grandes zones tactiles",
        "Saisie limitée",
        "Guidage visuel",
        "Temps supplémentaire",
      ],
      tone: "bg-cyan-100 text-cyan-800",
    },
  } as const
  type LearningProfile = keyof typeof learningProfiles
  const [learningProfile, setLearningProfile] =
    useState<LearningProfile>("Dyslexie")
  const activeProfile = learningProfiles[learningProfile]

  return (
    <main className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-bold text-indigo-600">
            Espace parent
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            Bonjour Sophie
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Voici l’essentiel de la semaine de {activeChild.name}, sans
            surcharge d’informations.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setActiveChildId(child.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold ${
                  child.id === activeChildId
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 shadow-sm"
                }`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-lg text-[10px] ${child.color}`}
                >
                  {child.initials}
                </span>
                {child.name}
              </button>
            ))}
            <button
              onClick={() => {
                const id = `child-${Date.now()}`
                const next: LinkedChild = {
                  id,
                  name: `Enfant ${children.length + 1}`,
                  level: "CE1",
                  relationship: "Enfant",
                  initials: `E${children.length + 1}`,
                  color: "bg-cyan-100 text-cyan-800",
                  focus: "Parcours à personnaliser",
                  activitiesDone: 0,
                  learningMinutes: 0,
                  goalsPercent: 0,
                  streakDays: 0,
                }
                setChildren([...children, next])
                setActiveChildId(id)
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-600"
            >
              <Plus size={14} /> Lier un enfant
            </button>
          </div>
          <button
            onClick={() => setActive("Plan de travail")}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200"
          >
            <CalendarDays size={17} /> Organiser la semaine
          </button>
        </div>
      </div>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Check,
            value: String(activeChild.activitiesDone),
            label: "Activités terminées",
            trend: activeChild.focus,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            icon: Clock3,
            value: `${Math.floor(activeChild.learningMinutes / 60)}h ${
              activeChild.learningMinutes % 60
            }`,
            label: "Temps d’apprentissage",
            trend: `${activeChild.level} · ${activeChild.relationship}`,
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            icon: Target,
            value: `${activeChild.goalsPercent}%`,
            label: "Objectifs atteints",
            trend: "Suivi multi-enfants actif",
            color: "bg-amber-50 text-amber-600",
          },
          {
            icon: Flame,
            value: `${activeChild.streakDays} jours`,
            label: "Régularité",
            trend: "Session parent locale",
            color: "bg-rose-50 text-rose-600",
          },
        ].map(({ icon: Icon, value, label, trend, color }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div
              className={`grid size-10 place-items-center rounded-xl ${color}`}
            >
              <Icon size={19} />
            </div>
            <div className="mt-4 font-display text-2xl font-extrabold text-slate-900">
              {value}
            </div>
            <div className="mt-1 text-sm font-bold text-slate-600">{label}</div>
            <div className="mt-2 text-xs font-semibold text-emerald-600">
              {trend}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold text-slate-900">
                Progression par matière
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Compétences travaillées sur 30 jours
              </p>
            </div>
            <button
              onClick={() => setActive("Suivi de Léo")}
              className="text-sm font-extrabold text-indigo-600"
            >
              Voir le bilan de {activeChild.name.split(" ")[0]}
            </button>
          </div>
          <div className="mt-7 space-y-6">
            {[
              ["Français", 78, "Très bonne progression", "bg-violet-500"],
              [
                "Mathématiques",
                64,
                "À consolider : fractions",
                "bg-indigo-500",
              ],
              ["Sciences", 86, "Objectifs dépassés", "bg-cyan-500"],
              ["Anglais", 71, "En bonne voie", "bg-amber-500"],
            ].map(([name, value, note, color]) => (
              <div key={name as string}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-slate-700">{name}</span>
                  <span className="font-bold text-slate-400">
                    {note} · {value}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-slate-900">
                  Profil d’apprentissage
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Personnalisation non stigmatisante
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Accessibility size={19} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(Object.keys(learningProfiles) as LearningProfile[]).map(
                (profile) => (
                  <button
                    key={profile}
                    onClick={() => setLearningProfile(profile)}
                    aria-pressed={learningProfile === profile}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-extrabold transition ${
                      learningProfile === profile
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {profile}
                  </button>
                ),
              )}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${activeProfile.tone}`}
                  >
                    {activeProfile.label}
                  </span>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
                    {activeProfile.description}
                  </p>
                </div>
                <Settings size={18} className="shrink-0 text-slate-400" />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Adaptations recommandées
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeProfile.adaptations.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-2 text-[11px] font-extrabold text-indigo-700"
                  >
                    <Check size={12} strokeWidth={3} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-extrabold text-emerald-800">
                  Synchronisé avec Popy
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">
                À l’instant
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-400">
              Le profil aide à adapter l’expérience mais ne constitue pas un
              diagnostic médical. Les réglages restent modifiables à tout
              moment.
            </p>
          </section>
          <section className="rounded-2xl bg-slate-900 p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-violet-500/20 text-violet-300">
                <MessageCircle size={19} />
              </div>
              <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-extrabold text-emerald-300">
                Nouveau
              </span>
            </div>
            <h3 className="mt-4 font-display font-extrabold">
              Message de Mme Leroy
            </h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
              “{activeChild.name.split(" ")[0]} a très bien participé à l’atelier lecture aujourd’hui…”
            </p>
            <button
              onClick={() => setActive("Échanges")}
              className="mt-4 text-xs font-extrabold text-violet-300"
            >
              Lire et répondre →
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

function ParentAdvancedPage({ title }: { title: string }) {
  const { activeChild } = useParentChildren()
  const [screenTime, setScreenTime] = useState(60)
  const [volume, setVolume] = useState(60)
  const [profile, setProfile] = useState("TDAH")
  const [language, setLanguage] = useState("Adapté")
  const [stopped, setStopped] = useState(false)
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Pause toutes les 30 minutes": true,
    "Mode nuit 20h–7h": true,
    "Mode hors ligne": false,
    "Contenus éducatifs uniquement": true,
    "Histoires et contes": true,
    "Jeux ludiques": true,
    "Vidéos éducatives": false,
    "Alertes douces": true,
    "Découpage des consignes": true,
    "Lecture vocale automatique": true,
    "Grandes zones tactiles": false,
    "Silence sensoriel": false,
    "Sous-titres automatiques": true,
    Caméra: true,
    Microphones: true,
    "Télémétrie anonyme": false,
  })

  const switchToggle = (key: string) =>
    setToggles((current) => ({ ...current, [key]: !current[key] }))

  const ToggleRow = ({ label }: { label: string }) => (
    <button
      onClick={() => switchToggle(label)}
      className="flex w-full items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-left"
    >
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          toggles[label] ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${
            toggles[label] ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  )

  if (title === "Contrôle parental") {
    const routines = [
      ["07:00", "Réveil en musique"],
      ["07:30", "Petit-déjeuner"],
      ["08:00", "Brossage des dents"],
      ["17:00", "Temps des devoirs"],
      ["19:00", "Ranger la chambre"],
      ["20:30", "Histoire du soir"],
      ["21:00", "Extinction"],
    ]
    return (
      <main className="mx-auto max-w-[1500px] p-5 md:p-8">
        <div>
          <span className="text-sm font-extrabold text-indigo-600">
            Cadre familial
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            Contrôle parental
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Des limites claires et prévisibles, sans surveillance intrusive.
          </p>
        </div>
        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                Routines quotidiennes
              </h2>
              <button className="flex items-center gap-1 text-xs font-extrabold text-indigo-600">
                <Plus size={15} /> Ajouter
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {routines.map(([time, routine]) => (
                <button
                  key={time}
                  className="flex w-full items-center gap-4 rounded-xl bg-slate-50 p-3 text-left hover:bg-indigo-50"
                >
                  <span className="w-12 text-xs font-extrabold text-indigo-600">
                    {time}
                  </span>
                  <span className="flex-1 text-sm font-bold text-slate-700">
                    {routine}
                  </span>
                  <Check size={16} className="text-emerald-500" />
                </button>
              ))}
            </div>
          </section>
          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-extrabold text-slate-900">
                  Temps d’utilisation
                </h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                  {screenTime} min
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="15"
                value={screenTime}
                onChange={(event) => setScreenTime(Number(event.target.value))}
                className="mt-5 w-full accent-indigo-600"
              />
              <p className="mt-3 text-xs font-bold text-amber-600">
                45 min utilisées aujourd’hui sur {screenTime} min autorisées.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-display font-extrabold text-slate-900">
                Limites automatiques
              </h2>
              <div className="mt-4 space-y-2">
                <ToggleRow label="Pause toutes les 30 minutes" />
                <ToggleRow label="Mode nuit 20h–7h" />
                <ToggleRow label="Mode hors ligne" />
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display font-extrabold text-slate-900">
              Filtrage des contenus
            </h2>
            <div className="mt-4 space-y-2">
              <ToggleRow label="Contenus éducatifs uniquement" />
              <ToggleRow label="Histoires et contes" />
              <ToggleRow label="Jeux ludiques" />
              <ToggleRow label="Vidéos éducatives" />
            </div>
            <p className="mt-5 text-xs font-extrabold text-slate-500">
              Niveau de langage
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {["Simple", "Adapté", "Avancé"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLanguage(item)}
                  className={`rounded-xl py-3 text-xs font-extrabold ${
                    language === item
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-2xl bg-slate-900 p-5 text-white">
            <h2 className="font-display font-extrabold">
              Volume maximal de Popy
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Volume2 size={19} className="text-violet-300" />
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="flex-1 accent-violet-400"
              />
              <span className="text-xs font-extrabold">{volume}%</span>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/10 p-4">
              <MapPin size={19} className="text-violet-300" />
              <div>
                <div className="text-sm font-extrabold">
                  Zones privées actives
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  Salle de bain · Chambre des parents
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (title === "Inclusion & besoins") {
    const profileSettings: Record<string, string[]> = {
      TDAH: [
        "Alertes douces",
        "Découpage des consignes",
        "Mini-jeux de concentration",
        "Minuteur 10 minutes",
      ],
      Dyslexie: [
        "Lecture vocale automatique",
        "Syllabisation colorée",
        "Espacement renforcé",
        "Correction intelligente",
      ],
      Dyspraxie: [
        "Grandes zones tactiles",
        "Contrôle vocal complet",
        "Saisie limitée",
        "Exercices moteurs",
      ],
      TSA: [
        "Silence sensoriel",
        "Routine visuelle",
        "Animations lentes",
        "Détection de fatigue",
      ],
      Émotionnel: [
        "Respiration guidée",
        "Interface apaisante",
        "Suivi anonyme",
        "Sons de la nature",
      ],
    }
    return (
      <main className="mx-auto max-w-[1500px] p-5 md:p-8">
        <span className="text-sm font-extrabold text-indigo-600">
          Neurodiversité
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          Inclusion & besoins
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
          Les réglages accompagnent le profil de {activeChild.name} sans le
          réduire à un
          diagnostic. Chaque adaptation reste modifiable individuellement.
        </p>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {Object.keys(profileSettings).map((item) => (
            <button
              key={item}
              onClick={() => setProfile(item)}
              className={`min-w-max rounded-xl px-4 py-3 text-xs font-extrabold ${
                profile === item
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Réglages recommandés · {profile}
            </h2>
            <div className="mt-5 space-y-3">
              {profileSettings[profile].map((setting) => (
                <button
                  key={setting}
                  onClick={() => switchToggle(setting)}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left"
                >
                  <span className="text-sm font-bold text-slate-700">
                    {setting}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                    Recommandé
                  </span>
                </button>
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <div className="rounded-2xl bg-indigo-600 p-5 text-white">
              <Accessibility size={24} />
              <h2 className="mt-4 font-display text-xl font-extrabold">
                Paramètres universels
              </h2>
              <div className="mt-4 space-y-2 text-xs font-bold text-indigo-100">
                <p>Sous-titres automatiques activés</p>
                <p>Vitesse de voix : lente</p>
                <p>Contraste : standard adapté</p>
                <p>Animations : lentes</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-extrabold text-slate-800">Ambiance sonore</h3>
              <select className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-600">
                <option>Sons de la nature</option>
                <option>Silence</option>
                <option>Bruit blanc</option>
                <option>Musique douce</option>
              </select>
            </div>
          </aside>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1500px] p-5 md:p-8">
      <span className="text-sm font-extrabold text-indigo-600">
        Confidentialité et matériel
      </span>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
        Robot (optionnel)
      </h1>
      <p className="mt-2 text-sm font-semibold text-slate-400">
        L’apprentissage sur ordinateur est complet sans robot. Ce panneau ne sert
        que si vous activez le complément matériel.
      </p>
      <div className="mt-5">
        <ComputerFirstBanner />
      </div>
      <section className="mt-7 grid gap-5 md:grid-cols-3">
        {[
          ["Batterie", "Non applicable sans robot", Zap],
          ["Connexion", "Application PC · hors ligne disponible", Wifi],
          ["Stockage local", "Progrès et carnets sur cet appareil", LockKeyhole],
        ].map(([label, detail, Icon]) => {
          const StatusIcon = Icon as typeof Zap
          return (
            <article
              key={label as string}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <StatusIcon size={21} className="text-indigo-600" />
              <h2 className="mt-4 font-extrabold text-slate-800">
                {label as string}
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {detail as string}
              </p>
            </article>
          )
        })}
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            Capteurs (uniquement avec robot)
          </h2>
          <div className="mt-4 space-y-2">
            <ToggleRow label="Caméra" />
            <ToggleRow label="Microphones" />
            <ToggleRow label="Télémétrie anonyme" />
          </div>
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs font-bold leading-relaxed text-emerald-800">
            Sans robot, aucune caméra ni micro matériel n’est requis. Les
            activités scolaires restent disponibles sur ordinateur.
          </div>
        </section>
        <aside
          className={`rounded-2xl p-5 ${
            stopped ? "bg-rose-100" : "bg-slate-900 text-white"
          }`}
        >
          <ShieldCheck
            size={24}
            className={stopped ? "text-rose-600" : "text-violet-300"}
          />
          <h2 className="mt-4 font-display text-xl font-extrabold">
            {stopped ? "Robot arrêté en sécurité" : "Complément optionnel"}
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed opacity-70">
            L’arrêt d’urgence ne concerne que le robot. L’application sur
            ordinateur continue normalement.
          </p>
          <button
            onClick={() => setStopped(!stopped)}
            className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-extrabold ${
              stopped ? "bg-emerald-600 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {stopped ? "Réactiver sous contrôle" : "Arrêt d’urgence robot"}
          </button>
        </aside>
      </div>
    </main>
  )
}

export default function ParentInterface({
  active,
  isDashboard,
  setActive,
}: {
  active: string
  isDashboard: boolean
  setActive: (label: string) => void
}) {
  if (isDashboard) {
    return <ParentDashboard setActive={setActive} />
  }
  if (active === "Abonnement") {
    return <SubscriptionPanel />
  }
  if (
    ["Contrôle parental", "Inclusion & besoins", "Robot (optionnel)"].includes(
      active,
    )
  ) {
    return <ParentAdvancedPage key={active} title={active} />
  }
  return <FeatureWorkspace key={active} title={active} role="Parent" />
}
