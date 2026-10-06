import { useEffect, useState } from "react"
import {
  Accessibility,
  Atom,
  Award,
  AudioLines,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brush,
  Calculator,
  CalendarCheck,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Dumbbell,
  Eye,
  FileText,
  Flame,
  FolderOpen,
  Gamepad2,
  Globe2,
  Heart,
  History,
  LayoutGrid,
  Lightbulb,
  Map,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Music,
  Moon,
  NotebookPen,
  Palette,
  Pause,
  Play,
  Plus,
  Puzzle,
  Rocket,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Smile,
  Target,
  Timer,
  Trophy,
  Upload,
  Users,
  Volume2,
  WandSparkles,
  Wifi,
  Zap,
} from "lucide-react"

import { usePersistentState } from "../lib/persistence"
import { getAdaptivePlan } from "../lib/adaptive-engine"
import { useI18n } from "../lib/i18n"
import {
  buildEvaluation,
  defaultReviewDeck,
  getDueCards,
  scheduleReview,
  type ReviewCard,
  type ReviewQuality,
} from "../lib/spaced-repetition"
import FileExplorer from "../components/FileExplorer"
import WorkspaceCanvas from "../components/WorkspaceCanvas"

function PopyMascot({ small = false }: { small?: boolean }) {
  return (
    <div
      className={small ? "popy popy-small" : "popy"}
      aria-label="Popy le robot"
    >
      <div className="popy-antenna">
        <span />
      </div>
      <div className="popy-head">
        <div className="popy-face">
          <i />
          <i />
          <b />
        </div>
        <span className="popy-ear left" />
        <span className="popy-ear right" />
      </div>
      {!small && (
        <div className="popy-body">
          <Heart size={20} fill="currentColor" />
        </div>
      )}
    </div>
  )
}

