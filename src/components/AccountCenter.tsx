import { useState } from "react"
import {
  Check,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react"

import { loginAdult, loadStoredAuth, storeAuth } from "../lib/hybrid-sync"
import { usePersistentState } from "../lib/persistence"
import AccessibleModal, { LiveRegion } from "./AccessibleModal"

type AccountRole = "Enfant" | "Parent" | "Enseignant" | "AESH" | "Admin"
type LocalProfile = {
  id: number
  name: string
  role: AccountRole
  initials: string
  color: string
  protected: boolean
  demoEmail?: string
}

const ROLE_TO_API: Record<Exclude<AccountRole, "Enfant">, string> = {
  Parent: "PARENT",
  Enseignant: "TEACHER",
  AESH: "AESH",
  Admin: "ADMIN",
}

export default function AccountCenter({
  currentRole,
  onRoleChange,
}: {
  currentRole: AccountRole
  onRoleChange: (role: AccountRole) => void
}) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("parent.demo@example.invalid")
  const [password, setPassword] = useState("DemoPassw0rd!")
  const [mfaToken, setMfaToken] = useState("")
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState("")
  const [pendingProfile, setPendingProfile] = useState<LocalProfile | null>(
    null,
  )
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState<AccountRole>("Enfant")
  const [profiles, setProfiles] = usePersistentState<LocalProfile[]>(
    "local-profiles",
    [
      {
        id: 1,
        name: "Léo Martin",
        role: "Enfant",
        initials: "LM",
        color: "bg-amber-100 text-amber-800",
        protected: false,
      },
      {
        id: 2,
        name: "Parent Démo",
        role: "Parent",
        initials: "PD",
        color: "bg-indigo-100 text-indigo-800",
        protected: true,
        demoEmail: "parent.demo@example.invalid",
      },
      {
        id: 3,
        name: "Enseignant Démo",
        role: "Enseignant",
        initials: "ED",
        color: "bg-emerald-100 text-emerald-800",
        protected: true,
        demoEmail: "enseignant.demo@example.invalid",
      },
      {
        id: 4,
        name: "AESH Démo",
        role: "AESH",
        initials: "AD",
        color: "bg-cyan-100 text-cyan-800",
        protected: true,
        demoEmail: "aesh.demo@example.invalid",
      },
    ],
  )

  const activate = (profile: LocalProfile) => {
    if (profile.protected) {
      setPendingProfile(profile)
      setEmail(profile.demoEmail ?? "parent.demo@example.invalid")
      setPassword("DemoPassw0rd!")
      setMfaToken("")
      setAuthError("")
      return
    }
    onRoleChange(profile.role)
    setOpen(false)
  }

  const confirmAdultLogin = async () => {
    if (!pendingProfile || pendingProfile.role === "Enfant") return
    setAuthBusy(true)
    setAuthError("")
    try {
      const session = await loginAdult({
        email,
        password,
        mfa_token: mfaToken || undefined,
      })
      const expected = ROLE_TO_API[pendingProfile.role]
      if (session.user.role !== expected) {
        setAuthError(
          `Ce compte est ${session.user.role}, profil attendu ${expected}.`,
        )
        return
      }
      onRoleChange(pendingProfile.role)
      setPendingProfile(null)
      setOpen(false)
      if (session.mfa_setup_required) {
        setFeedback(
          "Connecté — activez la MFA (enseignants / admin) via /auth/mfa pour débloquer l’API.",
        )
      } else {
        setFeedback(`${pendingProfile.name} connecté via l’API.`)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentification impossible"
      if (message === "mfa_required") {
        setAuthError("Code MFA requis.")
      } else {
        setAuthError(message)
      }
    } finally {
      setAuthBusy(false)
    }
  }

  const addProfile = () => {
    if (!newName.trim()) return
    const initials = newName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    setProfiles([
      ...profiles,
      {
        id: Date.now(),
        name: newName.trim(),
        role: newRole,
        initials,
        color: "bg-violet-100 text-violet-800",
        protected: newRole !== "Enfant",
      },
    ])
    setNewName("")
  }

  const [feedback, setFeedback] = useState("")
  const session = loadStoredAuth()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-[12.5rem] z-40 grid size-12 place-items-center rounded-2xl bg-violet-600 text-white shadow-xl"
        aria-label="Ouvrir les profils locaux"
      >
        <Users size={21} />
      </button>
      {open && (
        <AccessibleModal
          title="Centre de comptes"
          onClose={() => setOpen(false)}
        >
          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Comptes & sync
                </p>
                <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
                  Centre de comptes
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"
                aria-label="Fermer le centre de comptes"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5">
              <LiveRegion message={feedback} />
            </div>

            {session && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                Session API : {session.user.display_name} ({session.user.role})
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => {
                    storeAuth(null)
                    setFeedback("Session déconnectée.")
                  }}
                >
                  Déconnecter
                </button>
              </p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {profiles.map((profile) => (
                <article
                  key={profile.id}
                  className={`relative rounded-2xl border p-4 ${
                    currentRole === profile.role
                      ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                      : "border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => {
                      activate(profile)
                      if (!profile.protected) {
                        setFeedback(`${profile.name} sélectionné.`)
                      }
                    }}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <span
                      className={`grid size-12 place-items-center rounded-xl text-xs font-black ${profile.color}`}
                    >
                      {profile.initials}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display font-black text-slate-800">
                        {profile.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        {profile.protected && <LockKeyhole size={12} />}
                        {profile.role}
                      </span>
                    </span>
                    {currentRole === profile.role && (
                      <Check size={18} className="text-emerald-500" />
                    )}
                  </button>
                  {profiles.length > 1 && currentRole !== profile.role && (
                    <button
                      onClick={() =>
                        setProfiles(
                          profiles.filter((item) => item.id !== profile.id),
                        )
                      }
                      className="absolute right-3 top-3 text-slate-300 hover:text-rose-500"
                      aria-label={`Supprimer ${profile.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2">
                <UserRound size={19} className="text-violet-600" />
                <h3 className="font-display font-black text-slate-800">
                  Ajouter un profil local
                </h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_170px_auto]">
                <input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-violet-300"
                  placeholder="Nom du profil"
                />
                <select
                  value={newRole}
                  onChange={(event) =>
                    setNewRole(event.target.value as AccountRole)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold"
                >
                  {["Enfant", "Parent", "Enseignant", "AESH", "Admin"].map(
                    (role) => (
                      <option key={role}>{role}</option>
                    ),
                  )}
                </select>
                <button
                  onClick={() => {
                    addProfile()
                    setFeedback("Profil local ajouté.")
                  }}
                  disabled={!newName.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white disabled:opacity-40"
                >
                  <Plus size={17} /> Ajouter
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4">
              <ShieldCheck size={19} className="shrink-0 text-amber-600" />
              <p className="text-xs font-semibold leading-relaxed text-amber-900">
                Les adultes s’authentifient via l’API (email + mot de passe +
                MFA). Le PIN parental reste uniquement côté client pour les
                réglages locaux, pas comme auth serveur.
              </p>
            </div>
          </section>
        </AccessibleModal>
      )}

      {pendingProfile && (
        <AccessibleModal
          title="Connexion adulte"
          onClose={() => setPendingProfile(null)}
          className="max-w-sm"
        >
          <section className="text-left">
            <LockKeyhole size={28} className="mx-auto text-violet-600" />
            <h2 className="mt-4 text-center font-display text-xl font-black text-slate-900">
              Connexion adulte
            </h2>
            <p className="mt-2 text-center text-xs font-semibold text-slate-500">
              Compte démo : {pendingProfile.demoEmail ?? email}
            </p>
            <label className="mt-4 block text-xs font-bold text-slate-500">
              E-mail
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-violet-400"
              />
            </label>
            <label className="mt-3 block text-xs font-bold text-slate-500">
              Mot de passe
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-violet-400"
              />
            </label>
            <label className="mt-3 block text-xs font-bold text-slate-500">
              MFA (si activé)
              <input
                value={mfaToken}
                onChange={(event) =>
                  setMfaToken(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-violet-400"
                placeholder="000000"
              />
            </label>
            {authError && (
              <p className="mt-3 text-xs font-bold text-rose-600">{authError}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPendingProfile(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-500"
              >
                Annuler
              </button>
              <button
                disabled={authBusy || !email || !password}
                onClick={() => void confirmAdultLogin()}
                className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {authBusy ? "…" : "Se connecter"}
              </button>
            </div>
          </section>
        </AccessibleModal>
      )}
    </>
  )
}
