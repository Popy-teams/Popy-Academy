import { useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  Check,
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react"

import { usePersistentState } from "../lib/persistence"

type AdminProps = {
  active: string
  isDashboard: boolean
  setActive: (label: string) => void
}

const sectionConfig: Record<string, {
  eyebrow: string
  description: string
  action: string
  rows: Array<{ title: string detail: string status: string }>
}> = {
  Établissements: {
    eyebrow: "Organisation",
    description:
      "Gérez les écoles, années scolaires, classes et affectations de démonstration.",
    action: "Ajouter un établissement",
    rows: [
      {
        title: "École Jules Ferry",
        detail: "12 classes · 284 élèves · Académie de Lyon",
        status: "Actif",
      },
      {
        title: "École Jean Moulin",
        detail: "8 classes · 196 élèves · Académie de Nantes",
        status: "Actif",
      },
      {
        title: "École pilote Popy",
        detail: "4 classes · environnement de démonstration",
        status: "Test",
      },
    ],
  },
  Utilisateurs: {
    eyebrow: "Comptes et rôles",
    description:
      "Visualisez les profils locaux et préparez les futures affectations sécurisées.",
    action: "Créer une invitation",
    rows: [
      {
        title: "Claire Leroy",
        detail: "Enseignante · CE2 B · dernière activité aujourd’hui",
        status: "Actif",
      },
      {
        title: "Alex Moreau",
        detail: "AESH · 3 élèves suivis",
        status: "Actif",
      },
      {
        title: "Sophie Martin",
        detail: "Responsable légal · 1 enfant associé",
        status: "Local",
      },
    ],
  },
  "Parc de robots (optionnel)": {
    eyebrow: "Équipements optionnels",
    description:
      "Les classes tournent sur ordinateurs. Les robots restent un complément optionnel.",
    action: "Appairer un robot (optionnel)",
    rows: [
      {
        title: "Popy-CE2B-01",
        detail: "Batterie 73% · firmware 0.9.4 · École Jules Ferry",
        status: "En ligne",
      },
      {
        title: "Popy-CM1A-02",
        detail: "Batterie 91% · firmware 0.9.4 · École Jules Ferry",
        status: "En ligne",
      },
      {
        title: "Popy-LAB-01",
        detail: "Banc de test · mise à jour disponible",
        status: "Maintenance",
      },
    ],
  },
  "Catalogue de contenus": {
    eyebrow: "Qualité pédagogique",
    description:
      "Validez, versionnez et archivez les contenus avant leur publication.",
    action: "Ajouter un contenu",
    rows: [
      {
        title: "Fractions simples · CE2",
        detail: "Version 3 · validée par Mme Leroy",
        status: "Publié",
      },
      {
        title: "Cycle de l’eau · CE2",
        detail: "Version 2 · adaptations DYS incluses",
        status: "Publié",
      },
      {
        title: "Algorithmes avec Popy · CM1",
        detail: "Version 1 · validation pédagogique requise",
        status: "À valider",
      },
    ],
  },
  Incidents: {
    eyebrow: "Support et sécurité",
    description:
      "Centralisez les événements techniques et suivez leur résolution.",
    action: "Déclarer un incident",
    rows: [
      {
        title: "Synchronisation différée",
        detail: "Popy-CE2B-01 · résolu automatiquement hors ligne",
        status: "Résolu",
      },
      {
        title: "Batterie faible",
        detail: "Popy-CM1A-02 · notification envoyée",
        status: "Surveillance",
      },
      {
        title: "Échec d’import",
        detail: "Fichier de démonstration invalide",
        status: "À traiter",
      },
    ],
  },
  "Journal d’audit": {
    eyebrow: "Traçabilité",
    description:
      "Consultez les actions sensibles simulées sans exposer les contenus privés.",
    action: "Exporter le journal",
    rows: [
      {
        title: "Modification d’une adaptation",
        detail: "Claire Leroy · Léo Martin · aujourd’hui à 10:24",
        status: "Autorisé",
      },
      {
        title: "Export local des données",
        detail: "Sophie Martin · aujourd’hui à 09:12",
        status: "Autorisé",
      },
      {
        title: "Tentative d’accès hors périmètre",
        detail: "Profil de démonstration · hier à 16:48",
        status: "Bloqué",
      },
    ],
  },
}

export default function AdminInterface({ active, setActive }: AdminProps) {
  const [query, setQuery] = useState("")
  const [feedback, setFeedback] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const [formDetail, setFormDetail] = useState("")
  const [formStatus, setFormStatus] = useState("Brouillon")
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const pageSize = 5
  const [adminEvents, setAdminEvents] = usePersistentState<string[]>(
    "admin-events",
    [],
  )
  const [adminRows, setAdminRows] = usePersistentState<Record<string, Array<{
    title: string
    detail: string
    status: string
  }>>>(
    "admin-section-rows",
    Object.fromEntries(
      Object.entries(sectionConfig).map(([key, config]) => [key, config.rows]),
    ),
  )
  const [assignments, setAssignments] = usePersistentState<
    Array<{
      id: string
      person: string
      target: string
      role: string
    }>
  >("admin-assignments", [
    {
      id: "a1",
      person: "Claire Leroy",
      target: "CE2 B · Jules Ferry",
      role: "Enseignant",
    },
    {
      id: "a2",
      person: "Alex Moreau",
      target: "Léo Martin",
      role: "AESH",
    },
    {
      id: "a3",
      person: "Sophie Martin",
      target: "Léo Martin · Mia Martin",
      role: "Parent",
    },
  ])

  const notify = (message: string) => {
    setFeedback(message)
    setAdminEvents([`${new Date().toISOString()} · ${message}`, ...adminEvents])
    window.setTimeout(() => setFeedback(""), 2400)
  }

  if (active === "Pilotage") {
    return (
      <main className="mx-auto max-w-[1500px] p-5 md:p-8">
        {feedback && <Toast text={feedback} />}
        <span className="text-sm font-extrabold text-indigo-600">
          Administration locale
        </span>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          Pilotage de Popy Academy
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-400">
          Vue de démonstration sans données personnelles réelles.
        </p>

        <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["3", "Établissements", Building2, "bg-indigo-50 text-indigo-600"],
            ["488", "Profils locaux", Users, "bg-cyan-50 text-cyan-600"],
            ["12", "Robots suivis", Bot, "bg-emerald-50 text-emerald-600"],
            [
              "2",
              "Incidents ouverts",
              AlertTriangle,
              "bg-amber-50 text-amber-600",
            ],
          ].map(([value, label, Icon, tone]) => {
            const CardIcon = Icon as typeof Users
            return (
              <article
                key={label as string}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div
                  className={`grid size-10 place-items-center rounded-xl ${tone}`}
                >
                  <CardIcon size={19} />
                </div>
                <div className="mt-4 font-display text-3xl font-extrabold text-slate-900">
                  {value as string}
                </div>
                <p className="text-sm font-bold text-slate-500">
                  {label as string}
                </p>
              </article>
            )
          })}
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              État de la plateforme
            </h2>
            <div className="mt-5 space-y-5">
              {[
                ["Disponibilité locale", 100, "bg-emerald-500"],
                ["Robots à jour", 83, "bg-indigo-500"],
                ["Contenus validés", 92, "bg-cyan-500"],
                ["Synchronisations terminées", 88, "bg-amber-500"],
              ].map(([label, value, tone]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-600">{label as string}</span>
                    <span className="text-slate-400">{value as number}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${tone}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <aside className="rounded-2xl bg-slate-900 p-5 text-white">
            <ShieldCheck size={24} className="text-violet-300" />
            <h2 className="mt-4 font-display text-xl font-extrabold">
              Sécurité de démonstration
            </h2>
            <div className="mt-4 space-y-3 text-xs font-semibold text-slate-300">
              <p>Stockage local actif</p>
              <p>File de synchronisation surveillée</p>
              <p>Aucun profil commercial</p>
              <p>Journal d’audit local disponible</p>
            </div>
            <button
              onClick={() => setActive("Journal d’audit")}
              className="mt-6 text-xs font-extrabold text-violet-300"
            >
              Consulter le journal →
            </button>
          </aside>
        </div>
      </main>
    )
  }

  const config = sectionConfig[active]
  const sectionRows = adminRows[active] ?? config.rows
  const filteredRows = sectionRows.filter((row) =>
    row.title.toLowerCase().includes(query.toLowerCase()),
  )
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const openCreateForm = () => {
    setEditingTitle(null)
    setFormTitle("")
    setFormDetail("")
    setFormStatus("Brouillon")
    setFormOpen(true)
  }

  const openEditForm = (row: { title: string; detail: string; status: string }) => {
    setEditingTitle(row.title)
    setFormTitle(row.title)
    setFormDetail(row.detail)
    setFormStatus(row.status)
    setFormOpen(true)
  }

  const saveForm = () => {
    if (!formTitle.trim()) return
    const nextRow = {
      title: formTitle.trim(),
      detail: formDetail.trim() || "Élément créé localement · à compléter",
      status: formStatus,
    }
    if (editingTitle) {
      setAdminRows({
        ...adminRows,
        [active]: sectionRows.map((item) =>
          item.title === editingTitle ? nextRow : item,
        ),
      })
      notify(`${nextRow.title} mis à jour`)
    } else {
      setAdminRows({
        ...adminRows,
        [active]: [...sectionRows, nextRow],
      })
      notify(`${nextRow.title} créé localement`)
    }
    setFormOpen(false)
    setPage(1)
  }

  return (
    <main className="mx-auto max-w-[1500px] p-5 md:p-8">
      {feedback && <Toast text={feedback} />}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-extrabold text-indigo-600">
            {config.eyebrow}
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
            {active}
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-400">
            {config.description}
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white"
        >
          <Plus size={17} /> {config.action}
        </button>
      </div>

      {formOpen && (
        <section className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <h2 className="font-display text-lg font-extrabold text-indigo-950">
            {editingTitle ? "Modifier l’élément" : "Formulaire détaillé"}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="text-xs font-extrabold text-indigo-900">
              Nom
              <input
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm font-semibold outline-none"
              />
            </label>
            <label className="text-xs font-extrabold text-indigo-900 md:col-span-2">
              Détail
              <input
                value={formDetail}
                onChange={(event) => setFormDetail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm font-semibold outline-none"
              />
            </label>
            <label className="text-xs font-extrabold text-indigo-900">
              Statut
              <select
                value={formStatus}
                onChange={(event) => setFormStatus(event.target.value)}
                className="mt-2 w-full rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm font-semibold outline-none"
              >
                {[
                  "Brouillon",
                  "Actif",
                  "Local",
                  "Test",
                  "Publié",
                  "À valider",
                  "En ligne",
                  "Maintenance",
                  "Ouvert",
                  "Résolu",
                  "Autorisé",
                  "Bloqué",
                ].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={saveForm}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white"
            >
              Enregistrer
            </button>
            <button
              onClick={() => setFormOpen(false)}
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-indigo-700"
            >
              Annuler
            </button>
          </div>
        </section>
      )}

      <div className="relative mt-7">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-indigo-300"
          placeholder={`Rechercher dans ${active.toLowerCase()}...`}
        />
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {pagedRows.map((row, index) => (
          <div
            key={`${row.title}-${index}`}
            className={`flex w-full items-center gap-3 p-5 hover:bg-slate-50 ${
              index ? "border-t border-slate-100" : ""
            }`}
          >
            <button
              onClick={() => openEditForm(row)}
              className="flex min-w-0 flex-1 items-center gap-4 text-left"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                {active === "Parc de robots (optionnel)" ? (
                  <Bot size={20} />
                ) : active === "Incidents" ? (
                  <AlertTriangle size={20} />
                ) : active === "Catalogue de contenus" ? (
                  <BookOpen size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold text-slate-800">
                  {row.title}
                </span>
                <span className="mt-1 block truncate text-xs font-semibold text-slate-400">
                  {row.detail}
                </span>
              </span>
            </button>
            <span
              className={`hidden rounded-full px-3 py-1.5 text-[10px] font-extrabold sm:block ${
                ["Actif", "En ligne", "Publié", "Résolu", "Autorisé"].includes(
                  row.status,
                )
                  ? "bg-emerald-50 text-emerald-700"
                  : row.status === "Bloqué"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {row.status}
            </span>
            <button
              onClick={() => openEditForm(row)}
              className="rounded-lg bg-slate-100 px-2.5 py-2 text-[10px] font-extrabold text-slate-500"
            >
              Modifier
            </button>
            <button
              onClick={() =>
                setAdminRows({
                  ...adminRows,
                  [active]: sectionRows.filter(
                    (item) => item.title !== row.title,
                  ),
                })
              }
              className="rounded-lg bg-rose-50 px-2.5 py-2 text-[10px] font-extrabold text-rose-600"
            >
              Supprimer
            </button>
          </div>
        ))}
        {!pagedRows.length && (
          <div className="p-8 text-center text-sm font-bold text-slate-400">
            Aucun résultat pour cette recherche.
          </div>
        )}
      </section>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">
          {filteredRows.length} élément(s) · page {currentPage}/{totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 disabled:opacity-40"
          >
            Précédent
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              Affectations
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Liaisons locales personnes ↔ classes / enfants
            </p>
          </div>
          <button
            onClick={() => {
              const person = window.prompt("Personne à affecter")
              if (!person?.trim()) return
              const target = window.prompt("Classe ou enfant cible")
              if (!target?.trim()) return
              const role = window.prompt("Rôle", "Enseignant") || "Enseignant"
              setAssignments([
                {
                  id: `a-${Date.now()}`,
                  person: person.trim(),
                  target: target.trim(),
                  role: role.trim(),
                },
                ...assignments,
              ])
              notify(`Affectation de ${person.trim()} enregistrée`)
            }}
            className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700"
          >
            Nouvelle affectation
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3"
            >
              <div>
                <div className="text-sm font-extrabold text-slate-800">
                  {assignment.person}
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  {assignment.role} → {assignment.target}
                </div>
              </div>
              <button
                onClick={() =>
                  setAssignments(
                    assignments.filter((item) => item.id !== assignment.id),
                  )
                }
                className="text-[10px] font-extrabold text-rose-600"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </section>

      {active === "Parc de robots (optionnel)" && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-cyan-50 p-4">
          <Wifi size={20} className="text-cyan-700" />
          <p className="text-xs font-bold text-cyan-900">
            11 robots sur 12 communiquent avec leur application locale.
          </p>
        </div>
      )}
    </main>
  )
}

function Toast({ text }: { text: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white shadow-xl">
      <Check size={16} className="text-emerald-400" />
      {text}
    </div>
  )
}