function PlayfulChildDashboard({
  setActive,
}: {
  setActive: (label: string) => void
}) {
  const [focusMode, setFocusMode] = useState(false)
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [completed, setCompleted] = useState<number[]>([])
  const [energy, setEnergy] = useState(40)
  const [message, setMessage] = useState("")
  const [breathing, setBreathing] = useState(false)

  const adventures = [
    {
      world: "Planète des nombres",
      title: "Le trésor des fractions",
      subject: "Mathématiques",
      duration: "8 min",
      icon: "½",
      gradient: "from-violet-500 to-indigo-600",
      soft: "bg-violet-50",
      question: "Quelle part de la pizza est colorée ?",
      visual: "½",
      answers: ["1/2", "1/3", "2/3"],
      correct: "1/2",
    },
    {
      world: "Forêt des mots",
      title: "Libère le mot mystère",
      subject: "Français",
      duration: "6 min",
      icon: "Aa",
      gradient: "from-emerald-400 to-teal-600",
      soft: "bg-emerald-50",
      question: "Quel mot complète : « Les oiseaux ___ » ?",
      visual: "Aa",
      answers: ["chante", "chantent", "chantes"],
      correct: "chantent",
    },
    {
      world: "Océan des sciences",
      title: "La mission goutte d’eau",
      subject: "Sciences",
      duration: "7 min",
      icon: "H₂O",
      gradient: "from-cyan-400 to-blue-600",
      soft: "bg-cyan-50",
      question: "Quand l’eau chauffe, elle devient…",
      visual: "H₂O",
      answers: ["de la glace", "de la vapeur", "du sable"],
      correct: "de la vapeur",
    },
  ]

  const answerQuestion = (answer: string) => {
    if (activeGame === null) return
    const game = adventures[activeGame]
    if (answer === game.correct) {
      if (!completed.includes(activeGame)) {
        setCompleted([...completed, activeGame])
        setEnergy((current) => Math.min(100, current + 20))
      }
      setMessage("Bravo ! Ton cerveau vient de gagner 20 étoiles d’énergie !")
    } else {
      setMessage("Presque ! Essaie encore, Popy croit en toi.")
    }
  }

  const closeGame = () => {
    setActiveGame(null)
    setMessage("")
  }

  return (
    <main
      className={`child-world min-h-[calc(100vh-5rem)] p-4 md:p-7 ${
        focusMode ? "child-focus-mode" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-2xl shadow-violet-200 md:p-9">
          {!focusMode && (
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <Star
                className="child-star absolute left-[7%] top-[20%] text-amber-300"
                size={20}
                fill="currentColor"
              />
              <Star
                className="child-star-delayed absolute left-[48%] top-[14%] text-cyan-200"
                size={14}
                fill="currentColor"
              />
              <span className="child-orb absolute right-[8%] top-[12%] size-20 rounded-full bg-cyan-300/25 blur-sm" />
              <span className="absolute -bottom-16 left-[38%] size-48 rounded-full bg-white/10" />
            </div>
          )}

          <div className="relative z-10 grid items-center gap-6 md:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold ring-1 ring-white/20">
                  Aventure du jour
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-black text-amber-950">
                  <Flame size={14} fill="currentColor" /> 7 jours de suite
                </span>
              </div>
              <h1 className="mt-5 max-w-2xl font-display text-3xl font-black leading-tight md:text-5xl">
                Léo, le monde de Popy a besoin de toi !
              </h1>
              <p className="mt-3 max-w-xl text-sm font-bold leading-relaxed text-violet-100 md:text-base">
                Trois mini-défis, trois pouvoirs à débloquer. Tu choisis par
                quoi commencer.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveGame(0)}
                  className="child-bounce flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3.5 text-sm font-black text-amber-950 shadow-lg shadow-violet-950/20"
                >
                  <Rocket size={19} fill="currentColor" />
                  Lancer l’aventure
                </button>
                <button
                  onClick={() => setBreathing(true)}
                  className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3.5 text-sm font-extrabold text-white ring-1 ring-white/20 hover:bg-white/20"
                >
                  <Pause size={18} />
                  J’ai besoin d’une pause
                </button>
              </div>
            </div>

            <div className="relative hidden h-52 md:block">
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${
                  focusMode ? "" : "child-float"
                }`}
              >
                <PopyMascot />
              </div>
              <div className="absolute right-0 top-2 rounded-2xl bg-white p-3 text-slate-800 shadow-xl">
                <p className="max-w-32 text-xs font-extrabold leading-relaxed">
                  On joue, on essaie, et on a le droit de se tromper !
                </p>
                <span className="absolute -bottom-2 left-8 size-4 rotate-45 bg-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Zap size={21} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800">
                  Énergie de Popy
                </span>
                <span className="text-xs font-extrabold text-indigo-600">
                  {energy}%
                </span>
              </div>
              <div className="mt-2 h-2.5 w-44 overflow-hidden rounded-full bg-slate-100 sm:w-64">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setFocusMode(!focusMode)}
            aria-pressed={focusMode}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs font-extrabold transition ${
              focusMode
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <Smile size={17} />
              Mode calme
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                focusMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${
                  focusMode ? "left-6" : "left-1"
                }`}
              />
            </span>
          </button>
        </section>

        <div className="mt-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
              Choisis ton chemin
            </p>
            <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
              Les mondes à explorer
            </h2>
          </div>
          <span className="hidden text-sm font-extrabold text-slate-400 sm:block">
            {completed.length} sur 3 terminés
          </span>
        </div>

        <section
          className={`mt-4 grid gap-5 ${
            focusMode ? "max-w-xl" : "lg:grid-cols-3"
          }`}
        >
          {adventures
            .slice(0, focusMode ? 1 : adventures.length)
            .map((adventure, index) => {
              const isDone = completed.includes(index)
              return (
                <article
                  key={adventure.title}
                  className="child-game-card group relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`relative h-36 overflow-hidden rounded-[20px] bg-gradient-to-br ${adventure.gradient} p-5 text-white`}
                  >
                    {!focusMode && (
                      <>
                        <span className="absolute -right-6 -top-6 size-24 rounded-full bg-white/15" />
                        <span className="absolute -bottom-8 right-10 size-20 rounded-full bg-white/10" />
                      </>
                    )}
                    <span className="text-xs font-extrabold text-white/80">
                      {adventure.world}
                    </span>
                    <div className="absolute bottom-4 left-5 grid size-16 place-items-center rounded-2xl bg-white/20 font-display text-2xl font-black ring-1 ring-white/25 backdrop-blur-sm">
                      {adventure.icon}
                    </div>
                    {isDone && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-300 px-2.5 py-1 text-[10px] font-black text-emerald-950">
                        <Check size={12} strokeWidth={3} /> Réussi
                      </span>
                    )}
                  </div>
                  <div className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {adventure.subject}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Clock3 size={13} /> {adventure.duration}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-black text-slate-800">
                      {adventure.title}
                    </h3>
                    <button
                      onClick={() => setActiveGame(index)}
                      className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-900 text-white group-hover:bg-indigo-600"
                      }`}
                    >
                      <Gamepad2 size={18} />
                      {isDone ? "Rejouer" : "Jouer maintenant"}
                    </button>
                  </div>
                </article>
              )
            })}
        </section>

        {!focusMode && (
          <section className="mt-7 grid gap-5 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-fuchsia-600">
                    Ma collection
                  </p>
                  <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                    Pouvoirs débloqués
                  </h2>
                </div>
                <button
                  onClick={() => setActive("Mes récompenses")}
                  className="text-xs font-black text-indigo-600"
                >
                  Tout voir →
                </button>
              </div>
              <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
                {[
                  ["7", "Super régulier", "7 jours"],
                  ["XP", "Cerveau curieux", "12 défis"],
                  ["Aa", "Maître des mots", "Niveau 3"],
                  ["?", "Mystère", "Encore 2 défis"],
                ].map(([icon, label, detail], index) => (
                  <div
                    key={label}
                    className={`min-w-32 rounded-2xl p-4 text-center ${
                      index === 3
                        ? "bg-slate-100 opacity-60 grayscale"
                        : "bg-amber-50"
                    }`}
                  >
                    <div className="text-3xl">{icon}</div>
                    <div className="mt-2 text-xs font-black text-slate-700">
                      {label}
                    </div>
                    <div className="mt-1 text-[10px] font-bold text-slate-400">
                      {detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-emerald-100 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Le défi surprise
              </p>
              <h2 className="mt-2 max-w-56 font-display text-xl font-black text-emerald-950">
                Trouve 5 objets ronds autour de toi !
              </h2>
              <p className="mt-2 max-w-60 text-xs font-bold leading-relaxed text-emerald-800/70">
                Bouger aide parfois le cerveau à mieux se concentrer.
              </p>
              <button
                onClick={() =>
                  setMessage(
                    "Défi lancé ! Reviens dire à Popy ce que tu as trouvé.",
                  )
                }
                className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white"
              >
                Je relève le défi
              </button>
              <Star
                size={72}
                className="absolute -bottom-3 -right-2 rotate-12 text-emerald-300"
                fill="currentColor"
              />
            </div>
          </section>
        )}
      </div>

      {activeGame !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-indigo-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={closeGame}
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-xl bg-slate-100 font-black text-slate-500"
            >
              ×
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Mini-défi · {adventures[activeGame].subject}
            </span>
            <div className="my-6 grid h-28 place-items-center rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-100 text-6xl">
              {adventures[activeGame].visual}
            </div>
            <h2 className="text-center font-display text-2xl font-black text-slate-900">
              {adventures[activeGame].question}
            </h2>
            <div className="mt-6 grid gap-3">
              {adventures[activeGame].answers.map((answer) => (
                <button
                  key={answer}
                  onClick={() => answerQuestion(answer)}
                  className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {answer}
                </button>
              ))}
            </div>
            {message && (
              <div
                className={`mt-5 rounded-2xl p-4 text-center text-sm font-black ${
                  message.startsWith("Bravo")
                    ? "child-celebrate bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      )}

      {breathing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-emerald-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
              Pause avec Popy
            </p>
            <div className="breathing-orb mx-auto my-10 grid size-32 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 text-sm font-black text-emerald-950 shadow-xl shadow-emerald-200">
              Respire
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900">
              Inspire doucement… puis souffle.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
              Il n’y a rien à réussir. Prends simplement le temps dont tu as
              besoin.
            </p>
            <button
              onClick={() => setBreathing(false)}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white"
            >
              Je suis prêt
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

const childPageMeta: Record<string, {
  eyebrow: string
  title: string
  description: string
  color: string
}> = {
  "Mon bureau": {
    eyebrow: "Mon espace de travail",
    title: "Tous mes outils au même endroit",
    description:
      "Écris, calcule, dessine, organise tes devoirs et demande de l’aide sans changer d’application.",
    color: "from-indigo-700 to-blue-600",
  },
  "Parler à Popy": {
    eyebrow: "Popy t’écoute",
    title: "Pose une question ou demande de l’aide",
    description:
      "Tu peux écrire, parler, demander une explication ou lancer un petit quiz.",
    color: "from-indigo-600 to-cyan-500",
  },
  "Toutes les matières": {
    eyebrow: "Le programme de l’école",
    title: "Choisis le monde que tu veux explorer",
    description:
      "Toutes les matières du primaire deviennent des aventures courtes, visuelles et interactives.",
    color: "from-blue-600 to-indigo-600",
  },
  "Mes missions": {
    eyebrow: "Mon parcours du jour",
    title: "Prêt pour une nouvelle aventure ?",
    description:
      "Choisis une mission. Tu peux faire une pause ou demander un indice à tout moment.",
    color: "from-violet-600 to-indigo-600",
  },
  "Aide aux devoirs": {
    eyebrow: "Comprendre sans tricher",
    title: "Popy m’aide étape par étape",
    description:
      "Photographie ou recopie une consigne. Popy donne des indices sans faire l’exercice à ta place.",
    color: "from-emerald-500 to-cyan-600",
  },
  "Jeux & défis": {
    eyebrow: "Apprendre en jouant",
    title: "La salle des mini-jeux",
    description:
      "Des défis très courts pour entraîner ta mémoire, tes mots et tes calculs.",
    color: "from-fuchsia-500 to-violet-600",
  },
  "Laboratoire Tech": {
    eyebrow: "Code, robot et objets",
    title: "Le laboratoire technologique de Popy",
    description:
      "Construis un algorithme, teste un circuit et découvre comment fonctionnent les objets.",
    color: "from-slate-700 to-blue-700",
  },
  "Studio créatif": {
    eyebrow: "Imaginer et créer",
    title: "Le studio créatif avec Popy",
    description:
      "Invente une histoire, dessine une idée ou compose une petite mélodie.",
    color: "from-fuchsia-500 to-rose-500",
  },
  Bibliothèque: {
    eyebrow: "Histoires et découvertes",
    title: "Ma bibliothèque magique",
    description:
      "Écoute, lis ou regarde des contenus adaptés à ton niveau et à tes envies.",
    color: "from-amber-400 to-orange-500",
  },
  "Mon planning": {
    eyebrow: "Une chose après l’autre",
    title: "Ma semaine en images",
    description:
      "Sais toujours ce qui arrive ensuite et prépare tes temps de pause.",
    color: "from-cyan-500 to-blue-600",
  },
  "Mes progrès": {
    eyebrow: "Tous mes petits pas",
    title: "Regarde tout ce que tu sais faire",
    description:
      "Ici, on mesure surtout tes efforts, tes stratégies et tes progrès.",
    color: "from-emerald-500 to-teal-600",
  },
  "Mes récompenses": {
    eyebrow: "Mes réussites",
    title: "Le coffre aux pouvoirs",
    description:
      "Utilise tes étoiles pour personnaliser Popy et débloquer des surprises.",
    color: "from-amber-400 to-rose-500",
  },
  "Mon carnet": {
    eyebrow: "Comment je me sens",
    title: "Mon carnet à moi",
    description:
      "Tu peux noter une émotion, une réussite ou quelque chose à raconter.",
    color: "from-rose-400 to-fuchsia-600",
  },
  "Mon Popy": {
    eyebrow: "Mon compagnon",
    title: "Je prépare mon Popy",
    description:
      "Choisis sa voix, son énergie et la façon dont il t’accompagne.",
    color: "from-indigo-500 to-cyan-500",
  },
}

function ChildSectionPage({ title }: { title: string }) {
  const { t } = useI18n()
  const meta = childPageMeta[title]
  const [stars, setStars] = usePersistentState("child-stars", 1280)
  const [done, setDone] = usePersistentState<number[]>("child-completed", [])
  const [favorites, setFavorites] = usePersistentState<number[]>(
    "child-favorites",
    [0],
  )
  const [purchased, setPurchased] = usePersistentState<number[]>(
    "child-rewards",
    [],
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [libraryFilter, setLibraryFilter] = useState("Tout")
  const [day, setDay] = useState("Mardi")
  const [mood, setMood] = useState("")
  const [note, setNote] = useState("")
  const [notes, setNotes] = usePersistentState<string[]>("child-notes", [])
  const [connected, setConnected] = useState(false)
  const [volume, setVolume] = usePersistentState("child-popy-volume", 65)
  const [popyColor, setPopyColor] = usePersistentState(
    "child-popy-color",
    "Indigo",
  )
  const [feedback, setFeedback] = useState("")
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [gameAnswer, setGameAnswer] = useState("")
  const [gameResult, setGameResult] = useState<"success" | "retry" | "">("")
  const [featuredGame, setFeaturedGame] = useState("Simon")
  const [simonSequence, setSimonSequence] = useState<number[]>([])
  const [simonInput, setSimonInput] = useState<number[]>([])
  const [simonMessage, setSimonMessage] = useState("")
  const [danceActive, setDanceActive] = useState(false)
  const [danceStyle, setDanceStyle] = useState("Pop")
  const [treasureFound, setTreasureFound] = useState<string[]>([])
  const [gameStats, setGameStats] = usePersistentState("child-game-stats", {
    simonLevel: 1,
    treasureRuns: 0,
    quizWins: 0,
  })
  const [campaignXp, setCampaignXp] = usePersistentState(
    "child-game-campaign-xp",
    35,
  )
  const [selectedWorldId, setSelectedWorldId] = usePersistentState(
    "child-game-selected-world",
    "1",
  )
  const [completedWorldLevels, setCompletedWorldLevels] = usePersistentState<
    string[]
  >("child-game-completed-world-levels", [])
  const [activeWorldLevelId, setActiveWorldLevelId] = useState<string | null>(
    null,
  )
  const campaignWorlds = [
    {
      id: "1",
      label: "Forêt mémoire",
      requiredXp: 0,
      levels: [
        {
          id: "1-1",
          title: "Sentier des couleurs",
          detail: "Mémorise 3 couleurs",
          rewardXp: 10,
          question: "Quelle couleur vient juste après le rouge ?",
          answers: ["Bleu", "Vert", "Jaune"],
          correct: "Vert",
        },
        {
          id: "1-2",
          title: "Clairière secrète",
          detail: "Retrouve la séquence",
          rewardXp: 15,
          question: "Combien d’éléments faut-il retenir ?",
          answers: ["2", "4", "8"],
          correct: "4",
        },
        {
          id: "1-3",
          title: "Garde forestière",
          detail: "Boss de mémoire",
          rewardXp: 25,
          question: "Quel animal aide Popy à mémoriser ?",
          answers: ["Le hibou", "Le poisson", "Le nuage"],
          correct: "Le hibou",
        },
      ],
    },
    {
      id: "2",
      label: "Archipel des nombres",
      requiredXp: 50,
      levels: [
        {
          id: "2-1",
          title: "Île des demis",
          detail: "Fractions simples",
          rewardXp: 15,
          question: "Quelle part représente 1/2 ?",
          answers: ["La moitié", "Le tiers", "Le quart"],
          correct: "La moitié",
        },
        {
          id: "2-2",
          title: "Pont des additions",
          detail: "Calcul mental",
          rewardXp: 20,
          question: "Combien font 7 + 5 ?",
          answers: ["11", "12", "13"],
          correct: "12",
        },
        {
          id: "2-3",
          title: "Phare des défis",
          detail: "Boss des nombres",
          rewardXp: 30,
          question: "Quelle fraction est la plus grande ?",
          answers: ["1/4", "1/2", "1/8"],
          correct: "1/2",
        },
      ],
    },
    {
      id: "3",
      label: "Cité des mots",
      requiredXp: 120,
      levels: [
        {
          id: "3-1",
          title: "Place des verbes",
          detail: "Accord simple",
          rewardXp: 15,
          question: "Les oiseaux ___ .",
          answers: ["chante", "chantent", "chantes"],
          correct: "chantent",
        },
        {
          id: "3-2",
          title: "Bibliothèque magique",
          detail: "Lecture courte",
          rewardXp: 20,
          question: "Un synonyme de « rapide » ?",
          answers: ["Lent", "Vif", "Lourd"],
          correct: "Vif",
        },
        {
          id: "3-3",
          title: "Tour des histoires",
          detail: "Boss des mots",
          rewardXp: 30,
          question: "Quelle phrase est correctement écrite ?",
          answers: [
            "Ils mangent une pomme.",
            "Ils mange une pomme.",
            "Ils manges une pomme.",
          ],
          correct: "Ils mangent une pomme.",
        },
      ],
    },
    {
      id: "4",
      label: "Station technologique",
      requiredXp: 220,
      levels: [
        {
          id: "4-1",
          title: "Salle des robots",
          detail: "Ordre d’actions",
          rewardXp: 20,
          question: "Que faut-il faire en premier ?",
          answers: ["Allumer", "Éteindre", "Attendre"],
          correct: "Allumer",
        },
        {
          id: "4-2",
          title: "Circuit lumineux",
          detail: "Logique simple",
          rewardXp: 25,
          question: "Un circuit fermé permet…",
          answers: ["au courant de passer", "de dormir", "de casser"],
          correct: "au courant de passer",
        },
        {
          id: "4-3",
          title: "Tour de contrôle",
          detail: "Boss techno",
          rewardXp: 35,
          question: "Un algorithme est…",
          answers: [
            "une suite d’instructions",
            "un animal",
            "une couleur",
          ],
          correct: "une suite d’instructions",
        },
      ],
    },
    {
      id: "5",
      label: "Sommet des savoirs",
      requiredXp: 350,
      levels: [
        {
          id: "5-1",
          title: "Camp de base",
          detail: "Révision mixte",
          rewardXp: 25,
          question: "Quand l’eau chauffe, elle devient…",
          answers: ["de la vapeur", "du sable", "du bois"],
          correct: "de la vapeur",
        },
        {
          id: "5-2",
          title: "Crête des défis",
          detail: "Mix maths/français",
          rewardXp: 35,
          question: "Combien font 9 × 2 ?",
          answers: ["16", "18", "20"],
          correct: "18",
        },
        {
          id: "5-3",
          title: "Cime finale",
          detail: "Boss ultime",
          rewardXp: 50,
          question: "Quelle qualité aide le plus à apprendre ?",
          answers: ["La curiosité", "La précipitation", "L’oubli"],
          correct: "La curiosité",
        },
      ],
    },
  ]
  const selectedWorld =
    campaignWorlds.find((world) => world.id === selectedWorldId) ??
    campaignWorlds[0]
  const activeWorldLevel =
    selectedWorld.levels.find((level) => level.id === activeWorldLevelId) ??
    null
  const [readingItem, setReadingItem] = useState<number | null>(null)
  const [readingMode, setReadingMode] = useState("Confort")
  const [readerSize, setReaderSize] = useState(18)
  const [readerSpacing, setReaderSpacing] = useState(1.8)
  const [readerTheme, setReaderTheme] = useState("Clair")
  const [selectedSubject, setSelectedSubject] = usePersistentState(
    "child-subject",
    "Français",
  )
  const [program, setProgram] = useState<string[]>([])
  const [programResult, setProgramResult] = useState("")
  const [circuit, setCircuit] = useState<string[]>(["Pile"])
  const [chatInput, setChatInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: "popy",
      text: "Bonjour Léo. Je peux t’expliquer une leçon, t’aider sans donner la réponse ou simplement t’écouter.",
    },
  ])
  const [creativeMode, setCreativeMode] = useState("Conte")
  const [storyTopic, setStoryTopic] = useState("")
  const [melody, setMelody] = useState<string[]>([])
  const [creation, setCreation] = useState("")
  const [homeworkSubject, setHomeworkSubject] = useState("Mathématiques")
  const [homeworkText, setHomeworkText] = useState("")
  const [homeworkStep, setHomeworkStep] = useState(0)
  const [homeworkAnswer, setHomeworkAnswer] = useState("")
  const [homeworkFeedback, setHomeworkFeedback] = useState("")
  const [reviewCards, setReviewCards] = usePersistentState<ReviewCard[]>(
    "child-review-cards",
    defaultReviewDeck,
  )
  const [reviewMode, setReviewMode] = useState<"revision" | "evaluation">(
    "revision",
  )
  const [showAnswer, setShowAnswer] = useState(false)
  const [evaluationScore, setEvaluationScore] = useState({
    correct: 0,
    total: 0,
  })
  const [evaluationQueue, setEvaluationQueue] = useState<ReviewCard[]>([])
  const dueCards = getDueCards(reviewCards)
  const currentReviewCard =
    reviewMode === "evaluation"
      ? evaluationQueue[0]
      : dueCards[0] ?? reviewCards[0]
  const [workspaceTab, setWorkspaceTab] = useState("Cahier")
  const [notebooks, setNotebooks] = usePersistentState<
    Array<{
      id: string
      title: string
      pages: Array<{
        id: string
        title: string
        content: string
        updatedAt: string
      }>
    }>
  >("child-workspace-notebooks", [
    {
      id: "notebook-day",
      title: "Cahier du jour",
      pages: [
        {
          id: "page-1",
          title: "Page 1",
          content: "Aujourd’hui, je veux retenir que…",
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "notebook-ideas",
      title: "Cahier d’idées",
      pages: [
        {
          id: "ideas-1",
          title: "Idées libres",
          content: "",
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ])
  const [activeNotebookId, setActiveNotebookId] = usePersistentState(
    "child-workspace-active-notebook",
    "notebook-day",
  )
  const [activePageId, setActivePageId] = usePersistentState(
    "child-workspace-active-page",
    "page-1",
  )
  const [notebookVersions, setNotebookVersions] = usePersistentState<
    Array<{
      id: number
      notebookId: string
      pageId: string
      savedAt: string
      content: string
    }>
  >("child-workspace-notebook-versions", [])
  const activeNotebook =
    notebooks.find((notebook) => notebook.id === activeNotebookId) ??
    notebooks[0]
  const activePage =
    activeNotebook?.pages.find((page) => page.id === activePageId) ??
    activeNotebook?.pages[0]
  const notebookContent = activePage?.content ?? ""
  const updateActivePageContent = (content: string) => {
    if (!activeNotebook || !activePage) return
    setNotebooks(
      notebooks.map((notebook) =>
        notebook.id !== activeNotebook.id
          ? notebook
          : {
              ...notebook,
              pages: notebook.pages.map((page) =>
                page.id !== activePage.id
                  ? page
                  : {
                      ...page,
                      content,
                      updatedAt: new Date().toISOString(),
                    },
              ),
            },
      ),
    )
  }
  const [historyOpen, setHistoryOpen] = useState(false)
  const [workspaceTasks, setWorkspaceTasks] = usePersistentState<Array<{
    id: number
    title: string
    subject: string
    done: boolean
  }>>("child-workspace-tasks", [
    {
      id: 1,
      title: "Relire la leçon sur les fractions",
      subject: "Mathématiques",
      done: false,
    },
    {
      id: 2,
      title: "Lire le chapitre 3",
      subject: "Français",
      done: true,
    },
  ])
  const [newWorkspaceTask, setNewWorkspaceTask] = useState("")
  const [workspaceDocumentCount, setWorkspaceDocumentCount] = useState(4)
  const [calculatorInput, setCalculatorInput] = useState("")
  const [calculatorResult, setCalculatorResult] = useState("")
  const [dictionaryQuery, setDictionaryQuery] = useState("")
  const [dictionaryResult, setDictionaryResult] = useState("")
  const [focusMinutes, setFocusMinutes] = useState(10)
  const [timerSeconds, setTimerSeconds] = useState(600)
  const [timerRunning, setTimerRunning] = useState(false)
  const adaptivePlan = getAdaptivePlan({
    profile: "Dyslexie",
    successes: done.length,
    errorStreak: homeworkFeedback.startsWith("Vérifie") ? 2 : 0,
    fatigue: mood === "Fatigué" ? "high" : mood === "Agité" ? "medium" : "low",
  })

  const notify = (text: string) => {
    setFeedback(text)
    window.setTimeout(() => setFeedback(""), 2600)
  }

  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return
    const interval = window.setInterval(
      () => setTimerSeconds((current) => Math.max(0, current - 1)),
      1000,
    )
    return () => window.clearInterval(interval)
  }, [timerRunning, timerSeconds])

  useEffect(() => {
    if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false)
      setStars((current) => current + 10)
      notify("Séance terminée : 10 étoiles gagnées.")
    }
  }, [timerRunning, timerSeconds])

  const toggleDone = (index: number) => {
    setDone((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
    if (!done.includes(index)) setStars((current) => current + 20)
    notify(
      done.includes(index)
        ? "Mission remise dans ton parcours."
        : "Mission réussie : 20 étoiles gagnées !",
    )
  }

  const missions = [
    {
      title: "Le trésor des fractions",
      detail: "8 min · Avec des images",
      label: "Mathématiques",
      icon: "½",
      tone: "bg-violet-100 text-violet-700",
    },
    {
      title: "La phrase secrète",
      detail: "6 min · Lecture audio",
      label: "Français",
      icon: "Aa",
      tone: "bg-amber-100 text-amber-700",
    },
    {
      title: "Mission goutte d’eau",
      detail: "7 min · Expérience",
      label: "Sciences",
      icon: "H₂O",
      tone: "bg-cyan-100 text-cyan-700",
    },
    {
      title: "Les mots du quotidien",
      detail: "5 min · À ton rythme",
      label: "Anglais",
      icon: "ABC",
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Programme ton robot",
      detail: "9 min · Logique et code",
      label: "Technologie",
      icon: "</>",
      tone: "bg-blue-100 text-blue-700",
    },
    {
      title: "Voyage dans le temps",
      detail: "8 min · Frise interactive",
      label: "Histoire",
      icon: "-300",
      tone: "bg-rose-100 text-rose-700",
    },
  ]

  const games = [
    {
      title: "Mémo des animaux",
      skill: "Mémoire visuelle",
      icon: Puzzle,
      tone: "from-violet-500 to-indigo-600",
      prompt: "Quel symbole venait juste après le cercle ?",
      options: ["Triangle", "Carré", "Étoile"],
      correct: "Carré",
    },
    {
      title: "Calcul éclair",
      skill: "Calcul mental",
      icon: Zap,
      tone: "from-amber-400 to-orange-500",
      prompt: "Popy possède 4 boîtes de 6 étoiles. Combien en a-t-il ?",
      options: ["10", "20", "24"],
      correct: "24",
    },
    {
      title: "Chasse aux syllabes",
      skill: "Lecture",
      icon: Search,
      tone: "from-emerald-400 to-teal-600",
      prompt: "Quelles syllabes forment le mot « robot » ?",
      options: ["ro + bot", "rob + ote", "ra + bau"],
      correct: "ro + bot",
    },
    {
      title: "Le bon ordre",
      skill: "Organisation",
      icon: LayoutGrid,
      tone: "from-cyan-400 to-blue-600",
      prompt: "Que fais-tu en premier avant une expérience ?",
      options: ["Je range", "Je lis la consigne", "Je mélange tout"],
      correct: "Je lis la consigne",
    },
    {
      title: "Écoute et trouve",
      skill: "Attention auditive",
      icon: Volume2,
      tone: "from-rose-400 to-fuchsia-600",
      prompt: "Popy dit : bleu, vert, rouge. Quelle couleur est au milieu ?",
      options: ["Bleu", "Vert", "Rouge"],
      correct: "Vert",
    },
    {
      title: "Respire avec Popy",
      skill: "Retour au calme",
      icon: Heart,
      tone: "from-teal-400 to-emerald-600",
      prompt: "Quel rythme aide le plus à revenir au calme ?",
      options: [
        "Inspirer puis souffler lentement",
        "Aller très vite",
        "Ne plus respirer",
      ],
      correct: "Inspirer puis souffler lentement",
    },
    {
      title: "Code le chemin de Popy",
      skill: "Technologie & algorithmes",
      icon: Code2,
      tone: "from-blue-500 to-indigo-700",
      prompt:
        "Popy doit avancer puis tourner à droite. Quel programme est correct ?",
      options: ["Avance → Droite", "Droite → Recule", "Avance → Gauche"],
      correct: "Avance → Droite",
    },
    {
      title: "Le labo des engrenages",
      skill: "Technologie & systèmes",
      icon: Settings,
      tone: "from-slate-500 to-blue-700",
      prompt:
        "Un petit engrenage entraîne un grand engrenage. Le grand tourne…",
      options: ["Plus lentement", "Plus vite", "Sans bouger"],
      correct: "Plus lentement",
    },
  ]

  const library = [
    {
      title: "La cabane aux mille mots",
      type: "Histoires",
      format: "Audio + texte",
      duration: "8 min",
      tone: "bg-amber-100 text-amber-700",
    },
    {
      title: "Pourquoi la Lune change ?",
      type: "Vidéos",
      format: "Sous-titres",
      duration: "6 min",
      tone: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Les tables en musique",
      type: "Audio",
      format: "Rythme lent",
      duration: "4 min",
      tone: "bg-rose-100 text-rose-700",
    },
    {
      title: "Le monde des abeilles",
      type: "Vidéos",
      format: "Documentaire",
      duration: "7 min",
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Petites histoires à lire seul",
      type: "Histoires",
      format: "Police adaptée",
      duration: "10 min",
      tone: "bg-cyan-100 text-cyan-700",
    },
    {
      title: "Les sons difficiles",
      type: "Audio",
      format: "Répétition guidée",
      duration: "5 min",
      tone: "bg-violet-100 text-violet-700",
    },
  ]

  const renderWorkspace = () => {
    const completedTasks = workspaceTasks.filter((task) => task.done).length
    const timerLabel = `${String(Math.floor(timerSeconds / 60)).padStart(
      2,
      "0",
    )}:${String(timerSeconds % 60).padStart(2, "0")}`

    const calculate = () => {
      const match = calculatorInput
        .replace(",", ".")
        .match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/)
      if (!match) {
        setCalculatorResult("Écris un calcul simple, par exemple 24 ÷ 6")
        return
      }
      const first = Number(match[1])
      const second = Number(match[3])
      const operator = match[2]
      const result =
        operator === "+"
          ? first + second
          : operator === "-"
            ? first - second
            : operator === "*"
              ? first * second
              : second === 0
                ? "Impossible"
                : first / second
      setCalculatorResult(String(result))
    }

    const searchDefinition = () => {
      const definitions: Record<string, string> = {
        fraction:
          "Une fraction représente une ou plusieurs parts égales d’un tout.",
        évaporation:
          "L’évaporation est le passage progressif de l’eau liquide vers l’état gazeux.",
        algorithme:
          "Un algorithme est une suite d’instructions ordonnées pour accomplir une tâche.",
        citoyen:
          "Un citoyen est une personne qui possède des droits et des devoirs dans une société.",
      }
      const result =
        definitions[dictionaryQuery.trim().toLowerCase()] ??
        "Popy ne connaît pas encore ce mot dans le dictionnaire local. Essaie : fraction, évaporation, algorithme ou citoyen."
      setDictionaryResult(result)
    }

    return (
      <div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [workspaceTasks.length - completedTasks, "Devoirs à faire", Target],
            [workspaceDocumentCount, "Documents", FolderOpen],
            [notebookContent.length, "Caractères écrits", NotebookPen],
            [focusMinutes, "Minutes de focus", Timer],
          ].map(([value, label, Icon]) => {
            const StatIcon = Icon as typeof Target
            return (
              <article
                key={label as string}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <StatIcon size={20} />
                </span>
                <span>
                  <span className="block font-display text-2xl font-black text-slate-900">
                    {value as number}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {label as string}
                  </span>
                </span>
              </article>
            )
          })}
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.65fr]">
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 bg-slate-50 p-2">
              {[
                ["Cahier", NotebookPen],
                ["Ardoise", Palette],
                ["Outils", Calculator],
                ["Documents", FolderOpen],
              ].map(([tab, Icon]) => {
                const TabIcon = Icon as typeof NotebookPen
                return (
                  <button
                    key={tab as string}
                    onClick={() => setWorkspaceTab(tab as string)}
                    className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-xs font-black ${
                      workspaceTab === tab
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    <TabIcon size={16} />
                    {tab as string}
                  </button>
                )
              })}
            </div>

            {workspaceTab === "Cahier" && (
              <div className="p-5 md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                      Cahiers et pages
                    </p>
                    <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                      {activeNotebook?.title ?? "Mon cahier"} ·{" "}
                      {activePage?.title ?? "Page"}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHistoryOpen(!historyOpen)}
                      className={`grid size-10 place-items-center rounded-xl ${
                        historyOpen
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                      aria-label="Afficher l’historique des versions"
                    >
                      <History size={18} />
                    </button>
                    <button
                      onClick={() =>
                        notify("Popy lit ton brouillon à voix haute.")
                      }
                      className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"
                      aria-label="Lire le cahier"
                    >
                      <Volume2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (!activeNotebook || !activePage) return
                        setNotebookVersions(
                          [
                            {
                              id: Date.now(),
                              notebookId: activeNotebook.id,
                              pageId: activePage.id,
                              savedAt: new Date().toISOString(),
                              content: notebookContent,
                            },
                            ...notebookVersions,
                          ].slice(0, 24),
                        )
                        notify("La page est enregistrée localement.")
                      }}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white"
                    >
                      <Save size={16} /> Enregistrer
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {notebooks.map((notebook) => (
                    <button
                      key={notebook.id}
                      onClick={() => {
                        setActiveNotebookId(notebook.id)
                        setActivePageId(notebook.pages[0]?.id ?? "")
                      }}
                      className={`rounded-xl px-3 py-2 text-[10px] font-black ${
                        notebook.id === activeNotebook?.id
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {notebook.title}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const pageId = `page-${Date.now()}`
                      const notebookId = `notebook-${Date.now()}`
                      setNotebooks([
                        ...notebooks,
                        {
                          id: notebookId,
                          title: `Cahier ${notebooks.length + 1}`,
                          pages: [
                            {
                              id: pageId,
                              title: "Page 1",
                              content: "",
                              updatedAt: new Date().toISOString(),
                            },
                          ],
                        },
                      ])
                      setActiveNotebookId(notebookId)
                      setActivePageId(pageId)
                      notify("Nouveau cahier créé.")
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-600"
                  >
                    <Plus size={14} /> Cahier
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {activeNotebook?.pages.map((page, index) => (
                    <button
                      key={page.id}
                      onClick={() => setActivePageId(page.id)}
                      className={`rounded-lg px-3 py-2 text-[10px] font-black ${
                        page.id === activePage?.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {page.title || `Page ${index + 1}`}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (!activeNotebook) return
                      const pageId = `page-${Date.now()}`
                      setNotebooks(
                        notebooks.map((notebook) =>
                          notebook.id !== activeNotebook.id
                            ? notebook
                            : {
                                ...notebook,
                                pages: [
                                  ...notebook.pages,
                                  {
                                    id: pageId,
                                    title: `Page ${notebook.pages.length + 1}`,
                                    content: "",
                                    updatedAt: new Date().toISOString(),
                                  },
                                ],
                              },
                        ),
                      )
                      setActivePageId(pageId)
                      notify("Nouvelle page ajoutée.")
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700"
                  >
                    <Plus size={14} /> Page
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-[linear-gradient(#ffffff_31px,#dbeafe_32px)] bg-[length:100%_32px]">
                  <textarea
                    value={notebookContent}
                    onChange={(event) =>
                      updateActivePageContent(event.target.value)
                    }
                    className="min-h-[430px] w-full resize-none bg-transparent px-6 py-4 text-base font-semibold leading-8 text-slate-700 outline-none"
                    placeholder="Écris ici..."
                  />
                </div>
                {historyOpen && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-700">
                        Historique des versions
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {
                          notebookVersions.filter(
                            (version) =>
                              version.pageId === activePage?.id ||
                              (!version.pageId &&
                                version.notebookId === activeNotebook?.id),
                          ).length
                        }{" "}
                        sauvegarde(s)
                      </span>
                    </div>
                    <div className="mt-3 max-h-52 space-y-2 overflow-y-auto">
                      {notebookVersions.filter(
                        (version) =>
                          version.pageId === activePage?.id ||
                          (!version.pageId &&
                            version.notebookId === activeNotebook?.id),
                      ).length ? (
                        notebookVersions
                          .filter(
                            (version) =>
                              version.pageId === activePage?.id ||
                              (!version.pageId &&
                                version.notebookId === activeNotebook?.id),
                          )
                          .map((version) => (
                            <div
                              key={version.id}
                              className="flex items-center gap-3 rounded-xl bg-white p-3"
                            >
                              <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                                <FileText size={16} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-black text-slate-700">
                                  {version.content || "Page vide"}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {new Date(version.savedAt).toLocaleString(
                                    "fr-FR",
                                  )}
                                </span>
                              </span>
                              <button
                                onClick={() => {
                                  updateActivePageContent(version.content)
                                  notify("Cette version a été restaurée.")
                                }}
                                className="rounded-lg bg-indigo-50 px-3 py-2 text-[10px] font-black text-indigo-700"
                              >
                                Restaurer
                              </button>
                            </div>
                          ))
                      ) : (
                        <p className="py-5 text-center text-xs font-bold text-slate-400">
                          Enregistre la page pour créer une première version.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Reformuler",
                    "Corriger l’orthographe",
                    "Trouver une idée",
                    "Faire un résumé",
                  ].map((action) => (
                    <button
                      key={action}
                      onClick={() =>
                        notify(
                          `Popy prépare l’outil « ${action} » sur ton texte.`,
                        )
                      }
                      className="rounded-full bg-indigo-50 px-3 py-2 text-[10px] font-black text-indigo-700"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {workspaceTab === "Ardoise" && (
              <div className="p-5 md:p-7">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-fuchsia-600">
                    Ardoise libre
                  </p>
                  <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                    Dessine, trace des formes et prépare ta réponse
                  </h2>
                </div>
                <div className="mt-5">
                  <WorkspaceCanvas />
                </div>
              </div>
            )}

            {workspaceTab === "Outils" && (
              <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
                <article className="rounded-2xl bg-slate-900 p-5 text-white">
                  <Calculator size={24} className="text-violet-300" />
                  <h2 className="mt-4 font-display text-lg font-black">
                    Calculatrice expliquée
                  </h2>
                  <input
                    value={calculatorInput}
                    onChange={(event) => setCalculatorInput(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && calculate()}
                    className="mt-5 w-full rounded-xl bg-white/10 p-4 text-right font-display text-xl font-black outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="24 / 6"
                  />
                  <div className="mt-3 min-h-16 rounded-xl bg-white/10 p-4 text-right text-lg font-black text-violet-200">
                    {calculatorResult || "Résultat"}
                  </div>
                  <button
                    onClick={calculate}
                    className="mt-3 w-full rounded-xl bg-violet-500 py-3 text-sm font-black"
                  >
                    Calculer
                  </button>
                </article>
                <article className="rounded-2xl bg-amber-50 p-5">
                  <BookOpen size={24} className="text-amber-700" />
                  <h2 className="mt-4 font-display text-lg font-black text-amber-950">
                    Dictionnaire simple
                  </h2>
                  <input
                    value={dictionaryQuery}
                    onChange={(event) => setDictionaryQuery(event.target.value)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && searchDefinition()
                    }
                    className="mt-5 w-full rounded-xl border border-amber-200 bg-white p-4 text-sm font-bold outline-none"
                    placeholder="Chercher un mot..."
                  />
                  <p className="mt-3 min-h-24 rounded-xl bg-white p-4 text-xs font-bold leading-relaxed text-amber-900">
                    {dictionaryResult ||
                      "La définition apparaîtra ici avec des mots simples."}
                  </p>
                  <button
                    onClick={searchDefinition}
                    className="mt-3 w-full rounded-xl bg-amber-500 py-3 text-sm font-black text-amber-950"
                  >
                    Chercher
                  </button>
                </article>
              </div>
            )}

            {workspaceTab === "Documents" && (
              <div className="p-5 md:p-7">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-cyan-600">
                    Explorateur local
                  </p>
                  <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                    Mes dossiers et documents
                  </h2>
                </div>
                <div className="mt-5">
                  <FileExplorer onCountChange={setWorkspaceDocumentCount} />
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="overflow-hidden rounded-[28px] bg-slate-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-violet-300">
                    Bulle de concentration
                  </p>
                  <h2 className="mt-1 font-display text-lg font-black">
                    Mon temps focus
                  </h2>
                </div>
                <Timer size={23} className="text-violet-300" />
              </div>
              <div className="my-6 text-center font-display text-5xl font-black">
                {timerLabel}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setFocusMinutes(minutes)
                      setTimerSeconds(minutes * 60)
                      setTimerRunning(false)
                    }}
                    className={`rounded-lg py-2 text-xs font-black ${
                      focusMinutes === minutes ? "bg-violet-500" : "bg-white/10"
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-black text-slate-900"
              >
                {timerRunning ? <Pause size={17} /> : <Play size={17} />}
                {timerRunning ? "Faire une pause" : "Commencer"}
              </button>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                    Mes devoirs
                  </p>
                  <h2 className="font-display text-lg font-black text-slate-900">
                    À faire
                  </h2>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black text-indigo-700">
                  {completedTasks}/{workspaceTasks.length}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {workspaceTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() =>
                      setWorkspaceTasks((current) =>
                        current.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item,
                        ),
                      )
                    }
                    className="flex w-full items-start gap-3 rounded-xl bg-slate-50 p-3 text-left"
                  >
                    <span
                      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg ${
                        task.done
                          ? "bg-emerald-500 text-white"
                          : "border border-slate-300 bg-white"
                      }`}
                    >
                      {task.done && <Check size={14} />}
                    </span>
                    <span>
                      <span
                        className={`block text-xs font-black ${
                          task.done
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {task.subject}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={newWorkspaceTask}
                  onChange={(event) => setNewWorkspaceTask(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && newWorkspaceTask.trim()) {
                      setWorkspaceTasks([
                        ...workspaceTasks,
                        {
                          id: Date.now(),
                          title: newWorkspaceTask,
                          subject: "Personnel",
                          done: false,
                        },
                      ])
                      setNewWorkspaceTask("")
                    }
                  }}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold outline-none focus:border-indigo-300"
                  placeholder="Ajouter un devoir..."
                />
                <button
                  onClick={() => {
                    if (!newWorkspaceTask.trim()) return
                    setWorkspaceTasks([
                      ...workspaceTasks,
                      {
                        id: Date.now(),
                        title: newWorkspaceTask,
                        subject: "Personnel",
                        done: false,
                      },
                    ])
                    setNewWorkspaceTask("")
                  }}
                  className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white"
                >
                  <Plus size={17} />
                </button>
              </div>
            </section>

            <button
              onClick={() =>
                notify("Popy ouvre une conversation sur ton travail.")
              }
              className="flex w-full items-center gap-4 rounded-2xl bg-cyan-100 p-4 text-left"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white text-cyan-700">
                <Bot size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-cyan-950">
                  Demander à Popy
                </span>
                <span className="text-xs font-bold text-cyan-800/70">
                  Explique, relis ou donne un indice
                </span>
              </span>
            </button>
          </aside>
        </div>
      </div>
    )
  }

  const sendChatMessage = (text = chatInput) => {
    const cleanText = text.trim()
    if (!cleanText) return
    const lower = cleanText.toLowerCase()
    const response = lower.includes("fraction")
      ? "Une fraction représente une ou plusieurs parts d’un tout. Imagine une pizza coupée en quatre : une part correspond à un quart."
      : lower.includes("aide")
        ? "Bien sûr. Dis-moi ce que tu as déjà compris, puis nous chercherons seulement la prochaine petite étape."
        : lower.includes("quiz")
          ? "Petit quiz : si tu partages 8 billes entre 2 enfants, combien chacun reçoit-il ?"
          : "J’ai bien reçu ta question. Je vais utiliser des mots simples et avancer une étape à la fois avec toi."
    setMessages((current) => [
      ...current,
      { from: "child", text: cleanText },
      { from: "popy", text: response },
    ])
    setChatInput("")
    setStars((current) => current + 2)
  }

  const renderChat = () => (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="font-display font-black text-slate-900">
                Popy est disponible
              </h2>
              <p className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500" />
                IA locale · aucune donnée envoyée
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              notify("Popy relit le dernier message à voix haute.")
            }
            className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"
          >
            <Volume2 size={19} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 md:p-6">
          {messages.map((message, index) => (
            <div
              key={`${message.from}-${index}`}
              className={`flex ${
                message.from === "child" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm font-bold leading-relaxed ${
                  message.from === "child"
                    ? "rounded-br-md bg-indigo-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isListening && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 text-sm font-black text-rose-700">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-60" />
                <span className="relative size-3 rounded-full bg-rose-500" />
              </span>
              Popy écoute ta voix…
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-white p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto">
            {["Explique-moi les fractions", "Quiz", "Aide-moi"].map(
              (action) => (
                <button
                  key={action}
                  onClick={() => sendChatMessage(action)}
                  className="min-w-max rounded-full bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700"
                >
                  {action}
                </button>
              ),
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsListening(!isListening)
                if (!isListening) {
                  window.setTimeout(() => {
                    setIsListening(false)
                    sendChatMessage("Aide-moi avec mon exercice")
                  }, 1600)
                }
              }}
              className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                isListening
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Mic size={20} />
            </button>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && sendChatMessage()}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
              placeholder="Écris ta question..."
            />
            <button
              onClick={() => sendChatMessage()}
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white"
            >
              <Send size={19} />
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="rounded-3xl bg-cyan-100 p-5">
          <AudioLines size={24} className="text-cyan-700" />
          <h2 className="mt-4 font-display text-lg font-black text-cyan-950">
            Tu peux parler naturellement
          </h2>
          <p className="mt-2 text-xs font-bold leading-relaxed text-cyan-900/70">
            Popy reformule les questions et adapte ses mots à ton niveau.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Ce que Popy peut faire
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Expliquer autrement",
              "Donner un indice progressif",
              "Lancer un quiz rapide",
              "Lire une consigne",
              "Proposer une pause",
            ].map((capability) => (
              <div
                key={capability}
                className="flex items-center gap-2 text-xs font-bold text-slate-600"
              >
                <Check size={15} className="text-emerald-500" />
                {capability}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )

  const renderCreativeStudio = () => (
    <div>
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-sm">
        {[
          ["Conte", BookOpen],
          ["Dessin", Brush],
          ["Musique", Music],
        ].map(([mode, Icon]) => {
          const ModeIcon = Icon as typeof BookOpen
          return (
            <button
              key={mode as string}
              onClick={() => setCreativeMode(mode as string)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black ${
                creativeMode === mode
                  ? "bg-fuchsia-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <ModeIcon size={17} />
              {mode as string}
            </button>
          )
        })}
      </div>

      {creativeMode === "Conte" && (
        <section className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-xl font-black text-slate-900">
              Imagine ton histoire
            </h2>
            <label className="mt-5 block text-xs font-black text-slate-600">
              Le sujet de ton aventure
              <input
                value={storyTopic}
                onChange={(event) => setStoryTopic(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-fuchsia-300"
                placeholder="Un robot dans l’espace..."
              />
            </label>
            <button
              disabled={!storyTopic.trim()}
              onClick={() => {
                setCreation(
                  `Un matin, Popy découvrit ${storyTopic}. Pour avancer, il devait résoudre trois énigmes et demander l’aide de son ami Léo. Ensemble, ils comprirent que la curiosité était leur plus grand pouvoir.`,
                )
                setStars((current) => current + 10)
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-black text-white disabled:opacity-40"
            >
              <Sparkles size={17} /> Créer avec Popy
            </button>
          </div>
          <div className="min-h-72 rounded-3xl bg-gradient-to-br from-fuchsia-100 to-rose-100 p-6">
            <p className="text-xs font-black uppercase tracking-wider text-fuchsia-700">
              Ton conte personnalisé
            </p>
            <p className="mt-6 font-display text-xl font-bold leading-relaxed text-fuchsia-950">
              {creation ||
                "Ton histoire apparaîtra ici. Tu pourras ensuite l’écouter, la modifier et la garder dans ton carnet."}
            </p>
            {creation && (
              <button
                onClick={() => notify("Popy commence la lecture de ton conte.")}
                className="mt-6 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-fuchsia-700"
              >
                <Volume2 size={16} /> Écouter mon histoire
              </button>
            )}
          </div>
        </section>
      )}

      {creativeMode === "Dessin" && (
        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-sky-100 via-white to-amber-100 shadow-sm">
            <div className="absolute left-[12%] top-[18%] size-24 rounded-full border-8 border-amber-300" />
            <div className="absolute bottom-[18%] left-[25%] h-4 w-1/2 rotate-6 rounded-full bg-emerald-400" />
            <div className="absolute bottom-[22%] right-[18%] h-32 w-20 rounded-t-full bg-violet-300" />
            <div className="absolute inset-x-0 bottom-4 text-center text-sm font-black text-slate-400">
              Ton espace de dessin collaboratif
            </div>
          </div>
          <aside className="rounded-3xl bg-white p-5">
            <Palette size={23} className="text-fuchsia-500" />
            <h2 className="mt-4 font-display text-lg font-black text-slate-900">
              Outils créatifs
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                "bg-rose-400",
                "bg-amber-400",
                "bg-cyan-400",
                "bg-emerald-400",
                "bg-violet-400",
                "bg-slate-700",
              ].map((color) => (
                <button
                  key={color}
                  className={`aspect-square rounded-xl ${color}`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                notify("Ton dessin est enregistré dans le carnet.")
              }
              className="mt-5 w-full rounded-xl bg-fuchsia-500 py-3 text-xs font-black text-white"
            >
              Enregistrer mon dessin
            </button>
          </aside>
        </section>
      )}

      {creativeMode === "Musique" && (
        <section className="mt-5 rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-xs font-black uppercase tracking-wider text-violet-300">
            Compositeur de mélodie
          </p>
          <h2 className="mt-2 font-display text-2xl font-black">
            Ajoute des notes puis écoute ta création
          </h2>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {[
              ["DO", "bg-rose-400"],
              ["RÉ", "bg-amber-400"],
              ["MI", "bg-emerald-400"],
              ["SOL", "bg-cyan-400"],
            ].map(([noteName, tone]) => (
              <button
                key={noteName}
                onClick={() =>
                  melody.length < 12 &&
                  setMelody((current) => [...current, noteName])
                }
                className={`h-24 rounded-2xl ${tone} font-display text-xl font-black text-slate-900 transition active:scale-95`}
              >
                {noteName}
              </button>
            ))}
          </div>
          <div className="mt-5 flex min-h-14 flex-wrap gap-2 rounded-2xl bg-white/10 p-3">
            {melody.length ? (
              melody.map((noteName, index) => (
                <span
                  key={`${noteName}-${index}`}
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-black"
                >
                  {noteName}
                </span>
              ))
            ) : (
              <span className="p-2 text-xs font-bold text-slate-400">
                Ta mélodie apparaîtra ici…
              </span>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setMelody([])}
              className="rounded-xl bg-white/10 px-4 py-3 text-xs font-black"
            >
              Effacer
            </button>
            <button
              disabled={!melody.length}
              onClick={() => notify("Popy joue ta mélodie.")}
              className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-xs font-black disabled:opacity-40"
            >
              <Play size={16} fill="currentColor" /> Écouter
            </button>
          </div>
        </section>
      )}
    </div>
  )

  const subjects = [
    {
      name: "Français",
      icon: BookOpen,
      tone: "bg-amber-100 text-amber-700",
      mission: "Lecture, vocabulaire, grammaire et expression",
      level: 78,
    },
    {
      name: "Mathématiques",
      icon: Target,
      tone: "bg-violet-100 text-violet-700",
      mission: "Nombres, calcul, géométrie et problèmes",
      level: 64,
    },
    {
      name: "Sciences",
      icon: Atom,
      tone: "bg-cyan-100 text-cyan-700",
      mission: "Vivant, matière, énergie et expériences",
      level: 86,
    },
    {
      name: "Technologie",
      icon: Code2,
      tone: "bg-blue-100 text-blue-700",
      mission: "Code, robots, objets techniques et logique",
      level: 52,
    },
    {
      name: "Histoire",
      icon: Compass,
      tone: "bg-rose-100 text-rose-700",
      mission: "Frises, personnages et grandes périodes",
      level: 72,
    },
    {
      name: "Géographie",
      icon: Map,
      tone: "bg-emerald-100 text-emerald-700",
      mission: "Cartes, paysages et vie dans le monde",
      level: 68,
    },
    {
      name: "Anglais",
      icon: Globe2,
      tone: "bg-indigo-100 text-indigo-700",
      mission: "Comprendre, parler et jouer avec les mots",
      level: 70,
    },
    {
      name: "Éducation civique",
      icon: ShieldCheck,
      tone: "bg-sky-100 text-sky-700",
      mission: "Émotions, respect, droits et coopération",
      level: 82,
    },
    {
      name: "Arts plastiques",
      icon: Palette,
      tone: "bg-fuchsia-100 text-fuchsia-700",
      mission: "Créer, observer et expérimenter",
      level: 76,
    },
    {
      name: "Éducation musicale",
      icon: Music,
      tone: "bg-pink-100 text-pink-700",
      mission: "Rythmes, sons, écoute et création",
      level: 74,
    },
    {
      name: "Sport & mouvement",
      icon: Dumbbell,
      tone: "bg-orange-100 text-orange-700",
      mission: "Bouger, coordonner et prendre soin de soi",
      level: 88,
    },
  ]

  const renderSubjects = () => {
    const current =
      subjects.find((subject) => subject.name === selectedSubject) ??
      subjects[0]
    const CurrentIcon = current.icon
    return (
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map(({ name, icon: Icon, tone, mission, level }) => (
            <button
              key={name}
              onClick={() => setSelectedSubject(name)}
              className={`group rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                selectedSubject === name
                  ? "border-indigo-300 ring-4 ring-indigo-100"
                  : "border-slate-200/80"
              }`}
            >
              <div
                className={`grid size-12 place-items-center rounded-2xl ${tone}`}
              >
                <Icon size={23} />
              </div>
              <h2 className="mt-4 font-display text-base font-black text-slate-800">
                {name}
              </h2>
              <p className="mt-1 min-h-10 text-xs font-bold leading-relaxed text-slate-400">
                {mission}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${level}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400">
                  {level}%
                </span>
              </div>
            </button>
          ))}
        </section>
        <aside className="h-fit rounded-[28px] bg-slate-900 p-6 text-white xl:sticky xl:top-6">
          <div
            className={`grid size-14 place-items-center rounded-2xl ${current.tone}`}
          >
            <CurrentIcon size={26} />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-wider text-violet-300">
            Prochaine aventure
          </p>
          <h2 className="mt-2 font-display text-2xl font-black">
            {current.name}
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-300">
            {current.mission}. Popy prépare une activité de 8 minutes avec un
            niveau adapté.
          </p>
          <div className="mt-5 space-y-2 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <Check size={15} className="text-emerald-400" /> Consigne audio
            </div>
            <div className="flex items-center gap-2">
              <Check size={15} className="text-emerald-400" /> Mode calme
            </div>
            <div className="flex items-center gap-2">
              <Check size={15} className="text-emerald-400" /> Indices
              progressifs
            </div>
          </div>
          <button
            onClick={() => notify(`L’aventure ${current.name} est prête !`)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-900"
          >
            <Rocket size={17} /> Commencer
          </button>
        </aside>
      </div>
    )
  }

  const renderHomework = () => {
    const steps = [
      "Je repère ce que la question demande.",
      "Je souligne les nombres ou les informations utiles.",
      "Je choisis l’opération puis je vérifie si le résultat est logique.",
    ]
    const rateCard = (quality: ReviewQuality) => {
      if (!currentReviewCard) return
      const updated = scheduleReview(currentReviewCard, quality)
      setReviewCards(
        reviewCards.map((card) => (card.id === updated.id ? updated : card)),
      )
      setShowAnswer(false)
      if (reviewMode === "evaluation") {
        setEvaluationScore((current) => ({
          correct: current.correct + (quality === "again" ? 0 : 1),
          total: current.total + 1,
        }))
        setEvaluationQueue((current) => current.slice(1))
        notify(
          quality === "again"
            ? "Réponse à revoir : carte remise en révision."
            : "Bonne réponse enregistrée dans l’évaluation.",
        )
        return
      }
      notify(
        quality === "again"
          ? "On revoit cette carte très bientôt."
          : "Révision planifiée grâce à la répétition espacée.",
      )
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-xl font-black text-slate-900">
            Mon exercice
          </h2>
          <label className="mt-5 block text-xs font-black text-slate-600">
            Matière
            <select
              value={homeworkSubject}
              onChange={(event) => setHomeworkSubject(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
            >
              {[
                "Mathématiques",
                "Français",
                "Histoire-Géographie",
                "Sciences",
                "Technologie",
                "Anglais",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-xs font-black text-slate-600">
            Consigne
            <textarea
              value={homeworkText}
              onChange={(event) => {
                setHomeworkText(event.target.value)
                setHomeworkStep(0)
                setHomeworkFeedback("")
              }}
              className="mt-2 min-h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-relaxed outline-none focus:border-emerald-300"
              placeholder="Recopie la consigne ici..."
            />
          </label>
          <button
            onClick={() => {
              setHomeworkText(
                "Une école commande 4 boîtes de 6 crayons. Combien de crayons reçoit-elle au total ?",
              )
              setHomeworkStep(0)
              notify("La consigne photographiée a été reconnue.")
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 py-3 text-sm font-black text-emerald-800"
          >
            <Camera size={18} /> Photographier la consigne
          </button>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs font-bold leading-relaxed text-amber-900">
            Popy ne donne pas directement la réponse. Il t’aide à trouver la
            prochaine étape par toi-même.
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[28px] bg-slate-900 p-5 text-white shadow-xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Aide progressive · {homeworkSubject}
                </p>
                <h2 className="mt-1 font-display text-xl font-black">
                  Une petite étape à la fois
                </h2>
              </div>
              <Bot size={26} className="text-emerald-300" />
            </div>
            {!homeworkText ? (
              <div className="mt-8 grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/20 text-center">
                <div>
                  <BookOpen size={35} className="mx-auto text-slate-500" />
                  <p className="mt-3 text-sm font-bold text-slate-400">
                    Ajoute une consigne pour commencer.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300">
                      Étape {homeworkStep + 1} sur 3
                    </span>
                    <button
                      onClick={() => {
                        setHomeworkStep(0)
                        setHomeworkAnswer("")
                        setHomeworkFeedback("")
                      }}
                      className="text-slate-400"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                  <p className="mt-4 font-display text-lg font-black leading-relaxed">
                    {steps[homeworkStep]}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-300">
                    {homeworkStep === 0
                      ? "Ici, on cherche le nombre total de crayons."
                      : homeworkStep === 1
                        ? "Les informations utiles sont 4 boîtes et 6 crayons dans chaque boîte."
                        : "Comme la même quantité est répétée 4 fois, une multiplication peut nous aider."}
                  </p>
                  <button
                    onClick={() => notify("Popy lit cette étape à voix haute.")}
                    className="mt-4 flex items-center gap-2 text-xs font-black text-emerald-300"
                  >
                    <Volume2 size={15} /> Écouter cette étape
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setHomeworkStep(index)}
                      className={`h-2 flex-1 rounded-full ${
                        index <= homeworkStep ? "bg-emerald-400" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                {homeworkStep < 2 ? (
                  <button
                    onClick={() => setHomeworkStep((current) => current + 1)}
                    className="mt-6 w-full rounded-xl bg-emerald-500 py-3 text-sm font-black text-emerald-950"
                  >
                    J’ai compris, étape suivante
                  </button>
                ) : (
                  <div className="mt-6">
                    <label className="text-xs font-black text-slate-300">
                      Ma réponse
                      <input
                        value={homeworkAnswer}
                        onChange={(event) =>
                          setHomeworkAnswer(event.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 p-4 text-lg font-black text-white outline-none focus:border-emerald-400"
                        placeholder="Écris ton résultat..."
                      />
                    </label>
                    <button
                      onClick={() => {
                        const success = homeworkAnswer.trim() === "24"
                        setHomeworkFeedback(
                          success
                            ? "Bravo ! 4 × 6 = 24 crayons. Tu as choisi la bonne opération."
                            : "Vérifie ton calcul : combien font 6 + 6 + 6 + 6 ?",
                        )
                        if (success) setStars((current) => current + 15)
                      }}
                      className="mt-3 w-full rounded-xl bg-emerald-500 py-3 text-sm font-black text-emerald-950"
                    >
                      Vérifier ma réponse
                    </button>
                    {homeworkFeedback && (
                      <p className="mt-3 rounded-xl bg-white/10 p-4 text-sm font-bold leading-relaxed text-emerald-200">
                        {homeworkFeedback}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="rounded-[28px] border border-violet-100 bg-violet-50 p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-violet-700">
                  {t("Révision espacée")}
                </p>
                <h2 className="mt-1 font-display text-xl font-black text-violet-950">
                  {t("Cartes à revoir et évaluation")}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setReviewMode("revision")
                    setShowAnswer(false)
                  }}
                  className={`rounded-xl px-3 py-2 text-[10px] font-black ${
                    reviewMode === "revision"
                      ? "bg-violet-700 text-white"
                      : "bg-white text-violet-700"
                  }`}
                >
                  {t("Révision")} · {dueCards.length}
                </button>
                <button
                  onClick={() => {
                    setReviewMode("evaluation")
                    setEvaluationQueue(buildEvaluation(reviewCards, 5))
                    setEvaluationScore({ correct: 0, total: 0 })
                    setShowAnswer(false)
                    notify("Évaluation de 5 cartes lancée.")
                  }}
                  className={`rounded-xl px-3 py-2 text-[10px] font-black ${
                    reviewMode === "evaluation"
                      ? "bg-violet-700 text-white"
                      : "bg-white text-violet-700"
                  }`}
                >
                  {t("Évaluation")}
                </button>
              </div>
            </div>

            {reviewMode === "evaluation" && evaluationQueue.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-white p-5 text-center">
                <p className="font-display text-2xl font-black text-violet-950">
                  {evaluationScore.correct}/{evaluationScore.total || 5}
                </p>
                <p className="mt-2 text-sm font-bold text-violet-700">
                  {t(
                    "Évaluation terminée. Les cartes ratées reviennent bientôt.",
                  )}
                </p>
              </div>
            ) : currentReviewCard ? (
              <div className="mt-5 rounded-2xl bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-violet-500">
                  {t(currentReviewCard.subject)}
                </p>
                <p className="mt-3 font-display text-lg font-black text-slate-900">
                  {t(currentReviewCard.prompt)}
                </p>
                {showAnswer ? (
                  <p className="mt-4 rounded-xl bg-violet-50 p-3 text-sm font-black text-violet-900">
                    {t(currentReviewCard.answer)}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mt-4 rounded-xl bg-violet-100 px-4 py-2.5 text-xs font-black text-violet-800"
                  >
                    {t("Afficher la réponse")}
                  </button>
                )}
                {showAnswer && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(
                      [
                        ["again", "À revoir"],
                        ["hard", "Difficile"],
                        ["good", "Bien"],
                        ["easy", "Facile"],
                      ] as Array<[ReviewQuality, string]>
                    ).map(([quality, label]) => (
                      <button
                        key={quality}
                        onClick={() => rateCard(quality)}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-black text-white"
                      >
                        {t(label)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-5 text-sm font-bold text-violet-800">
                {t("Aucune carte due pour le moment. Reviens plus tard !")}
              </p>
            )}
          </section>
        </div>
      </div>
    )
  }

  const renderMissions = () => (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.7fr]">
      <section className="grid gap-4 sm:grid-cols-2">
        {missions.map((mission, index) => {
          const isDone = done.includes(index)
          return (
            <article
              key={mission.title}
              className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isDone ? "border-emerald-200" : "border-slate-200/80"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid size-14 place-items-center rounded-2xl font-display text-lg font-black ${mission.tone}`}
                >
                  {mission.icon}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">
                  {mission.label}
                </span>
              </div>
              <h2 className="mt-5 font-display text-lg font-black text-slate-800">
                {mission.title}
              </h2>
              <p className="mt-1 text-xs font-bold text-slate-400">
                {mission.detail}
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDone ? "w-full bg-emerald-500" : "w-1/3 bg-indigo-500"
                  }`}
                />
              </div>
              <button
                onClick={() => toggleDone(index)}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-black ${
                  isDone
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {isDone ? (
                  <Check size={17} />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                {isDone ? "Mission réussie" : "Commencer"}
              </button>
            </article>
          )
        })}
      </section>
      <aside className="space-y-5">
        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <Target size={24} className="text-violet-300" />
          <h2 className="mt-5 font-display text-xl font-black">
            Mon objectif doux
          </h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
            Deux missions suffisent aujourd’hui. Le reste peut attendre demain.
          </p>
          <div className="mt-5 flex gap-2">
            {[0, 1, 2].map((step) => (
              <span
                key={step}
                className={`h-3 flex-1 rounded-full ${
                  step < done.length ? "bg-emerald-400" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-700">
              <WandSparkles size={17} /> Adaptation automatique
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-indigo-600">
              {adaptivePlan.sessionMinutes} min
            </span>
          </div>
          <p className="mt-3 text-sm font-black leading-relaxed text-indigo-950">
            {adaptivePlan.message}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-indigo-600">
              Niveau {adaptivePlan.difficulty}
            </span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-indigo-600">
              Indices {adaptivePlan.hintLevel}
            </span>
            {adaptivePlan.audioEnabled && (
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-indigo-600">
                Audio actif
              </span>
            )}
            {adaptivePlan.breakRecommended && (
              <span className="rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-black text-amber-900">
                Pause conseillée
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => notify("Popy va lire les consignes à voix haute.")}
          className="flex w-full items-center gap-4 rounded-2xl bg-amber-100 p-4 text-left"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-white text-amber-700">
            <Volume2 size={20} />
          </span>
          <span>
            <span className="block text-sm font-black text-amber-950">
              Lire les consignes
            </span>
            <span className="text-xs font-bold text-amber-800/70">
              Popy peut tout lire pour toi
            </span>
          </span>
        </button>
      </aside>
    </div>
  )

  const startSimon = () => {
    setSimonSequence([0, 2, 1, 3])
    setSimonInput([])
    setSimonMessage("Mémorise : rouge, vert, bleu, jaune.")
  }

  const pressSimon = (colorIndex: number) => {
    if (!simonSequence.length) return
    const nextInput = [...simonInput, colorIndex]
    const expected = simonSequence[nextInput.length - 1]
    if (colorIndex !== expected) {
      setSimonInput([])
      setSimonMessage("Pas encore. La séquence recommence doucement.")
      return
    }
    setSimonInput(nextInput)
    if (nextInput.length === simonSequence.length) {
      setSimonMessage("Séquence réussie ! Tu gagnes 15 étoiles.")
      setStars((current) => current + 15)
      setGameStats((current) => ({
        ...current,
        simonLevel: current.simonLevel + 1,
      }))
      setCampaignXp((current) => current + 20)
      setSimonSequence([])
    } else {
      setSimonMessage(`${nextInput.length} couleur(s) correcte(s) sur 4.`)
    }
  }

  const renderGames = () => (
    <div>
      <section className="mb-5 overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white md:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-violet-300">
              Campagne de Popy
            </p>
            <h2 className="mt-2 font-display text-2xl font-black">
              La route des cinq mondes
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Réussis des jeux pour gagner de l’XP et débloquer de nouveaux
              univers.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <div className="font-display text-2xl font-black">
              {campaignXp} XP
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              Progression de campagne
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-5">
          {campaignWorlds.map((world) => {
            const unlocked = campaignXp >= world.requiredXp
            const worldDone = world.levels.every((level) =>
              completedWorldLevels.includes(level.id),
            )
            return (
              <button
                key={world.id}
                disabled={!unlocked}
                onClick={() => {
                  setSelectedWorldId(world.id)
                  setActiveWorldLevelId(null)
                  notify(
                    `${world.label} sélectionné. Choisis un niveau pour jouer.`,
                  )
                }}
                className={`relative rounded-2xl p-4 text-left transition ${
                  unlocked
                    ? selectedWorldId === world.id
                      ? "bg-violet-400/30 ring-2 ring-violet-300"
                      : "bg-white/10 hover:-translate-y-1 hover:bg-white/15"
                    : "bg-black/20 opacity-45"
                }`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-xl text-xs font-black ${
                    unlocked
                      ? "bg-violet-400 text-violet-950"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {world.id}
                </span>
                <span className="mt-3 block text-xs font-black">
                  {world.label}
                </span>
                <span className="mt-1 block text-[9px] font-bold text-slate-400">
                  {unlocked
                    ? worldDone
                      ? "Monde terminé"
                      : `${world.levels.filter((level) => completedWorldLevels.includes(level.id)).length}/${world.levels.length} niveaux`
                    : `${world.requiredXp} XP requis`}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-700"
            style={{ width: `${Math.min(100, (campaignXp / 350) * 100)}%` }}
          />
        </div>
        {campaignXp >= selectedWorld.requiredXp && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {selectedWorld.levels.map((level, index) => {
              const previousCompleted =
                index === 0 ||
                completedWorldLevels.includes(
                  selectedWorld.levels[index - 1].id,
                )
              const completed = completedWorldLevels.includes(level.id)
              const playable = previousCompleted
              return (
                <button
                  key={level.id}
                  disabled={!playable}
                  onClick={() => setActiveWorldLevelId(level.id)}
                  className={`rounded-2xl p-4 text-left ${
                    playable
                      ? completed
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "bg-white/10 hover:bg-white/15"
                      : "bg-black/20 opacity-40"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider text-violet-200">
                    Niveau {index + 1}
                  </span>
                  <span className="mt-2 block text-sm font-black">
                    {level.title}
                  </span>
                  <span className="mt-1 block text-[10px] font-bold text-slate-300">
                    {level.detail} · +{level.rewardXp} XP
                  </span>
                  <span className="mt-3 block text-[10px] font-black text-cyan-200">
                    {completed
                      ? "Réussi"
                      : playable
                        ? "Jouer"
                        : "Termine le niveau précédent"}
                  </span>
                </button>
              )
            })}
          </div>
        )}
        {activeWorldLevel && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-cyan-200">
                  {selectedWorld.label}
                </p>
                <h3 className="mt-1 font-display text-xl font-black">
                  {activeWorldLevel.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {activeWorldLevel.question}
                </p>
              </div>
              <button
                onClick={() => setActiveWorldLevelId(null)}
                className="rounded-lg bg-white/10 px-3 py-2 text-[10px] font-black"
              >
                Fermer
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeWorldLevel.answers.map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    if (answer === activeWorldLevel.correct) {
                      if (!completedWorldLevels.includes(activeWorldLevel.id)) {
                        setCompletedWorldLevels([
                          ...completedWorldLevels,
                          activeWorldLevel.id,
                        ])
                        setCampaignXp(
                          (current) => current + activeWorldLevel.rewardXp,
                        )
                        setStars(
                          (current) => current + activeWorldLevel.rewardXp,
                        )
                      }
                      notify(
                        `Bravo ! Niveau réussi : +${activeWorldLevel.rewardXp} XP.`,
                      )
                      setActiveWorldLevelId(null)
                    } else {
                      notify("Presque ! Réessaie ce niveau.")
                    }
                  }}
                  className="rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-900"
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
      <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
        {["Simon", "Danse", "Chasse au trésor", "Quiz"].map((mode) => (
          <button
            key={mode}
            onClick={() => setFeaturedGame(mode)}
            className={`min-w-max rounded-xl px-4 py-3 text-xs font-black ${
              featuredGame === mode
                ? "bg-fuchsia-500 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {featuredGame === "Simon" && (
        <section className="mt-5 grid gap-5 rounded-[28px] bg-slate-900 p-5 text-white lg:grid-cols-[1fr_300px] md:p-7">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-violet-300">
              Mémoire et attention · Niveau {gameStats.simonLevel}
            </p>
            <h2 className="mt-2 font-display text-2xl font-black">
              Simon avec Popy
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Observe la séquence puis touche les couleurs dans le même ordre.
            </p>
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-3">
              {[
                "bg-rose-500",
                "bg-blue-500",
                "bg-emerald-500",
                "bg-amber-400",
              ].map((color, index) => (
                <button
                  key={color}
                  onClick={() => pressSimon(index)}
                  className={`h-28 rounded-3xl ${color} border-4 border-white/10 transition active:scale-95`}
                />
              ))}
            </div>
          </div>
          <aside className="rounded-2xl bg-white/10 p-5">
            <Target size={23} className="text-violet-300" />
            <h3 className="mt-4 font-display text-lg font-black">Séquence</h3>
            <div className="mt-4 flex gap-2">
              {(simonSequence.length ? simonSequence : [0, 1, 2, 3]).map(
                (_, index) => (
                  <span
                    key={index}
                    className={`grid size-10 place-items-center rounded-xl text-xs font-black ${
                      index < simonInput.length
                        ? "bg-emerald-400 text-emerald-950"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                ),
              )}
            </div>
            <p className="mt-5 min-h-12 text-xs font-bold leading-relaxed text-slate-300">
              {simonMessage || "Appuie sur démarrer pour afficher la séquence."}
            </p>
            <button
              onClick={startSimon}
              className="mt-4 w-full rounded-xl bg-violet-500 py-3 text-sm font-black"
            >
              Démarrer une partie
            </button>
          </aside>
        </section>
      )}

      {featuredGame === "Danse" && (
        <section className="mt-5 grid gap-5 rounded-[28px] bg-gradient-to-br from-indigo-700 to-fuchsia-600 p-6 text-white lg:grid-cols-[1fr_320px]">
          <div className="relative grid min-h-80 place-items-center overflow-hidden rounded-3xl bg-slate-950/30">
            <span
              className={`absolute left-8 top-8 size-20 rounded-full bg-cyan-400/40 blur-xl ${
                danceActive ? "child-orb" : ""
              }`}
            />
            <span
              className={`absolute bottom-8 right-8 size-24 rounded-full bg-rose-400/40 blur-xl ${
                danceActive ? "child-star" : ""
              }`}
            />
            <div className={danceActive ? "popy-dance" : ""}>
              <PopyMascot />
            </div>
            <span className="absolute bottom-4 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">
              Simulation des mouvements et LED
            </span>
          </div>
          <aside>
            <p className="text-xs font-black uppercase tracking-wider text-fuchsia-200">
              Mouvement et rythme
            </p>
            <h2 className="mt-2 font-display text-2xl font-black">
              Danse avec Popy
            </h2>
            <div className="mt-6 space-y-2">
              {["Pop", "Rock", "Calme"].map((style) => (
                <button
                  key={style}
                  onClick={() => setDanceStyle(style)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-black ${
                    danceStyle === style
                      ? "bg-white text-indigo-700"
                      : "bg-white/10"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDanceActive(!danceActive)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 py-3 text-sm font-black text-amber-950"
            >
              {danceActive ? (
                <Pause size={17} />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
              {danceActive ? "Arrêter" : `Lancer le mode ${danceStyle}`}
            </button>
          </aside>
        </section>
      )}

      {featuredGame === "Chasse au trésor" && (
        <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
              Mission d’exploration
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Trouve trois objets autour de toi
            </h2>
            <div className="mt-5 space-y-3">
              {["Un objet rond", "Un objet bleu", "Un objet naturel"].map(
                (objectName) => {
                  const found = treasureFound.includes(objectName)
                  return (
                    <div
                      key={objectName}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <span
                        className={`grid size-7 place-items-center rounded-lg ${
                          found
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {found ? <Check size={15} /> : treasureFound.length + 1}
                      </span>
                      <span className="text-sm font-black text-slate-700">
                        {objectName}
                      </span>
                    </div>
                  )
                },
              )}
            </div>
          </div>
          <div className="relative grid min-h-96 place-items-center overflow-hidden rounded-[28px] bg-slate-900 text-white">
            <div className="absolute inset-8 rounded-3xl border-2 border-dashed border-emerald-300/50" />
            <Camera size={52} className="text-emerald-300" />
            <p className="absolute top-6 text-xs font-black text-slate-300">
              Aperçu caméra simulé · traitement local
            </p>
            <button
              disabled={treasureFound.length >= 3}
              onClick={() => {
                const objects = [
                  "Un objet rond",
                  "Un objet bleu",
                  "Un objet naturel",
                ]
                const next = objects[treasureFound.length]
                setTreasureFound([...treasureFound, next])
                if (treasureFound.length === 2) {
                  setStars((current) => current + 20)
                  setCampaignXp((current) => current + 30)
                  setGameStats((current) => ({
                    ...current,
                    treasureRuns: current.treasureRuns + 1,
                  }))
                }
              }}
              className="absolute bottom-6 flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 disabled:opacity-40"
            >
              <Camera size={17} />
              {treasureFound.length >= 3
                ? "Mission terminée"
                : "Scanner l’objet"}
            </button>
          </div>
        </section>
      )}

      {featuredGame === "Quiz" && (
        <section className="mt-5 rounded-[28px] bg-indigo-50 p-5">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Quiz multi-thématiques
            </p>
            <h2 className="mt-1 font-display text-2xl font-black text-indigo-950">
              Choisis un défi dans le catalogue
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {games.map(
              ({ title: gameTitle, skill, icon: Icon, tone }, index) => (
                <article
                  key={gameTitle}
                  className="group overflow-hidden rounded-3xl bg-white p-3 shadow-sm"
                >
                  <div
                    className={`relative grid h-32 place-items-center rounded-[22px] bg-gradient-to-br ${tone} text-white`}
                  >
                    <Icon size={42} />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {skill}
                    </p>
                    <h3 className="mt-1 font-display font-black text-slate-800">
                      {gameTitle}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveGame(index)
                        setGameAnswer("")
                        setGameResult("")
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-black text-white"
                    >
                      <Gamepad2 size={16} /> Jouer
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  )

  const renderTechLab = () => {
    const targetProgram = ["Avance", "Avance", "Droite"]
    const circuitComplete =
      circuit.includes("Pile") &&
      circuit.includes("Interrupteur") &&
      circuit.includes("Lampe")
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <Code2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                Atelier 1 · Algorithmes
              </p>
              <h2 className="font-display text-xl font-black text-slate-900">
                Programme le chemin de Popy
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm font-bold leading-relaxed text-slate-500">
            Popy doit avancer deux fois, puis tourner à droite pour atteindre la
            station de recharge.
          </p>

          <div className="mt-5 grid h-44 grid-cols-4 gap-2 rounded-2xl bg-slate-100 p-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((cell) => (
              <div
                key={cell}
                className={`grid place-items-center rounded-xl border-2 border-dashed ${
                  cell === 2
                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                    : cell === 5
                      ? "border-blue-300 bg-blue-100 text-blue-700"
                      : "border-slate-200 bg-white"
                }`}
              >
                {cell === 2 && <Bot size={22} />}
                {cell === 5 && <Zap size={22} fill="currentColor" />}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Avance", "Gauche", "Droite"].map((instruction) => (
              <button
                key={instruction}
                onClick={() =>
                  program.length < 5 &&
                  setProgram((current) => [...current, instruction])
                }
                className="rounded-xl bg-blue-100 px-4 py-3 text-xs font-black text-blue-800 hover:bg-blue-200"
              >
                + {instruction}
              </button>
            ))}
            <button
              onClick={() => {
                setProgram([])
                setProgramResult("")
              }}
              className="rounded-xl bg-slate-100 px-4 py-3 text-xs font-black text-slate-500"
            >
              Effacer
            </button>
          </div>
          <div className="mt-4 min-h-16 rounded-2xl bg-slate-900 p-3">
            <div className="flex flex-wrap gap-2">
              {program.length ? (
                program.map((step, index) => (
                  <span
                    key={`${step}-${index}`}
                    className="rounded-lg bg-white/10 px-3 py-2 text-xs font-black text-white"
                  >
                    {index + 1}. {step}
                  </span>
                ))
              ) : (
                <span className="p-2 text-xs font-bold text-slate-400">
                  Ajoute tes instructions ici…
                </span>
              )}
            </div>
          </div>
          {programResult && (
            <p
              className={`mt-3 rounded-xl p-3 text-xs font-black ${
                programResult === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {programResult === "success"
                ? "Programme réussi ! Popy a trouvé sa station."
                : "Popy n’arrive pas encore à la station. Vérifie l’ordre."}
            </p>
          )}
          <button
            onClick={() => {
              const success =
                JSON.stringify(program) === JSON.stringify(targetProgram)
              setProgramResult(success ? "success" : "retry")
              if (success) setStars((current) => current + 25)
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-black text-white"
          >
            <Play size={16} fill="currentColor" /> Exécuter le programme
          </button>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                Atelier 2 · Électricité
              </p>
              <h2 className="font-display text-xl font-black text-slate-900">
                Construis un circuit lumineux
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm font-bold leading-relaxed text-slate-500">
            Choisis les bons éléments pour permettre à la lampe de s’allumer.
          </p>
          <div className="relative mt-5 grid h-56 place-items-center overflow-hidden rounded-3xl bg-slate-900">
            <div
              className={`grid size-28 place-items-center rounded-full border-8 transition-all duration-500 ${
                circuitComplete
                  ? "border-amber-200 bg-amber-300 text-amber-950 shadow-[0_0_70px_rgba(251,191,36,0.7)]"
                  : "border-slate-700 bg-slate-800 text-slate-500"
              }`}
            >
              <Lightbulb
                size={46}
                fill={circuitComplete ? "currentColor" : "none"}
              />
            </div>
            <span className="absolute bottom-4 text-xs font-black text-slate-400">
              {circuitComplete
                ? "Le circuit est fermé"
                : "Le circuit est incomplet"}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["Pile", "Interrupteur", "Lampe", "Bois", "Papier", "Tissu"].map(
              (component) => {
                const selected = circuit.includes(component)
                return (
                  <button
                    key={component}
                    onClick={() =>
                      setCircuit((current) =>
                        selected
                          ? current.filter((item) => item !== component)
                          : [...current, component],
                      )
                    }
                    className={`rounded-xl px-2 py-3 text-xs font-black ${
                      selected
                        ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {component}
                  </button>
                )
              },
            )}
          </div>
          <div className="mt-5 rounded-2xl bg-cyan-50 p-4">
            <p className="text-xs font-bold leading-relaxed text-cyan-900">
              Un circuit a besoin d’une source d’énergie, d’un appareil et d’un
              chemin fermé pour que le courant circule.
            </p>
          </div>
        </section>
      </div>
    )
  }

  const renderLibrary = () => {
    const filtered = library.filter(
      (item) =>
        (libraryFilter === "Tout" || item.type === libraryFilter) &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return (
      <>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Chercher une histoire..."
            />
          </div>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {["Tout", "Histoires", "Vidéos", "Audio"].map((filter) => (
              <button
                key={filter}
                onClick={() => setLibraryFilter(filter)}
                className={`rounded-lg px-3 py-2 text-xs font-black ${
                  libraryFilter === filter
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid size-14 place-items-center rounded-2xl ${item.tone}`}
                >
                  {item.type === "Audio" ? (
                    <Volume2 size={24} />
                  ) : item.type === "Vidéos" ? (
                    <Play size={24} fill="currentColor" />
                  ) : (
                    <BookOpen size={24} />
                  )}
                </div>
                <button
                  onClick={() =>
                    setFavorites((current) =>
                      current.includes(index)
                        ? current.filter((favorite) => favorite !== index)
                        : [...current, index],
                    )
                  }
                  className={`grid size-9 place-items-center rounded-xl ${
                    favorites.includes(index)
                      ? "bg-rose-100 text-rose-500"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Heart
                    size={17}
                    fill={favorites.includes(index) ? "currentColor" : "none"}
                  />
                </button>
              </div>
              <h2 className="mt-5 font-display text-lg font-black text-slate-800">
                {item.title}
              </h2>
              <p className="mt-2 text-xs font-bold text-slate-400">
                {item.format} · {item.duration}
              </p>
              <button
                onClick={() => setReadingItem(library.indexOf(item))}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 py-3 text-sm font-black text-amber-900"
              >
                <Play size={16} fill="currentColor" /> Découvrir
              </button>
            </article>
          ))}
        </section>
      </>
    )
  }

  const renderPlanning = () => {
    const schedule = [
      ["09:00", "École", "La journée commence"],
      ["16:30", "Goûter et vraie pause", "Pas d’écran · 30 min"],
      ["17:15", "Mission avec Popy", "Une seule mission · 10 min"],
      ["17:30", "Temps libre", "Tu choisis ton activité"],
    ]
    return (
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((item) => (
              <button
                key={item}
                onClick={() => setDay(item)}
                className={`min-w-20 rounded-xl px-3 py-3 text-xs font-black ${
                  day === item
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {schedule.map(([time, event, detail], index) => (
              <button
                key={event}
                onClick={() => toggleDone(index)}
                className="flex w-full items-center gap-4 rounded-2xl bg-slate-50 p-4 text-left hover:bg-cyan-50"
              >
                <span
                  className={`grid size-7 place-items-center rounded-lg border ${
                    done.includes(index)
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {done.includes(index) && <Check size={14} />}
                </span>
                <span className="w-12 text-xs font-black text-cyan-700">
                  {time}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-black text-slate-800">
                    {event}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="rounded-3xl bg-cyan-100 p-6">
            <CalendarCheck size={25} className="text-cyan-700" />
            <h2 className="mt-5 font-display text-xl font-black text-cyan-950">
              Aujourd’hui, c’est léger
            </h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-cyan-900/70">
              Une mission suffit. Popy te préviendra cinq minutes avant.
            </p>
          </div>
          <button
            onClick={() => notify("Un rappel doux a été ajouté à 17:10.")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-black text-white"
          >
            <Bell size={18} /> Ajouter un rappel
          </button>
        </aside>
      </div>
    )
  }

  const renderProgress = () => (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-black text-slate-900">
          Ma constellation de compétences
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-400">
          Chaque barre grandit quand tu trouves une nouvelle stratégie.
        </p>
        <div className="mt-7 space-y-6">
          {[
            ["Je lis et je comprends", 78, "bg-violet-500"],
            ["Je joue avec les nombres", 64, "bg-indigo-500"],
            ["Je cherche et j’expérimente", 88, "bg-cyan-500"],
            ["Je m’organise seul", 72, "bg-emerald-500"],
          ].map(([skill, value, tone]) => (
            <div key={skill as string}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-black text-slate-700">
                  {skill}
                </span>
                <span className="text-xs font-black text-slate-400">
                  {value}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${tone}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <aside className="space-y-5">
        <div className="rounded-3xl bg-emerald-100 p-6 text-emerald-950">
          <Award size={28} />
          <p className="mt-5 text-xs font-black uppercase tracking-wider text-emerald-700">
            La fierté de la semaine
          </p>
          <h2 className="mt-2 font-display text-xl font-black">
            Tu as demandé un indice au bon moment.
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-emerald-900/70">
            Savoir demander de l’aide est une vraie compétence.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <span className="text-xs font-black text-slate-400">
            Temps concentré cette semaine
          </span>
          <div className="mt-2 font-display text-3xl font-black text-slate-900">
            1 h 45
          </div>
          <p className="mt-1 text-xs font-bold text-indigo-600">
            En 9 petites séances
          </p>
        </div>
      </aside>
    </div>
  )

  const renderRewards = () => {
    const rewards = [
      ["Casque cosmique", 180, "Accessoire"],
      ["Voix explorateur", 240, "Voix"],
      ["Lumière turquoise", 120, "Couleur"],
      ["Danse de la victoire", 300, "Animation"],
      ["Univers sous-marin", 450, "Décor"],
      ["Indice bonus", 80, "Pouvoir"],
    ] as const
    return (
      <>
        <div className="flex items-center justify-between rounded-2xl bg-amber-100 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-white text-amber-500">
              <Star size={22} fill="currentColor" />
            </div>
            <div>
              <div className="font-display text-2xl font-black text-amber-950">
                {stars} étoiles
              </div>
              <p className="text-xs font-bold text-amber-800/70">
                Gagnées grâce à tes efforts
              </p>
            </div>
          </div>
          <Trophy size={28} className="text-amber-600" />
        </div>
        <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rewards.map(([reward, price, kind], index) => {
            const owned = purchased.includes(index)
            return (
              <article
                key={reward}
                className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="grid h-28 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100">
                  {kind === "Couleur" ? (
                    <Palette size={40} className="text-rose-500" />
                  ) : kind === "Voix" ? (
                    <Volume2 size={40} className="text-violet-500" />
                  ) : (
                    <Sparkles size={40} className="text-amber-500" />
                  )}
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {kind}
                </p>
                <h2 className="mt-1 font-display text-lg font-black text-slate-800">
                  {reward}
                </h2>
                <button
                  disabled={owned || stars < price}
                  onClick={() => {
                    setStars((current) => current - price)
                    setPurchased([...purchased, index])
                    notify(`${reward} a été ajouté à ta collection !`)
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-black text-white disabled:bg-emerald-100 disabled:text-emerald-800"
                >
                  {owned ? (
                    <>
                      <Check size={16} /> Débloqué
                    </>
                  ) : (
                    <>
                      <Star size={15} fill="currentColor" /> {price}
                    </>
                  )}
                </button>
              </article>
            )
          })}
        </section>
      </>
    )
  }

  const renderNotebook = () => (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-rose-500">
          Mon météo intérieure
        </p>
        <h2 className="mt-2 font-display text-xl font-black text-slate-900">
          Comment te sens-tu maintenant ?
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Calme", "bg-emerald-100 text-emerald-800"],
            ["Content", "bg-amber-100 text-amber-800"],
            ["Fatigué", "bg-indigo-100 text-indigo-800"],
            ["Agité", "bg-rose-100 text-rose-800"],
          ].map(([label, tone]) => (
            <button
              key={label}
              onClick={() => setMood(label)}
              className={`rounded-2xl px-3 py-4 text-sm font-black transition ${tone} ${
                mood === label ? "ring-4 ring-indigo-200" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-6 block text-xs font-black text-slate-600">
          Ce que j’ai envie de raconter
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
            placeholder="Aujourd’hui, je suis fier de..."
          />
        </label>
        <button
          disabled={!note.trim() && !mood}
          onClick={() => {
            setNotes([
              `${mood || "Une pensée"} · ${note || "Émotion enregistrée"}`,
              ...notes,
            ])
            setNote("")
            setMood("")
            notify("Ton carnet a bien été enregistré.")
          }}
          className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white disabled:opacity-40"
        >
          <Heart size={17} fill="currentColor" /> Garder dans mon carnet
        </button>
      </section>
      <aside className="rounded-3xl bg-rose-50 p-5">
        <h2 className="font-display text-lg font-black text-rose-950">
          Mes derniers souvenirs
        </h2>
        <div className="mt-4 space-y-3">
          {[
            ...notes,
            "Fier · J’ai terminé une lecture difficile.",
            "Calme · La pause avec Popy m’a aidé.",
          ].map((memory, index) => (
            <div
              key={`${memory}-${index}`}
              className="rounded-2xl bg-white p-4"
            >
              <p className="text-xs font-bold leading-relaxed text-slate-600">
                {memory}
              </p>
              <span className="mt-2 block text-[10px] font-black text-rose-400">
                {index === 0 && notes.length ? "À l’instant" : "Cette semaine"}
              </span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )

  const renderPopy = () => (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section
        className={`relative grid min-h-96 place-items-center overflow-hidden rounded-[32px] bg-gradient-to-br ${
          popyColor === "Indigo"
            ? "from-indigo-500 to-violet-600"
            : popyColor === "Turquoise"
              ? "from-cyan-400 to-teal-600"
              : "from-amber-400 to-orange-500"
        }`}
      >
        <span className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10" />
        <div className={connected ? "child-popy-float" : ""}>
          <PopyMascot />
        </div>
        <span className="absolute bottom-5 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur-sm">
          <span
            className={`size-2 rounded-full ${
              connected ? "bg-emerald-300" : "bg-slate-300"
            }`}
          />
          {connected ? "Popy est connecté" : "Mode application seule"}
        </span>
      </section>
      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi size={20} className="text-indigo-600" />
              <div>
                <div className="text-sm font-black text-slate-800">
                  Connexion au robot
                </div>
                <div className="text-xs font-bold text-slate-400">
                  L’application fonctionne aussi sans lui
                </div>
              </div>
            </div>
            <button
              onClick={() => setConnected(!connected)}
              className={`relative h-7 w-12 rounded-full ${
                connected ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-white transition ${
                  connected ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-indigo-600" />
            <span className="text-sm font-black text-slate-800">
              Volume de la voix · {volume}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="mt-4 w-full accent-indigo-600"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Palette size={20} className="text-indigo-600" />
            <span className="text-sm font-black text-slate-800">
              Couleur préférée
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Indigo", "Turquoise", "Soleil"].map((color) => (
              <button
                key={color}
                onClick={() => setPopyColor(color)}
                className={`rounded-xl px-3 py-3 text-xs font-black ${
                  popyColor === color
                    ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => notify("Les préférences de Popy sont enregistrées.")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-black text-white"
        >
          <Check size={18} /> Enregistrer mon Popy
        </button>
      </section>
    </div>
  )

  const renderPage = () => {
    switch (title) {
      case "Mon bureau":
        return renderWorkspace()
      case "Parler à Popy":
        return renderChat()
      case "Toutes les matières":
        return renderSubjects()
      case "Mes missions":
        return renderMissions()
      case "Aide aux devoirs":
        return renderHomework()
      case "Jeux & défis":
        return renderGames()
      case "Laboratoire Tech":
        return renderTechLab()
      case "Studio créatif":
        return renderCreativeStudio()
      case "Bibliothèque":
        return renderLibrary()
      case "Mon planning":
        return renderPlanning()
      case "Mes progrès":
        return renderProgress()
      case "Mes récompenses":
        return renderRewards()
      case "Mon carnet":
        return renderNotebook()
      case "Mon Popy":
        return renderPopy()
      default:
        return null
    }
  }

  return (
    <main className="child-world min-h-[calc(100vh-5rem)] p-4 md:p-7">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-black text-white shadow-2xl">
          <Sparkles size={18} className="shrink-0 text-amber-300" />
          {feedback}
        </div>
      )}
      <div className="mx-auto w-full max-w-[1500px]">
        <section
          className={`relative overflow-hidden rounded-[28px] bg-gradient-to-r ${meta.color} px-6 py-7 text-white shadow-xl md:px-8`}
        >
          <span className="absolute -right-12 -top-16 size-56 rounded-full bg-white/10" />
          <span className="absolute -bottom-20 right-48 size-40 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/75">
                {meta.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl font-black md:text-4xl">
                {meta.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-white/80">
                {meta.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
              <Star size={19} fill="currentColor" className="text-amber-300" />
              <div>
                <div className="text-sm font-black">{stars} étoiles</div>
                <div className="text-[10px] font-bold text-white/70">
                  Mon énergie gagnée
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-6">{renderPage()}</div>
      </div>
      {readingItem !== null && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/70 p-3 backdrop-blur-sm md:p-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="font-display font-black text-slate-900">
                    {library[readingItem].title}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Lecteur adapté Popy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReadingItem(null)}
                className="grid size-10 place-items-center rounded-xl bg-slate-100 text-lg font-black text-slate-500"
              >
                ×
              </button>
            </header>

            <div className="grid min-h-0 flex-1 md:grid-cols-[250px_1fr]">
              <aside className="overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Mode de lecture
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    ["Confort", Eye, "Lecture claire et aérée"],
                    ["DYS", Accessibility, "Espacement renforcé"],
                    ["Focus", Target, "Une idée à la fois"],
                    ["Audio", Volume2, "Popy lit avec toi"],
                  ].map(([mode, Icon, detail]) => {
                    const ModeIcon = Icon as typeof Eye
                    return (
                      <button
                        key={mode as string}
                        onClick={() => setReadingMode(mode as string)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${
                          readingMode === mode
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-600 hover:bg-indigo-50"
                        }`}
                      >
                        <ModeIcon size={18} />
                        <span>
                          <span className="block text-xs font-black">
                            {mode as string}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              readingMode === mode
                                ? "text-indigo-100"
                                : "text-slate-400"
                            }`}
                          >
                            {detail as string}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Taille du texte · {readerSize}
                </p>
                <input
                  type="range"
                  min="15"
                  max="28"
                  value={readerSize}
                  onChange={(event) =>
                    setReaderSize(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-indigo-600"
                />

                <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Espacement · {readerSpacing.toFixed(1)}
                </p>
                <input
                  type="range"
                  min="1.4"
                  max="2.4"
                  step="0.1"
                  value={readerSpacing}
                  onChange={(event) =>
                    setReaderSpacing(Number(event.target.value))
                  }
                  className="mt-3 w-full accent-indigo-600"
                />

                <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Lumière
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["Clair", Sun],
                    ["Crème", BookOpen],
                    ["Nuit", Moon],
                  ].map(([theme, Icon]) => {
                    const ThemeIcon = Icon as typeof Sun
                    return (
                      <button
                        key={theme as string}
                        onClick={() => setReaderTheme(theme as string)}
                        className={`grid place-items-center gap-1 rounded-xl p-2 text-[10px] font-black ${
                          readerTheme === theme
                            ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        <ThemeIcon size={16} />
                        {theme as string}
                      </button>
                    )
                  })}
                </div>
              </aside>

              <section
                className={`relative overflow-y-auto p-6 md:p-12 ${
                  readerTheme === "Nuit"
                    ? "bg-slate-900 text-slate-100"
                    : readerTheme === "Crème"
                      ? "bg-amber-50 text-amber-950"
                      : "bg-white text-slate-800"
                }`}
              >
                <div className="mx-auto max-w-3xl">
                  <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-black text-indigo-700">
                      Chapitre 1 sur 4
                    </span>
                    {readingMode === "Audio" && (
                      <button
                        onClick={() =>
                          notify("Lecture audio lancée à vitesse lente.")
                        }
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white"
                      >
                        <Volume2 size={16} /> Écouter avec Popy
                      </button>
                    )}
                  </div>
                  <h1 className="font-display text-3xl font-black">
                    Le secret de la cabane
                  </h1>
                  <div
                    className={`mt-8 space-y-6 font-semibold ${
                      readingMode === "DYS"
                        ? "tracking-[0.08em] word-spacing-wide"
                        : ""
                    }`}
                    style={{
                      fontSize: `${readerSize}px`,
                      lineHeight: readerSpacing,
                    }}
                  >
                    <p
                      className={
                        readingMode === "Focus"
                          ? "rounded-2xl bg-indigo-100 p-4 text-indigo-950"
                          : ""
                      }
                    >
                      Au fond du jardin, Léo aperçut une petite cabane qu’il
                      n’avait jamais remarquée. Sa porte était peinte en bleu,
                      comme le ciel après la pluie.
                    </p>
                    <p className={readingMode === "Focus" ? "opacity-30" : ""}>
                      Il s’approcha doucement. Sur la poignée, une étiquette
                      disait : « Ici, chaque mot ouvre un nouveau chemin. »
                    </p>
                    <p className={readingMode === "Focus" ? "opacity-30" : ""}>
                      Léo poussa la porte. À l’intérieur, des livres flottaient
                      dans les airs et une voix familière lui souhaita la
                      bienvenue. C’était Popy, prêt pour une nouvelle aventure.
                    </p>
                  </div>
                  <div className="mt-10">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>Progression</span>
                      <span>25%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-1/4 rounded-full bg-indigo-500" />
                    </div>
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() =>
                          notify(
                            "Chapitre terminé : ta progression est enregistrée.",
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white"
                      >
                        Chapitre suivant <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      {activeGame !== null && title === "Jeux & défis" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-indigo-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 text-center shadow-2xl md:p-8">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-fuchsia-100 text-fuchsia-600">
              {(() => {
                const GameIcon = games[activeGame].icon
                return <GameIcon size={36} />
              })()}
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-wider text-fuchsia-600">
              Défi express
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              {games[activeGame].title}
            </h2>
            <p className="mt-3 text-sm font-bold leading-relaxed text-slate-500">
              {games[activeGame].prompt}
            </p>
            <div className="mt-6 grid gap-3">
              {games[activeGame].options.map((answer) => (
                <button
                  key={answer}
                  onClick={() => {
                    setGameAnswer(answer)
                    setGameResult("")
                  }}
                  className={`rounded-2xl border-2 px-4 py-4 text-sm font-black transition ${
                    gameAnswer === answer
                      ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700"
                      : "border-slate-200 text-slate-600 hover:border-violet-300"
                  }`}
                >
                  {answer}
                </button>
              ))}
            </div>
            {gameResult && (
              <div
                className={`mt-4 rounded-2xl p-3 text-sm font-black ${
                  gameResult === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {gameResult === "success"
                  ? "Bonne réponse ! Ton raisonnement est correct."
                  : "Pas encore. Cherche un autre chemin, tu peux réessayer."}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveGame(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-500"
              >
                Plus tard
              </button>
              <button
                disabled={!gameAnswer}
                onClick={() => {
                  if (gameAnswer === games[activeGame].correct) {
                    setGameResult("success")
                    setStars((current) => current + 10)
                    setCampaignXp((current) => current + 15)
                    setGameStats((current) => ({
                      ...current,
                      quizWins: current.quizWins + 1,
                    }))
                    window.setTimeout(() => {
                      setActiveGame(null)
                      notify("Défi réussi : 10 étoiles gagnées !")
                    }, 700)
                  } else {
                    setGameResult("retry")
                  }
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                <Check size={17} /> Valider ma réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function ChildInterface({
  active,
  isDashboard,
  setActive,
}: {
  active: string
  isDashboard: boolean
  setActive: (label: string) => void
}) {
  return isDashboard ? (
    <PlayfulChildDashboard setActive={setActive} />
  ) : (
    <ChildSectionPage key={active} title={active} />
  )
}
