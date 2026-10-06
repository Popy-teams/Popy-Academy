import { useState } from "react"
import { Bot, Check, ChevronRight, Plus, Sparkles, Target } from "lucide-react"

type Role = "Parent" | "Enseignant"
type IconType = typeof Target

const workspaceContent: Record<string, {
  eyebrow: string
  description: string
  action: string
  items: { title: string detail: string tag: string }[]
}> = {
  "Mes missions": {
    eyebrow: "Programme personnalisé",
    description:
      "Toutes les activités prévues, classées par priorité et adaptées à ton rythme.",
    action: "Ajouter une mission",
    items: [
      {
        title: "Le secret des fractions",
        detail: "Mathématiques · 15 min · Recommandé par Popy",
        tag: "Aujourd’hui",
      },
      {
        title: "Les mots invariables",
        detail: "Français · 10 min · Consigne audio disponible",
        tag: "À faire",
      },
      {
        title: "Le cycle de l’eau",
        detail: "Sciences · 12 min · Expérience guidée",
        tag: "Cette semaine",
      },
    ],
  },
  Bibliothèque: {
    eyebrow: "Ressources pédagogiques",
    description:
      "Des histoires, vidéos et exercices alignés sur le programme de CE2.",
    action: "Ajouter aux favoris",
    items: [
      {
        title: "La cabane aux mille mots",
        detail: "Lecture interactive · Niveau CE2",
        tag: "Histoire",
      },
      {
        title: "Calcul mental avec Popy",
        detail: "Série de 10 défis progressifs",
        tag: "Jeu",
      },
      {
        title: "Explorer le système solaire",
        detail: "Vidéo sous-titrée · 8 minutes",
        tag: "Vidéo",
      },
    ],
  },
  "Mes progrès": {
    eyebrow: "Suivi personnel",
    description:
      "Visualise les compétences acquises et les prochains petits objectifs.",
    action: "Télécharger mon bilan",
    items: [
      {
        title: "Lire avec fluidité",
        detail: "8 compétences validées sur 10",
        tag: "80%",
      },
      {
        title: "Calculer et raisonner",
        detail: "6 compétences validées sur 10",
        tag: "60%",
      },
      {
        title: "Questionner le monde",
        detail: "9 compétences validées sur 10",
        tag: "90%",
      },
    ],
  },
  "Mes récompenses": {
    eyebrow: "Motivation positive",
    description:
      "Les badges célèbrent tes efforts, ta régularité et tes progrès.",
    action: "Choisir un nouvel objectif",
    items: [
      {
        title: "Explorateur des nombres",
        detail: "12 activités de mathématiques terminées",
        tag: "Obtenu",
      },
      {
        title: "Super lecteur",
        detail: "Lire 5 jours de suite",
        tag: "4 / 5",
      },
      {
        title: "Champion de l’effort",
        detail: "Terminer une mission difficile",
        tag: "Obtenu",
      },
    ],
  },
  "Suivi de Léo": {
    eyebrow: "Bilan détaillé",
    description:
      "Analyse des progrès, du rythme et des points de vigilance de Léo.",
    action: "Générer un bilan",
    items: [
      {
        title: "Français",
        detail: "Lecture en progrès · Orthographe à consolider",
        tag: "78%",
      },
      {
        title: "Mathématiques",
        detail: "Calcul acquis · Fractions à accompagner",
        tag: "64%",
      },
      {
        title: "Autonomie",
        detail: "Démarre seul 4 activités sur 5",
        tag: "Très bien",
      },
    ],
  },
  "Plan de travail": {
    eyebrow: "Organisation familiale",
    description:
      "Planifie des temps courts et réalistes en tenant compte de la fatigue.",
    action: "Planifier une séance",
    items: [
      {
        title: "Mardi · 17:30",
        detail: "Lecture guidée · 15 minutes",
        tag: "Confirmé",
      },
      {
        title: "Mercredi · 10:00",
        detail: "Défi fractions avec Popy · 20 minutes",
        tag: "À venir",
      },
      {
        title: "Jeudi · 17:30",
        detail: "Orthographe adaptée · 10 minutes",
        tag: "À venir",
      },
    ],
  },
  Échanges: {
    eyebrow: "Lien école-famille",
    description:
      "Centralise les échanges utiles sans exposer les données sensibles.",
    action: "Nouveau message",
    items: [
      {
        title: "Mme Leroy",
        detail: "Léo a très bien participé à l’atelier lecture.",
        tag: "Nouveau",
      },
      {
        title: "Équipe Popy",
        detail: "Votre bilan mensuel est disponible.",
        tag: "Hier",
      },
      {
        title: "Journal de Popy",
        detail: "3 moments de réussite enregistrés cette semaine.",
        tag: "Lundi",
      },
    ],
  },
  "Profil & adaptations": {
    eyebrow: "Besoins de Léo",
    description:
      "Gère les adaptations partagées avec l’école et le robot Popy.",
    action: "Créer une adaptation",
    items: [
      {
        title: "Lecture et consignes",
        detail: "Audio, espacement renforcé et surlignage",
        tag: "Actif",
      },
      {
        title: "Gestion du temps",
        detail: "Séquences de 10 minutes et pauses guidées",
        tag: "Actif",
      },
      {
        title: "Interactions",
        detail: "Grandes zones tactiles et saisie limitée",
        tag: "Optionnel",
      },
    ],
  },
  "Ma classe": {
    eyebrow: "CE2 B · 26 élèves",
    description:
      "Suivez les besoins de la classe sans réduire les élèves à leur profil.",
    action: "Ajouter un élève",
    items: [
      {
        title: "Groupe violet · 8 élèves",
        detail: "Lecture fluide · Besoin de guidage audio",
        tag: "Priorité",
      },
      {
        title: "Groupe bleu · 10 élèves",
        detail: "Fractions · Progression régulière",
        tag: "En cours",
      },
      {
        title: "Groupe vert · 8 élèves",
        detail: "Sciences · Objectifs dépassés",
        tag: "Autonome",
      },
    ],
  },
  Activités: {
    eyebrow: "Catalogue pédagogique",
    description:
      "Créez et différenciez des activités alignées sur les attendus nationaux.",
    action: "Créer une activité",
    items: [
      {
        title: "Fractions du quotidien",
        detail: "Mathématiques · CE2 · 3 niveaux",
        tag: "Publiée",
      },
      {
        title: "Lecture chronométrée",
        detail: "Français · Audio et police adaptée",
        tag: "Brouillon",
      },
      {
        title: "Le cycle de l’eau",
        detail: "Sciences · Compatible avec Popy",
        tag: "Publiée",
      },
    ],
  },
  Progressions: {
    eyebrow: "Compétences de la classe",
    description:
      "Repérez les acquis, les fragilités et l’impact des adaptations.",
    action: "Exporter les données",
    items: [
      {
        title: "Nombres et calculs",
        detail: "21 élèves en réussite · 5 à accompagner",
        tag: "81%",
      },
      {
        title: "Lecture et compréhension",
        detail: "19 élèves en réussite · 7 à accompagner",
        tag: "73%",
      },
      {
        title: "Questionner le monde",
        detail: "24 élèves en réussite · 2 à accompagner",
        tag: "92%",
      },
    ],
  },
  Messagerie: {
    eyebrow: "Communication sécurisée",
    description:
      "Échangez avec les familles et l’équipe éducative depuis un seul espace.",
    action: "Nouveau message",
    items: [
      {
        title: "Sophie Martin · Parent de Léo",
        detail: "Merci pour vos recommandations de lecture.",
        tag: "Nouveau",
      },
      {
        title: "M. Bernard · AESH",
        detail: "Compte rendu de la séance de mardi.",
        tag: "Hier",
      },
      {
        title: "Équipe pédagogique",
        detail: "Réunion de suivi vendredi à 16h30.",
        tag: "Important",
      },
    ],
  },
  "Ressources parents": {
    eyebrow: "Conseils et accompagnement",
    description:
      "Des ressources concrètes pour accompagner sans faire à la place de l’enfant.",
    action: "Enregistrer une ressource",
    items: [
      {
        title: "Aider sans donner la réponse",
        detail: "Guide pratique · 6 minutes de lecture",
        tag: "Recommandé",
      },
      {
        title: "Comprendre la fatigue cognitive",
        detail: "Fiche préparée avec des professionnels",
        tag: "TDAH & DYS",
      },
      {
        title: "Créer une routine de devoirs apaisée",
        detail: "Modèle personnalisable et imprimable",
        tag: "Organisation",
      },
    ],
  },
  "Rendez-vous": {
    eyebrow: "Coordination éducative",
    description:
      "Préparez et centralisez les rendez-vous avec l’école et les accompagnants.",
    action: "Planifier un rendez-vous",
    items: [
      {
        title: "Point avec Mme Leroy",
        detail: "Vendredi 17 mai · 16:30 · Visioconférence",
        tag: "Confirmé",
      },
      {
        title: "Bilan orthophoniste",
        detail: "Mardi 28 mai · Documents à préparer",
        tag: "À préparer",
      },
      {
        title: "Équipe de suivi",
        detail: "Date à convenir avec les participants",
        tag: "Brouillon",
      },
    ],
  },
  Confidentialité: {
    eyebrow: "Données et consentements",
    description:
      "Contrôlez précisément les informations partagées entre la famille, l’école et Popy.",
    action: "Ajouter une autorisation",
    items: [
      {
        title: "Partage avec l’enseignante",
        detail: "Progressions et adaptations · Autorisé",
        tag: "Actif",
      },
      {
        title: "Données du robot Popy",
        detail: "Historique local et synchronisation chiffrée",
        tag: "Protégé",
      },
      {
        title: "Export et suppression",
        detail: "Dernier export effectué il y a 12 jours",
        tag: "Disponible",
      },
    ],
  },
  "PAP & adaptations": {
    eyebrow: "Aménagements pédagogiques",
    description:
      "Suivez les adaptations prévues, leur application et leur efficacité en classe.",
    action: "Créer une adaptation",
    items: [
      {
        title: "Léo Martin · Consignes",
        detail: "Reformulation orale et segmentation en une étape",
        tag: "Appliquée",
      },
      {
        title: "Jade Dubois · Production écrite",
        detail: "Saisie numérique et temps supplémentaire",
        tag: "À évaluer",
      },
      {
        title: "Groupe violet · Lecture",
        detail: "Police adaptée et guidage audio",
        tag: "Efficace",
      },
    ],
  },
  Séquences: {
    eyebrow: "Programmation pédagogique",
    description:
      "Construisez des séquences différenciées et compatibles avec le robot Popy.",
    action: "Créer une séquence",
    items: [
      {
        title: "Fractions dans la vie quotidienne",
        detail: "4 séances · Mathématiques · CE2",
        tag: "En cours",
      },
      {
        title: "Lire et comprendre un récit",
        detail: "6 séances · Français · 3 niveaux",
        tag: "Planifiée",
      },
      {
        title: "Le cycle naturel de l’eau",
        detail: "3 séances · Sciences · Expérience avec Popy",
        tag: "Brouillon",
      },
    ],
  },
  Rapports: {
    eyebrow: "Bilans et pilotage",
    description:
      "Générez des synthèses lisibles pour l’équipe éducative et les familles.",
    action: "Générer un rapport",
    items: [
      {
        title: "Bilan de classe · Mai",
        detail: "Compétences, engagement et besoins émergents",
        tag: "Prêt",
      },
      {
        title: "Suivi des adaptations",
        detail: "Impact observé sur les 30 derniers jours",
        tag: "À vérifier",
      },
      {
        title: "Synthèse pour le conseil de cycle",
        detail: "Données anonymisées · 26 élèves",
        tag: "Brouillon",
      },
    ],
  },
}

