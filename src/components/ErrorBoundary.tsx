import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default class ErrorBoundary extends Component<{ children: ReactNode }, {
  failed: boolean
}> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Popy Academy UI error", error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-5">
        <section className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle size={26} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-black text-slate-900">
            Cette page a rencontré un problème
          </h1>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
            Les données locales sont conservées. Rechargez l’interface pour
            reprendre votre travail.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
          >
            <RefreshCw size={17} /> Recharger
          </button>
        </section>
      </main>
    )
  }
}
