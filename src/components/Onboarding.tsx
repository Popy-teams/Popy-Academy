import { useState } from "react"
import {
  Accessibility,
  ArrowRight,
  Bot,
  Brain,
  Check,
  GraduationCap,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

type AppRole = "Enfant" | "Parent" | "Enseignant" | "AESH" | "Admin"

export default function Onboarding({
  onComplete,
}: {
  onComplete: (profile: { role: AppRole level: string needs: string[] }) => void
}) {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<AppRole>("Enfant")
  const [level, setLevel] = useState("CE2")
  const [needs, setNeeds] = useState<string[]>(["Lecture adaptée"])

  const toggleNeed = (need: string) =>
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    )

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col overflow-hidden rounded-[36px] border border-white bg-white/90 shadow-2xl shadow-indigo-100 backdrop-blur-sm md:flex-row">
        <aside className="relative overflow-hidden bg-indigo-600 p-7 text-white md:w-[38%] md:p-10">
          <span className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/15">
              <Bot size={27} />
            </div>
            <h1 className="mt-6 font-display text-3xl font-black">
              Bienvenue dans Popy Academy
            </h1>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-indigo-100">
              Configurons un espace qui respecte le rythme, les besoins et
              l’autonomie de chaque enfant.
            </p>
            <div className="mt-10 space-y-5">
              {[
                ["1", "Choisir mon espace"],
                ["2", "Personnaliser le profil"],
                ["3", "Vérifier les réglages"],
              ].map(([number, label], index) => (
                <div
                  key={number}
                  className={`flex items-center gap-3 ${
                    index <= step ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-full text-xs font-black ${
                      index < step
                        ? "bg-emerald-300 text-emerald-950"
                        : "bg-white/15"
                    }`}
                  >
                    {index < step ? <Check size={15} /> : number}
                  </span>
                  <span className="text-sm font-extrabold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex flex-1 flex-col p-6 md:p-10">
          <div className="flex-1">
            {step === 0 && (
              <>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Étape 1 sur 3
                </span>
                <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                  Quel espace souhaitez-vous ouvrir ?
                </h2>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Enfant", Sparkles, "Apprendre et jouer sur ordinateur"],
                    ["Parent", ShieldCheck, "Accompagner, abonnement, sans robot requis"],
                    ["Enseignant", GraduationCap, "Piloter les apprentissages en classe"],
                    ["AESH", Users, "Observer et adapter au quotidien"],
                    [
                      "Admin",
                      ShieldCheck,
                      "Piloter la plateforme de démonstration",
                    ],
                  ].map(([itemRole, Icon, description]) => {
                    const RoleIcon = Icon as typeof Sparkles
                    return (
                      <button
                        key={itemRole as string}
                        onClick={() => setRole(itemRole as AppRole)}
                        className={`rounded-2xl border p-5 text-left transition ${
                          role === itemRole
                            ? "border-indigo-400 bg-indigo-50 ring-4 ring-indigo-100"
                            : "border-slate-200 hover:border-indigo-200"
                        }`}
                      >
                        <RoleIcon size={23} className="text-indigo-600" />
                        <div className="mt-4 font-display text-lg font-black text-slate-800">
                          {itemRole as string}
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {description as string}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Étape 2 sur 3
                </span>
                <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                  Personnaliser l’expérience
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Ces choix restent modifiables et ne constituent pas un
                  diagnostic.
                </p>
                <label className="mt-7 block text-xs font-black text-slate-600">
                  Niveau scolaire de référence
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {["CP", "CE1", "CE2", "CM1", "CM2"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setLevel(item)}
                        className={`rounded-xl py-3 text-xs font-black ${
                          level === item
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </label>
                <div className="mt-7">
                  <p className="text-xs font-black text-slate-600">
                    Préférences d’accompagnement
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Lecture adaptée", Accessibility],
                      ["Séances courtes", Brain],
                      ["Grandes zones tactiles", Heart],
                      ["Routine visuelle", Users],
                    ].map(([need, Icon]) => {
                      const NeedIcon = Icon as typeof Accessibility
                      const selected = needs.includes(need as string)
                      return (
                        <button
                          key={need as string}
                          onClick={() => toggleNeed(need as string)}
                          className={`flex items-center gap-3 rounded-xl p-4 text-left text-xs font-extrabold ${
                            selected
                              ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <NeedIcon size={18} />
                          {need as string}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Étape 3 sur 3
                </span>
                <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                  Tout est prêt
                </h2>
                <div className="mt-7 rounded-3xl bg-slate-900 p-6 text-white">
                  <Bot size={28} className="text-violet-300" />
                  <h3 className="mt-4 font-display text-xl font-black">
                    Espace {role}
                  </h3>
                  <div className="mt-5 space-y-3 text-sm font-semibold text-slate-300">
                    <p>Niveau de référence : {level}</p>
                    <p>
                      Adaptations :{" "}
                      {needs.length ? needs.join(", ") : "profil standard"}
                    </p>
                    <p>Fonctionne entièrement sur ordinateur</p>
                    <p>Robot optionnel — jamais obligatoire</p>
                    <p>Mode hors ligne disponible après installation</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold leading-relaxed text-emerald-900">
                  Les familles sans robot ont le même accès pédagogique. Les
                  comptes adultes se connectent via l’API (centre de comptes).
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              className={`rounded-xl px-5 py-3 text-sm font-black text-slate-500 ${
                step === 0 ? "invisible" : ""
              }`}
            >
              Retour
            </button>
            <button
              onClick={() =>
                step < 2
                  ? setStep(step + 1)
                  : onComplete({ role, level, needs })
              }
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200"
            >
              {step < 2 ? "Continuer" : "Entrer dans Popy"}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
