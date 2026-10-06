import { useEffect, useState } from "react"
import { Check, CreditCard, LoaderCircle, Monitor, Sparkles } from "lucide-react"

import ComputerFirstBanner from "./ComputerFirstBanner"
import {
  fetchMySubscription,
  fetchSubscriptionPlans,
  subscribeToPlan,
  startCheckout,
  confirmDemoCheckout,
  updateSubscription,
  type SubscriptionMe,
  type SubscriptionPlan,
} from "../lib/api-client"
import { loadStoredAuth } from "../lib/hybrid-sync"

function formatPrice(cents: number, currency: string) {
  if (cents === 0) return "Gratuit"
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(cents / 100)
}

export default function SubscriptionPanel() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [principle, setPrinciple] = useState("")
  const [me, setMe] = useState<SubscriptionMe | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const authed = Boolean(loadStoredAuth()?.access_token)

  const reload = async () => {
    const catalogue = await fetchSubscriptionPlans()
    setPlans(catalogue.plans)
    setPrinciple(catalogue.principle)
    if (authed) {
      setMe(await fetchMySubscription())
    }
  }

  useEffect(() => {
    void reload().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Impossible de charger les offres")
    })
  }, [authed])

  const choosePlan = async (code: SubscriptionPlan["code"]) => {
    if (!authed) {
      setError("Connectez-vous en tant que parent pour souscrire.")
      return
    }
    setBusy(true)
    setError("")
    setMessage("")
    try {
      if (code === "ordinateur") {
        await subscribeToPlan({
          plan_code: "ordinateur",
          access_mode: "COMPUTER",
          robot_enabled: false,
        })
        await reload()
        setMessage("Formule Ordinateur activée — sans robot, sans paiement.")
        return
      }

      const checkout = await startCheckout(code as "famille" | "ecole")
      if (checkout.mode === "stripe" && checkout.checkout_url) {
        window.location.href = checkout.checkout_url
        return
      }

      if (!checkout.demo_token) {
        throw new Error("Jeton de paiement démo manquant")
      }
      await confirmDemoCheckout({
        checkout_id: checkout.checkout_id,
        demo_token: checkout.demo_token,
      })
      await reload()
      setMessage(
        `Paiement démo confirmé pour ${code} (${(checkout.amount_cents / 100).toFixed(2)} ${checkout.currency}). En prod : Stripe.`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Souscription impossible")
    } finally {
      setBusy(false)
    }
  }

  const toggleRobot = async (enabled: boolean) => {
    setBusy(true)
    setError("")
    try {
      await updateSubscription({
        robot_enabled: enabled,
        access_mode: enabled ? "HYBRID" : "COMPUTER",
      })
      await reload()
      setMessage(
        enabled
          ? "Robot activé en complément (toujours optionnel)."
          : "Retour au mode ordinateur seul.",
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible")
    } finally {
      setBusy(false)
    }
  }

  const currentCode = me?.subscription?.plan.code ?? me?.effective_access.plan?.code

  return (
    <main className="mx-auto max-w-[1100px] space-y-6 p-5 md:p-8">
      <header>
        <p className="text-sm font-extrabold text-indigo-600">Abonnement</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900">
          Choisir votre formule
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">
          {principle ||
            "L’application est complète sur ordinateur. Le robot n’est jamais obligatoire."}
        </p>
      </header>

      <ComputerFirstBanner />

      {me?.effective_access && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Accès actuel
              </p>
              <h2 className="mt-1 font-display text-xl font-black text-slate-900">
                {me.effective_access.plan?.name ?? "Ordinateur"}
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Mode {me.effective_access.mode === "COMPUTER" ? "ordinateur" : "hybride"} ·
                robot {me.effective_access.robot_enabled ? "complément actif" : "désactivé"} ·
                jamais requis
              </p>
            </div>
            <Monitor className="text-emerald-600" size={28} />
          </div>
          {me.subscription && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void toggleRobot(!me.effective_access.robot_enabled)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
              >
                {me.effective_access.robot_enabled
                  ? "Désactiver le complément robot"
                  : "Activer le complément robot (optionnel)"}
              </button>
            </div>
          )}
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const selected = currentCode === plan.code
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-5 ${
                selected
                  ? "border-indigo-400 bg-indigo-50 ring-4 ring-indigo-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-display text-lg font-black text-slate-900">
                  {plan.name}
                </h3>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">
                {formatPrice(plan.price_cents_month, plan.currency)}
                {plan.price_cents_month > 0 && (
                  <span className="text-xs font-bold text-slate-400"> / mois</span>
                )}
              </p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
                {plan.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs font-semibold text-slate-600"
                  >
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={busy || selected}
                onClick={() => void choosePlan(plan.code)}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white disabled:opacity-40"
              >
                {busy ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <CreditCard size={16} />
                )}
                {selected ? "Formule active" : "Choisir"}
              </button>
            </article>
          )
        })}
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {message}
        </p>
      )}
      {!authed && (
        <p className="text-xs font-semibold text-slate-500">
          Astuce : connectez le compte parent via le centre de comptes pour
          activer une formule.
        </p>
      )}
    </main>
  )
}
