import { useState } from "react"
import {
  Accessibility,
  ArrowDown,
  ArrowUp,
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
  Eye,
  FileText,
  Flame,
  Gamepad2,
  Heart,
  LayoutGrid,
  Lightbulb,
  MessageCircle,
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
  Sparkles,
  Star,
  Smile,
  Target,
  Trash2,
  Trophy,
  Users,
  Volume2,
  WandSparkles,
  Wifi,
  Zap,
} from "lucide-react"

import FeatureWorkspace from "./RoleWorkspace"
import { usePersistentState } from "../lib/persistence"
import { useI18n } from "../lib/i18n"
import {
  curriculumSubjects,
  getCompetencies,
  getLearningPack,
  markPackInstitutional,
  type CurriculumSubject,
  type LearningPack,
  type SchoolLevel,
} from "../data/curriculum"

function TeacherDashboard({
  setActive,
}: {
  setActive: (label: string) => void
}) {
  const pupils = [
    {
      name: "Léo Martin",
      initials: "LM",
      task: "Fractions",
      level: "À accompagner",
      score: "64%",
      tone: "bg-amber-100 text-amber-700",
    },
    {
      name: "Inès Robert",
      initials: "IR",
      task: "Accord du participe",
      level: "En progression",
      score: "76%",
      tone: "bg-violet-100 text-violet-700",
    },
    {
      name: "Noah Petit",
      initials: "NP",
      task: "Cycle de l’eau",
      level: "Maîtrisé",
      score: "91%",
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Jade Dubois",
      initials: "JD",
      task: "Lecture fluide",
      level: "À renforcer",
      score: "58%",
      tone: "bg-rose-100 text-rose-700",
    },
  ]
  return (
    <main className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-bold text-indigo-600">
            Classe de CE2 B · 26 élèves
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            Bonjour Mme Leroy
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            4 élèves nécessitent votre attention aujourd’hui.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActive("Progressions")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-600"
          >
            <FileText size={17} /> Exporter
          </button>
          <button
            onClick={() => setActive("Activités")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200"
          >
            <Plus size={17} /> Créer une activité
          </button>
        </div>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        <article className="overflow-hidden rounded-2xl bg-indigo-600 p-5 text-white shadow-lg shadow-indigo-100">
          <div className="flex items-start justify-between">
            <div className="grid size-10 place-items-center rounded-xl bg-white/15">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-100">
              Aujourd’hui
            </span>
          </div>
          <div className="mt-6 font-display text-3xl font-extrabold">
            21 / 26
          </div>
          <p className="mt-1 text-sm font-bold text-indigo-100">
            Élèves actifs
          </p>
        </article>
        {[
          {
            icon: Check,
            value: "84%",
            label: "Missions terminées",
            note: "+7% vs semaine dernière",
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            icon: WandSparkles,
            value: "12",
            label: "Adaptations personnalisées",
            note: "5 profils DYS · 3 TDAH",
            color: "bg-amber-50 text-amber-600",
          },
        ].map(({ icon: Icon, value, label, note, color }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div
              className={`grid size-10 place-items-center rounded-xl ${color}`}
            >
              <Icon size={19} />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold text-slate-900">
              {value}
            </div>
            <p className="mt-1 text-sm font-extrabold text-slate-700">
              {label}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-400">{note}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                Élèves à accompagner
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Priorisés selon les résultats récents
              </p>
            </div>
            <button
              onClick={() => setActive("Ma classe")}
              className="text-sm font-extrabold text-indigo-600"
            >
              Voir la classe
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {pupils.map((pupil) => (
              <div
                key={pupil.name}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
              >
                <div
                  className={`grid size-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${pupil.tone}`}
                >
                  {pupil.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-slate-800">
                    {pupil.name}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                    {pupil.task}
                  </div>
                </div>
                <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:block">
                  {pupil.level}
                </span>
                <span className="w-10 text-right text-sm font-extrabold text-slate-700">
                  {pupil.score}
                </span>
                <button className="text-slate-400">
                  <MoreHorizontal size={19} />
                </button>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="font-display font-extrabold text-slate-900">
              Prochaines séances
            </h2>
            <div className="mt-4 space-y-3">
              {[
                ["09:00", "Atelier lecture", "Groupe violet"],
                ["10:30", "Défi fractions", "Classe entière"],
                ["14:00", "Sciences avec Popy", "Groupe bleu"],
              ].map(([time, title, group], i) => (
                <div
                  key={time}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div
                    className={`h-10 w-1 rounded-full ${
                      i === 0
                        ? "bg-violet-500"
                        : i === 1
                          ? "bg-amber-500"
                          : "bg-cyan-500"
                    }`}
                  />
                  <div className="w-11 text-xs font-extrabold text-slate-500">
                    {time}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-slate-700">
                      {title}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {group}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
              <Zap size={18} fill="currentColor" /> Suggestion pédagogique
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-emerald-900/70">
              Le groupe violet est prêt pour une activité de fluence avec
              guidage audio.
            </p>
            <button
              onClick={() => setActive("Activités")}
              className="mt-4 text-xs font-extrabold text-emerald-700"
            >
              Préparer l’activité →
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

function TeacherAdvancedPage({ title }: { title: string }) {
  const { t } = useI18n()
  const [level, setLevel] = useState("CE2")
  const [subject, setSubject] = useState("Mathématiques")
  const [theme, setTheme] = useState("")
  const [generated, setGenerated] = useState("")
  const [robotOnline, setRobotOnline] = useState(true)
  const [cameraActive, setCameraActive] = useState(true)
  const [activityTitle, setActivityTitle] = usePersistentState(
    "teacher-editor-title",
    "Comprendre les fractions simples",
  )
  const [targetGroup, setTargetGroup] = useState("Classe entière")
  const [competency, setCompetency] = useState("")
  const [selectedPack, setSelectedPack] = useState<LearningPack | null>(null)
  const [preview, setPreview] = useState(false)
  const [publishStatus, setPublishStatus] = useState("Brouillon enregistré")
  const [activityBlocks, setActivityBlocks] = usePersistentState<Array<{
    id: number
    type: "text" | "question" | "audio" | "hint"
    content: string
  }>>("teacher-editor-blocks", [
    {
      id: 1,
      type: "text",
      content:
        "Une fraction représente une ou plusieurs parts égales d’un tout.",
    },
    {
      id: 2,
      type: "question",
      content: "Quelle fraction représente une moitié ?",
    },
    {
      id: 3,
      type: "hint",
      content: "Imagine une pizza partagée entre deux enfants.",
    },
  ])
  const [rubric, setRubric] = usePersistentState(
    "teacher-editor-rubric",
    {
      mastered: "Réponse exacte et justifiée",
      progressing: "Réponse partielle ou peu justifiée",
      support: "Réponse incorrecte ou absente",
    },
  )
  const [answerKey, setAnswerKey] = usePersistentState(
    "teacher-editor-answer-key",
    "1/2 ou une moitié",
  )
  const [editorVersions, setEditorVersions] = usePersistentState<
    Array<{ id: number; savedAt: string; title: string; blocks: number }>
  >("teacher-editor-versions", [])
  const activityTemplates = [
    {
      name: "Quiz court",
      blocks: [
        {
          id: 1,
          type: "text" as const,
          content: "Lis la question puis choisis la bonne réponse.",
        },
        {
          id: 2,
          type: "question" as const,
          content: "Quelle est la bonne réponse ?",
        },
        {
          id: 3,
          type: "hint" as const,
          content: "Élimine d’abord les réponses impossibles.",
        },
      ],
    },
    {
      name: "Fiche leçon",
      blocks: [
        {
          id: 1,
          type: "text" as const,
          content: "Objectif : comprendre la notion du jour.",
        },
        {
          id: 2,
          type: "audio" as const,
          content: "Popy lit la leçon à voix haute.",
        },
        {
          id: 3,
          type: "question" as const,
          content: "Explique la notion avec tes mots.",
        },
      ],
    },
  ]

  const moveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= activityBlocks.length) return
    const next = [...activityBlocks]
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    setActivityBlocks(next)
  }

  if (title === "Éditeur d’activités") {
    const addBlock = (blockType: "text" | "question" | "audio" | "hint") => {
      const defaults = {
        text: "Nouveau contenu pédagogique",
        question: "Écrivez la question ici",
        audio: "Texte qui sera lu par Popy",
        hint: "Indice progressif",
      }
      setActivityBlocks([
        ...activityBlocks,
        {
          id: Date.now(),
          type: blockType,
          content: defaults[blockType],
        },
      ])
    }

    return (
      <main className="mx-auto max-w-[1600px] p-5 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-extrabold text-indigo-600">
              Studio pédagogique
            </span>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
              Éditeur d’activités
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Composez une activité, adaptez-la puis prévisualisez l’expérience
              enfant.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-600"
            >
              <Eye size={17} /> {preview ? "Modifier" : "Prévisualiser"}
            </button>
            <button
              onClick={() => setPublishStatus("Activité publiée à la classe")}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200"
            >
              Publier
            </button>
          </div>
        </div>

        {!preview ? (
          <div className="mt-7 grid gap-6 xl:grid-cols-[240px_1fr_300px]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Ajouter un bloc
              </p>
              <div className="mt-4 space-y-2">
                {[
                  ["text", "Texte ou leçon", FileText],
                  ["question", "Question", Target],
                  ["audio", "Lecture audio", Volume2],
                  ["hint", "Indice progressif", Lightbulb],
                ].map(([blockType, label, Icon]) => {
                  const BlockIcon = Icon as typeof FileText
                  return (
                    <button
                      key={blockType as string}
                      onClick={() =>
                        addBlock(
                          blockType as "text" | "question" | "audio" | "hint",
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left text-xs font-extrabold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <BlockIcon size={17} />
                      {label as string}
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 rounded-xl bg-amber-50 p-3 text-[11px] font-semibold leading-relaxed text-amber-900">
                Chaque bloc pourra recevoir une adaptation DYS, un niveau de
                difficulté et une lecture audio.
              </div>
            </aside>

            <section>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label className="text-xs font-extrabold text-slate-600">
                  Titre de l’activité
                  <input
                    value={activityTitle}
                    onChange={(event) => setActivityTitle(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-display text-lg font-extrabold outline-none focus:border-indigo-300"
                  />
                </label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-extrabold text-slate-600">
                    Niveau
                    <select
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
                    >
                      {["CP", "CE1", "CE2", "CM1", "CM2"].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-extrabold text-slate-600">
                    Affectation
                    <select
                      value={targetGroup}
                      onChange={(event) => setTargetGroup(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
                    >
                      <option>Classe entière</option>
                      <option>Groupe violet</option>
                      <option>Groupe bleu</option>
                      <option>Léo Martin</option>
                    </select>
                  </label>
                </div>
                <label className="mt-4 block text-xs font-extrabold text-slate-600">
                  Compétence du programme
                  <select
                    value={competency}
                    onChange={(event) => {
                      const nextId = event.target.value
                      setCompetency(nextId)
                      const pack = nextId ? getLearningPack(nextId) : null
                      setSelectedPack(pack ?? null)
                      if (pack) {
                        setActivityTitle(pack.title)
                        setAnswerKey(pack.correction)
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
                  >
                    <option value="">Sélectionner une compétence</option>
                    {getCompetencies(
                      level as SchoolLevel,
                      (curriculumSubjects.includes(subject as CurriculumSubject)
                        ? subject
                        : "Mathématiques") as CurriculumSubject,
                    ).map((item) => (
                      <option key={item.id} value={item.id}>
                        {t(item.label)}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedPack && (
                  <div className="mt-4 rounded-2xl bg-indigo-50 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                      {t("Banque pédagogique")} · {selectedPack.validationStatus}
                    </p>
                    <p className="mt-2 text-xs font-bold leading-relaxed text-indigo-950">
                      {selectedPack.lesson}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-indigo-800/80">
                      {selectedPack.exercise}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-indigo-800/80">
                      {selectedPack.evaluation}
                    </p>
                    <button
                      onClick={() => {
                        const validated = markPackInstitutional(selectedPack)
                        setSelectedPack(validated)
                        setPublishStatus("Pack marqué comme validé institutionnellement")
                      }}
                      className="mt-3 rounded-xl bg-indigo-600 px-3 py-2 text-[10px] font-extrabold text-white"
                    >
                      {t("Valider institutionnellement")}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {activityBlocks.map((block, index) => (
                  <article
                    key={block.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-indigo-700">
                        {block.type}
                      </span>
                      <span className="flex-1 text-[10px] font-bold text-slate-400">
                        Bloc {index + 1}
                      </span>
                      <button
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="text-slate-400 disabled:opacity-20"
                      >
                        <ArrowUp size={17} />
                      </button>
                      <button
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === activityBlocks.length - 1}
                        className="text-slate-400 disabled:opacity-20"
                      >
                        <ArrowDown size={17} />
                      </button>
                      <button
                        onClick={() =>
                          setActivityBlocks(
                            activityBlocks.filter(
                              (item) => item.id !== block.id,
                            ),
                          )
                        }
                        className="text-rose-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(event) =>
                        setActivityBlocks(
                          activityBlocks.map((item) =>
                            item.id === block.id
                              ? { ...item, content: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="mt-3 min-h-20 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit space-y-4">
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-300">
                  Publication
                </p>
                <h2 className="mt-2 font-display text-lg font-extrabold">
                  {publishStatus}
                </h2>
                <div className="mt-4 space-y-2 text-xs font-semibold text-slate-300">
                  <p>{activityBlocks.length} blocs</p>
                  <p>Niveau {level}</p>
                  <p>{targetGroup}</p>
                  <p>Sauvegarde locale automatique</p>
                </div>
                <button
                  onClick={() => {
                    setEditorVersions(
                      [
                        {
                          id: Date.now(),
                          savedAt: new Date().toISOString(),
                          title: activityTitle,
                          blocks: activityBlocks.length,
                        },
                        ...editorVersions,
                      ].slice(0, 8),
                    )
                    setPublishStatus("Version enregistrée localement")
                  }}
                  className="mt-4 w-full rounded-xl bg-white/10 py-2.5 text-xs font-extrabold"
                >
                  Créer une version
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-extrabold text-slate-800">Modèles</h3>
                <div className="mt-3 space-y-2">
                  {activityTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => {
                        setActivityBlocks(
                          template.blocks.map((block, index) => ({
                            ...block,
                            id: Date.now() + index,
                          })),
                        )
                        setActivityTitle(`${template.name} · ${subject}`)
                        setPublishStatus(`Modèle « ${template.name} » appliqué`)
                      }}
                      className="w-full rounded-xl bg-indigo-50 px-3 py-2 text-left text-xs font-extrabold text-indigo-700"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-extrabold text-slate-800">Barème</h3>
                <div className="mt-3 space-y-2">
                  {(
                    [
                      ["mastered", "Maîtrisé"],
                      ["progressing", "En cours"],
                      ["support", "À soutenir"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="block text-[10px] font-extrabold uppercase tracking-wide text-slate-400"
                    >
                      {label}
                      <input
                        value={rubric[key]}
                        onChange={(event) =>
                          setRubric({ ...rubric, [key]: event.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-extrabold text-slate-800">Correction</h3>
                <textarea
                  value={answerKey}
                  onChange={(event) => setAnswerKey(event.target.value)}
                  className="mt-3 min-h-20 w-full resize-none rounded-xl bg-slate-50 p-3 text-xs font-semibold outline-none"
                  placeholder="Réponse attendue et critères…"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-extrabold text-slate-800">
                  Versions ({editorVersions.length})
                </h3>
                <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
                  {editorVersions.length ? (
                    editorVersions.map((version) => (
                      <div
                        key={version.id}
                        className="rounded-xl bg-slate-50 p-3 text-[10px] font-bold text-slate-500"
                      >
                        <div className="font-extrabold text-slate-700">
                          {version.title}
                        </div>
                        <div>
                          {version.blocks} blocs ·{" "}
                          {new Date(version.savedAt).toLocaleString("fr-FR")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-semibold text-slate-400">
                      Aucune version enregistrée.
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-extrabold text-slate-800">
                  Adaptations automatiques
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Lecture audio",
                    "Police adaptée",
                    "Indices",
                    "Mode calme",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <section className="mx-auto mt-8 max-w-3xl rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-600 p-5 shadow-2xl md:p-8">
            <div className="rounded-[26px] bg-white p-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Aperçu enfant · {level}
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                {activityTitle}
              </h2>
              <div className="mt-6 space-y-4">
                {activityBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`rounded-2xl p-4 ${
                      block.type === "question"
                        ? "bg-indigo-50"
                        : block.type === "hint"
                          ? "bg-amber-50"
                          : "bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-bold leading-relaxed text-slate-700">
                      {block.content}
                    </p>
                    {block.type === "audio" && (
                      <button className="mt-3 flex items-center gap-2 text-xs font-extrabold text-indigo-600">
                        <Volume2 size={15} /> Écouter
                      </button>
                    )}
                    {block.type === "question" && (
                      <input
                        className="mt-3 w-full rounded-xl border border-indigo-200 bg-white p-3 text-sm outline-none"
                        placeholder="Réponse de l’enfant..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    )
  }

  if (title === "Générateur IA") {
    return (
      <main className="mx-auto max-w-[1500px] p-5 md:p-8">
        <span className="text-sm font-extrabold text-indigo-600">
          Création pédagogique locale
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          Générateur de contenu IA
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
          Préparez une activité différenciée et alignée sur les programmes
          officiels. La proposition reste modifiable avant publication.
        </p>
        <div className="mt-7 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              Paramètres
            </h2>
            <label className="mt-5 block text-xs font-extrabold text-slate-600">
              Niveau
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
              >
                {["CP", "CE1", "CE2", "CM1", "CM2"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-xs font-extrabold text-slate-600">
              Matière
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
              >
                {[
                  "Mathématiques",
                  "Français",
                  "Histoire",
                  "Géographie",
                  "Sciences",
                  "Technologie",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-xs font-extrabold text-slate-600">
              Thème ou compétence
              <input
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-indigo-300"
                placeholder="Les fractions simples..."
              />
            </label>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setGenerated(
                    `Quiz ${level} en ${subject} : 5 questions progressives sur ${theme || "la compétence sélectionnée"}, avec lecture audio et deux niveaux d’indices.`,
                  )
                }
                className="rounded-xl bg-indigo-50 py-3 text-xs font-extrabold text-indigo-700"
              >
                Générer un quiz
              </button>
              <button
                onClick={() =>
                  setGenerated(
                    `Fiche ${level} en ${subject} : objectif, notion clé, exemple visuel et exercice différencié sur ${theme || "la compétence sélectionnée"}.`,
                  )
                }
                className="rounded-xl bg-violet-50 py-3 text-xs font-extrabold text-violet-700"
              >
                Générer une fiche
              </button>
            </div>
          </section>
          <section className="rounded-2xl bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-300">
                  Aperçu généré
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold">
                  Activité pédagogique
                </h2>
              </div>
              <WandSparkles size={25} className="text-violet-300" />
            </div>
            <div className="mt-6 min-h-64 rounded-2xl bg-white/10 p-5">
              {generated ? (
                <>
                  <p className="text-sm font-semibold leading-relaxed text-slate-200">
                    {generated}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Mode DYS",
                      "Consigne audio",
                      "Niveau 1",
                      "Popy compatible",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold text-violet-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-400">
                  Sélectionnez les paramètres puis générez un quiz ou une fiche.
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="rounded-xl bg-white/10 px-4 py-3 text-xs font-extrabold">
                Modifier
              </button>
              <button
                disabled={!generated}
                className="rounded-xl bg-violet-500 px-5 py-3 text-xs font-extrabold disabled:opacity-40"
              >
                Publier à la classe
              </button>
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (title === "Assistant pédagogique") {
    return (
      <main className="mx-auto max-w-[1500px] p-5 md:p-8">
        <span className="text-sm font-extrabold text-indigo-600">
          Analyse de classe
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          Assistant pédagogique
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-400">
          Des suggestions explicables, toujours validées par l’enseignant.
        </p>
        <section className="mt-7 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Groupe violet",
              issue: "La fluence ralentit après 8 minutes.",
              action: "Proposer deux lectures de 5 minutes avec guidage audio.",
              tone: "bg-violet-50 text-violet-800",
            },
            {
              title: "Léo Martin",
              issue: "Les fractions sont comprises avec support visuel.",
              action:
                "Maintenir les représentations en parts avant la notation.",
              tone: "bg-amber-50 text-amber-800",
            },
            {
              title: "Jade Dubois",
              issue: "La saisie manuscrite masque les acquis.",
              action: "Autoriser la réponse vocale et la saisie numérique.",
              tone: "bg-emerald-50 text-emerald-800",
            },
          ].map((suggestion) => (
            <article
              key={suggestion.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${suggestion.tone}`}
              >
                Suggestion ciblée
              </div>
              <h2 className="mt-4 font-display text-lg font-extrabold text-slate-900">
                {suggestion.title}
              </h2>
              <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500">
                {suggestion.issue}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs font-bold leading-relaxed text-slate-700">
                {suggestion.action}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white">
                <Check size={15} /> Préparer cette adaptation
              </button>
            </article>
          ))}
        </section>
        <section className="mt-6 rounded-2xl bg-indigo-50 p-5">
          <div className="flex items-start gap-3">
            <Lightbulb size={21} className="shrink-0 text-indigo-600" />
            <p className="text-sm font-semibold leading-relaxed text-indigo-900">
              Les recommandations sont produites à partir des activités
              pédagogiques, jamais à partir d’un diagnostic automatique. Elles
              ne remplacent pas l’observation professionnelle.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1500px] p-5 md:p-8">
      <span className="text-sm font-extrabold text-indigo-600">
        Équipement de la classe
      </span>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
        Robot en classe (optionnel)
      </h1>
      <p className="mt-2 text-sm font-semibold text-slate-400">
        Supervision locale de Popy, des capteurs et des profils actifs.
      </p>
      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Batterie", "73% · 3h30 restantes", Zap],
          ["Réseau", "Wi-Fi 94% · excellent", Wifi],
          ["Température", "32 °C · normale", Flame],
          ["Distance", "Obstacle à 0,8 m", Target],
        ].map(([label, value, Icon]) => {
          const StatusIcon = Icon as typeof Zap
          return (
            <article
              key={label as string}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <StatusIcon size={21} className="text-indigo-600" />
              <div className="mt-4 text-sm font-extrabold text-slate-800">
                {label as string}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-400">
                {value as string}
              </div>
            </article>
          )
        })}
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            Capteurs en temps réel
          </h2>
          <div className="mt-4 space-y-3">
            {[
              [
                "Caméra 1080p",
                cameraActive,
                () => setCameraActive(!cameraActive),
              ],
              ["Microphones directionnels", true, () => undefined],
              ["Anti-chute", true, () => undefined],
              ["Évitement d’obstacles", true, () => undefined],
            ].map(([label, activeState, action]) => (
              <button
                key={label as string}
                onClick={action as () => void}
                className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <span className="text-sm font-bold text-slate-700">
                  {label as string}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                    activeState
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {activeState ? "Actif" : "Désactivé"}
                </span>
              </button>
            ))}
          </div>
        </section>
        <aside className="rounded-2xl bg-slate-900 p-5 text-white">
          <Bot size={28} className="text-violet-300" />
          <h2 className="mt-4 font-display text-xl font-extrabold">
            {robotOnline ? "Popy est prêt" : "Popy est en pause"}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-300">
            Les profils de la classe restent disponibles hors ligne. Aucune
            donnée pédagogique n’est envoyée vers le cloud.
          </p>
          <button
            onClick={() => setRobotOnline(!robotOnline)}
            className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-extrabold ${
              robotOnline
                ? "bg-amber-400 text-amber-950"
                : "bg-emerald-500 text-white"
            }`}
          >
            {robotOnline ? "Mettre Popy en pause" : "Réactiver Popy"}
          </button>
        </aside>
      </div>
    </main>
  )
}

export default function TeacherInterface({
  active,
  isDashboard,
  setActive,
}: {
  active: string
  isDashboard: boolean
  setActive: (label: string) => void
}) {
  return isDashboard ? (
    <TeacherDashboard setActive={setActive} />
  ) : [
      "Éditeur d’activités",
      "Générateur IA",
      "Assistant pédagogique",
      "Robot en classe (optionnel)",
    ].includes(active) ? (
    <TeacherAdvancedPage key={active} title={active} />
  ) : (
    <FeatureWorkspace key={active} title={active} role="Enseignant" />
  )
}
