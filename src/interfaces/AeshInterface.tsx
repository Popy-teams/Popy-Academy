import { useState } from "react"
import {
  Accessibility,
  Bell,
  BookOpen,
  Brain,
  Check,
  Clock3,
  Heart,
  MessageCircle,
  NotebookPen,
  Plus,
  Send,
  Sparkles,
  Target,
  Users,
  Volume2,
} from "lucide-react"

import { usePersistentState } from "../lib/persistence"

type AeshProps = {
  active: string
  isDashboard: boolean
  setActive: (label: string) => void
}

const pupils = [
  {
    name: "Léo Martin",
    initials: "LM",
    className: "CE2 B",
    need: "Consignes courtes · Lecture audio",
    state: "Disponible",
    tone: "bg-amber-100 text-amber-700",
  },
  {
    name: "Jade Dubois",
    initials: "JD",
    className: "CE2 B",
    need: "Saisie numérique · Repères visuels",
    state: "En activité",
    tone: "bg-violet-100 text-violet-700",
  },
  {
    name: "Noah Petit",
    initials: "NP",
    className: "CE1 A",
    need: "Routine visuelle · Transition",
    state: "Pause",
    tone: "bg-cyan-100 text-cyan-700",
  },
]

export default function AeshInterface({ active, setActive }: AeshProps) {
  const [observations, setObservations] = usePersistentState<string[]>(
    "aesh-observations",
    [
      "Léo · La représentation visuelle a permis de reprendre l’exercice.",
      "Jade · La réponse vocale a réduit la fatigue d’écriture.",
    ],
  )
  const [draft, setDraft] = useState("")
  const [selectedPupil, setSelectedPupil] = useState("Léo Martin")
  const [feedback, setFeedback] = useState("")

  const notify = (text: string) => {
    setFeedback(text)
    window.setTimeout(() => setFeedback(""), 2400)
  }

  if (active === "Mon accompagnement") {
    return (
      <PageShell
        eyebrow="Aujourd’hui · CE2 B"
        title="Bonjour Alex"
        description="Les informations essentielles pour accompagner sans surcharger."
        feedback={feedback}
      >
        <section className="grid gap-5 md:grid-cols-3">
          {[
            ["3", "Élèves accompagnés", Users, "bg-indigo-50 text-indigo-600"],
            [
              "5",
              "Adaptations actives",
              Accessibility,
              "bg-emerald-50 text-emerald-600",
            ],
            [
              "1",
              "Transmission à faire",
              MessageCircle,
              "bg-amber-50 text-amber-600",
            ],
          ].map(([value, label, Icon, tone]) => {
            const CardIcon = Icon as typeof Users
            return (
              <article
                key={label as string}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`grid size-10 place-items-center rounded-xl ${tone}`}
                >
                  <CardIcon size={19} />
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-slate-900">
                  {value as string}
                </div>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {label as string}
                </p>
              </article>
            )
          })}
        </section>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                Déroulé de la matinée
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                [
                  "09:00",
                  "Lecture guidée avec Léo",
                  "Consigne audio puis lecture alternée",
                ],
                [
                  "10:15",
                  "Mathématiques avec Jade",
                  "Autoriser la réponse numérique",
                ],
                [
                  "11:00",
                  "Transition de Noah",
                  "Présenter la routine visuelle",
                ],
              ].map(([time, title, detail], index) => (
                <button
                  key={time}
                  onClick={() => notify("Étape marquée comme réalisée.")}
                  className="flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50"
                >
                  <span className="text-xs font-extrabold text-indigo-600">
                    {time}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-extrabold text-slate-800">
                      {title}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {detail}
                    </span>
                  </span>
                  <Check
                    size={17}
                    className={
                      index === 0 ? "text-emerald-500" : "text-slate-300"
                    }
                  />
                </button>
              ))}
            </div>
          </section>
          <aside className="rounded-2xl bg-slate-900 p-5 text-white">
            <Brain size={24} className="text-violet-300" />
            <h2 className="mt-4 font-display text-xl font-extrabold">
              Repère utile
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-300">
              Léo reste engagé plus longtemps lorsque la consigne ne contient
              qu’une seule action visible.
            </p>
            <button
              onClick={() => setActive("Stratégies utiles")}
              className="mt-6 text-xs font-extrabold text-violet-300"
            >
              Voir toutes les stratégies →
            </button>
          </aside>
        </div>
      </PageShell>
    )
  }

  if (active === "Élèves suivis") {
    return (
      <PageShell
        eyebrow="Accès limité"
        title="Élèves suivis"
        description="Seules les données nécessaires à l’accompagnement sont affichées."
        feedback={feedback}
      >
        <section className="grid gap-5 lg:grid-cols-3">
          {pupils.map((pupil) => (
            <article
              key={pupil.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid size-12 place-items-center rounded-xl text-xs font-extrabold ${pupil.tone}`}
                >
                  {pupil.initials}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
                  {pupil.state}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-extrabold text-slate-900">
                {pupil.name}
              </h2>
              <p className="text-xs font-bold text-indigo-600">
                {pupil.className}
              </p>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-500">
                {pupil.need}
              </p>
              <button
                onClick={() => {
                  setSelectedPupil(pupil.name)
                  setActive("Adaptations du jour")
                }}
                className="mt-5 w-full rounded-xl bg-indigo-50 py-3 text-xs font-extrabold text-indigo-700"
              >
                Ouvrir l’accompagnement
              </button>
            </article>
          ))}
        </section>
      </PageShell>
    )
  }

  if (active === "Adaptations du jour") {
    return (
      <PageShell
        eyebrow={selectedPupil}
        title="Adaptations du jour"
        description="Des actions rapides, observables et réévaluables."
        feedback={feedback}
      >
        <section className="grid gap-5 md:grid-cols-2">
          {[
            [
              "Consigne en une étape",
              "Ne montrer que l’action en cours.",
              Target,
            ],
            [
              "Lecture audio",
              "Proposer l’écoute avant la lecture autonome.",
              Volume2,
            ],
            [
              "Temps fractionné",
              "10 minutes de travail puis une pause.",
              Clock3,
            ],
            [
              "Réponse alternative",
              "Autoriser la voix ou le clavier.",
              Accessibility,
            ],
          ].map(([title, detail, Icon]) => {
            const AdaptIcon = Icon as typeof Target
            return (
              <button
                key={title as string}
                onClick={() => notify(`${title as string} appliquée.`)}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-indigo-300"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <AdaptIcon size={20} />
                </span>
                <span>
                  <span className="block font-display font-extrabold text-slate-800">
                    {title as string}
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-relaxed text-slate-500">
                    {detail as string}
                  </span>
                  <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                    Marquer comme appliquée
                  </span>
                </span>
              </button>
            )
          })}
        </section>
      </PageShell>
    )
  }

  if (active === "Observations") {
    return (
      <PageShell
        eyebrow="Notes professionnelles"
        title="Observations rapides"
        description="Décrivez un fait observable sans diagnostic ni jugement."
        feedback={feedback}
      >
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="text-xs font-extrabold text-slate-600">
              Élève
              <select
                value={selectedPupil}
                onChange={(event) => setSelectedPupil(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"
              >
                {pupils.map((pupil) => (
                  <option key={pupil.name}>{pupil.name}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-xs font-extrabold text-slate-600">
              Observation factuelle
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="mt-2 min-h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-indigo-300"
                placeholder="Pendant la lecture, l’élève a..."
              />
            </label>
            <button
              disabled={!draft.trim()}
              onClick={() => {
                setObservations([
                  `${selectedPupil} · ${draft}`,
                  ...observations,
                ])
                setDraft("")
                notify("Observation enregistrée localement.")
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-extrabold text-white disabled:opacity-40"
            >
              <Plus size={17} /> Enregistrer
            </button>
          </section>
          <section className="space-y-3">
            {observations.map((observation, index) => (
              <article
                key={`${observation}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="text-sm font-semibold leading-relaxed text-slate-600">
                  {observation}
                </p>
                <span className="mt-3 block text-[10px] font-extrabold text-slate-400">
                  {index === 0 ? "À l’instant" : "Cette semaine"}
                </span>
              </article>
            ))}
          </section>
        </div>
      </PageShell>
    )
  }

  if (active === "Stratégies utiles") {
    return (
      <PageShell
        eyebrow="Boîte à outils"
        title="Stratégies qui fonctionnent"
        description="Retrouvez les approches validées par l’équipe éducative."
        feedback={feedback}
      >
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "Avant de commencer",
              "Faire reformuler la consigne avec ses propres mots.",
            ],
            [
              "Pendant l’activité",
              "Masquer les exercices qui ne sont pas encore travaillés.",
            ],
            [
              "En cas de blocage",
              "Proposer deux choix plutôt qu’une question ouverte.",
            ],
            [
              "Pour se recentrer",
              "Utiliser une respiration lente pendant une minute.",
            ],
            [
              "Pour écrire",
              "Autoriser la dictée vocale avant la copie finale.",
            ],
            [
              "Pour valoriser",
              "Nommer la stratégie utilisée, pas seulement le résultat.",
            ],
          ].map(([title, detail]) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <Sparkles size={20} className="text-indigo-500" />
              <h2 className="mt-4 font-display font-extrabold text-slate-800">
                {title}
              </h2>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
                {detail}
              </p>
            </article>
          ))}
        </section>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Lien avec l’équipe"
      title="Transmissions"
      description="Partagez uniquement les informations utiles au suivi pédagogique."
      feedback={feedback}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            Nouvelle transmission
          </h2>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="mt-4 min-h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-indigo-300"
            placeholder="Fait observé, adaptation utilisée et résultat..."
          />
          <button
            disabled={!draft.trim()}
            onClick={() => {
              setDraft("")
              notify("Transmission préparée pour l’enseignante.")
            }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-40"
          >
            <Send size={17} /> Préparer l’envoi
          </button>
        </section>
        <aside className="rounded-2xl bg-amber-50 p-5">
          <Bell size={22} className="text-amber-600" />
          <h2 className="mt-4 font-display font-extrabold text-amber-950">
            Respect de la confidentialité
          </h2>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-900/70">
            N’ajoutez aucune information médicale non nécessaire. Les
            transmissions doivent rester factuelles et pédagogiques.
          </p>
        </aside>
      </div>
    </PageShell>
  )
}

function PageShell({
  eyebrow,
  title,
  description,
  feedback,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  feedback: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-xl">
          <Check size={16} className="text-emerald-400" />
          {feedback}
        </div>
      )}
      <span className="text-sm font-extrabold text-indigo-600">{eyebrow}</span>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
        {description}
      </p>
      <div className="mt-7">{children}</div>
    </main>
  )
}