function FeatureWorkspace({ title, role }: { title: string role: Role }) {
  const content = workspaceContent[title]
  const [items, setItems] = useState(
    content.items.map((item, index) => ({ ...item, id: index, done: false })),
  )
  const [filter, setFilter] = useState<"Tous" | "À traiter" | "Terminés">(
    "Tous",
  )
  const [selected, setSelected] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [draft, setDraft] = useState("")
  const [feedback, setFeedback] = useState("")

  const visibleItems = items.filter((item) =>
    filter === "Tous" ? true : filter === "Terminés" ? item.done : !item.done,
  )

  const toggleItem = (id: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    )
    setFeedback("État enregistré et synchronisé avec Popy.")
    window.setTimeout(() => setFeedback(""), 2600)
  }

  const addItem = () => {
    if (!draft.trim()) return
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        title: draft,
        detail: `Créé depuis l’espace ${role.toLowerCase()}`,
        tag: "Nouveau",
        done: false,
      },
    ])
    setDraft("")
    setShowCreate(false)
    setFeedback("Nouvel élément créé avec succès.")
    window.setTimeout(() => setFeedback(""), 2600)
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] p-5 md:p-8">
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-2xl">
          <Check size={17} className="text-emerald-400" />
          {feedback}
        </div>
      )}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-extrabold text-indigo-600">
            {content.eyebrow}
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-400">
            {content.description}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200"
        >
          <Plus size={17} />
          {content.action}
        </button>
      </div>

      <section className="mt-7 grid gap-5 md:grid-cols-3">
        {[
          ["À traiter", items.filter((item) => !item.done).length, Target],
          ["Terminés", items.filter((item) => item.done).length, Check],
          ["Synchronisés", items.length, Bot],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon as IconType
          return (
            <article
              key={label as string}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <StatIcon size={20} />
              </div>
              <div>
                <div className="font-display text-2xl font-extrabold text-slate-900">
                  {value as number}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {label as string}
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {(["Tous", "À traiter", "Terminés"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-extrabold ${
                    filter === item
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">
              {visibleItems.length} résultat(s)
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleItems.length ? (
              visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className={`flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 ${
                    selected === item.id ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <span
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleItem(item.id)
                    }}
                    className={`grid size-6 shrink-0 place-items-center rounded-lg border ${
                      item.done
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {item.done && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block font-display font-extrabold ${
                        item.done
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-xs font-semibold text-slate-400">
                      {item.detail}
                    </span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600">
                    {item.tag}
                  </span>
                  <ChevronRight size={17} className="text-slate-300" />
                </button>
              ))
            ) : (
              <div className="p-10 text-center">
                <Check size={28} className="mx-auto text-emerald-500" />
                <p className="mt-3 text-sm font-extrabold text-slate-700">
                  Rien à afficher ici
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-2xl bg-slate-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-300">
              Détail
            </span>
            <Bot size={20} className="text-violet-300" />
          </div>
          <h2 className="mt-5 font-display text-xl font-extrabold">
            {items.find((item) => item.id === selected)?.title ??
              "Sélectionnez un élément"}
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-300">
            {items.find((item) => item.id === selected)?.detail ??
              "Cliquez sur une ligne pour afficher les informations et les actions disponibles."}
          </p>
          {items.find((item) => item.id === selected) && (
            <button
              onClick={() => toggleItem(selected)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-slate-900"
            >
              <Check size={17} />
              Changer le statut
            </button>
          )}
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold leading-relaxed text-slate-400">
              Les modifications sont disponibles sur l’application même hors
              connexion, puis synchronisées avec Popy dès son retour en ligne.
            </p>
          </div>
        </aside>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                  {title}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-slate-900">
                  {content.action}
                </h2>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                ×
              </button>
            </div>
            <label className="mt-6 block text-xs font-extrabold text-slate-600">
              Nom
              <input
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addItem()}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                placeholder="Saisir un titre..."
              />
            </label>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-extrabold text-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={addItem}
                disabled={!draft.trim()}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default FeatureWorkspace
