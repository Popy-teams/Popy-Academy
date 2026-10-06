import { lazy, Suspense, useEffect, useState } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router"
import {
  Accessibility,
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Gamepad2,
  HelpCircle,
  Home,
  LayoutGrid,
  MessageCircle,
  Mic,
  NotebookPen,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  UserRoundCheck,
  WandSparkles,
  Wifi,
  WifiOff,
} from "lucide-react"

import { usePersistentState } from "./lib/persistence"
import ErrorBoundary from "./components/ErrorBoundary"
import { exportJson, printCurrentView } from "./lib/exports"
import { SkeletonCard } from "./components/ui"
import { I18nProvider, useI18n } from "./lib/i18n"
import { sectionSlug } from "./lib/routes"

const ChildInterface = lazy(() => import("./interfaces/ChildInterface"))
const ParentInterface = lazy(() => import("./interfaces/ParentInterface"))
const TeacherInterface = lazy(() => import("./interfaces/TeacherInterface"))
const AeshInterface = lazy(() => import("./interfaces/AeshInterface"))
const AdminInterface = lazy(() => import("./interfaces/AdminInterface"))
const Onboarding = lazy(() => import("./components/Onboarding"))
const GlobalTools = lazy(() => import("./components/GlobalTools"))
const SessionBootstrap = lazy(() => import("./components/SessionBootstrap"))

type Role = "Enfant" | "Parent" | "Enseignant" | "AESH" | "Admin"
type IconType = typeof Home

const roleLabels: Role[] = ["Enfant", "Parent", "Enseignant", "AESH", "Admin"]

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
        <Bot size={23} strokeWidth={2.4} />
      </div>
      <div>
        <div className="font-display text-xl font-extrabold leading-none text-slate-900">
          Popy
        </div>
        <div className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-500">
          Academy
        </div>
      </div>
    </div>
  )
}

function RoleSwitcher({
  role,
  setRole,
}: {
  role: Role
  setRole: (role: Role) => void
}) {
  const { t } = useI18n()
  return (
    <div className="flex rounded-xl bg-slate-100 p-1">
      {roleLabels.map((item) => (
        <button
          key={item}
          onClick={() => setRole(item)}
          className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
            role === item
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t(item)}
        </button>
      ))}
    </div>
  )
}

const navByRole: Record<Role, { label: string icon: IconType }[]> = {
  Enfant: [
    { label: "Mon espace", icon: Home },
    { label: "Mon bureau", icon: NotebookPen },
    { label: "Parler à Popy", icon: MessageCircle },
    { label: "Toutes les matières", icon: LayoutGrid },
    { label: "Mes missions", icon: Target },
    { label: "Aide aux devoirs", icon: BookOpen },
    { label: "Jeux & défis", icon: Gamepad2 },
    { label: "Laboratoire Tech", icon: Settings },
    { label: "Studio créatif", icon: WandSparkles },
    { label: "Bibliothèque", icon: BookOpen },
    { label: "Mon planning", icon: CalendarCheck },
    { label: "Mes progrès", icon: BarChart3 },
    { label: "Mes récompenses", icon: Trophy },
    { label: "Mon carnet", icon: NotebookPen },
    { label: "Mon Popy", icon: Bot },
  ],
  Parent: [
    { label: "Vue d’ensemble", icon: Home },
    { label: "Suivi de Léo", icon: BarChart3 },
    { label: "Plan de travail", icon: CalendarDays },
    { label: "Échanges", icon: MessageCircle },
    { label: "Profil & adaptations", icon: Settings },
    { label: "Inclusion & besoins", icon: Brain },
    { label: "Contrôle parental", icon: ShieldCheck },
    { label: "Abonnement", icon: CreditCard },
    { label: "Robot (optionnel)", icon: Bot },
    { label: "Ressources parents", icon: BookOpen },
    { label: "Rendez-vous", icon: CalendarCheck },
    { label: "Confidentialité", icon: ShieldCheck },
  ],
  Enseignant: [
    { label: "Tableau de bord", icon: LayoutGrid },
    { label: "Ma classe", icon: Users },
    { label: "Activités", icon: BookOpen },
    { label: "Éditeur d’activités", icon: WandSparkles },
    { label: "Générateur IA", icon: WandSparkles },
    { label: "Assistant pédagogique", icon: Brain },
    { label: "Progressions", icon: BarChart3 },
    { label: "PAP & adaptations", icon: Settings },
    { label: "Séquences", icon: CalendarDays },
    { label: "Messagerie", icon: MessageCircle },
    { label: "Rapports", icon: FileText },
    { label: "Robot en classe (optionnel)", icon: Bot },
  ],
  AESH: [
    { label: "Mon accompagnement", icon: Home },
    { label: "Élèves suivis", icon: Users },
    { label: "Adaptations du jour", icon: Accessibility },
    { label: "Observations", icon: NotebookPen },
    { label: "Stratégies utiles", icon: Brain },
    { label: "Transmissions", icon: MessageCircle },
  ],
  Admin: [
    { label: "Pilotage", icon: Home },
    { label: "Établissements", icon: LayoutGrid },
    { label: "Utilisateurs", icon: Users },
    { label: "Parc de robots (optionnel)", icon: Bot },
    { label: "Catalogue de contenus", icon: BookOpen },
    { label: "Incidents", icon: ShieldCheck },
    { label: "Journal d’audit", icon: FileText },
  ],
}

const roleSlugs: Record<Role, string> = {
  Enfant: "enfant",
  Parent: "parent",
  Enseignant: "enseignant",
  AESH: "aesh",
  Admin: "admin",
}

export { sectionSlug } from "./lib/routes"

const roleFromSlug = (slug: string) =>
  (Object.keys(roleSlugs) as Role[]).find((role) => roleSlugs[role] === slug)

function Sidebar({
  role,
  active,
  setActive,
}: {
  role: Role
  active: string
  setActive: (label: string) => void
}) {
  const { t } = useI18n()
  return (
    <aside
      className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white px-4 py-6 lg:flex"
      aria-label={t("Navigation principale")}
    >
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-8 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navByRole[role].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition ${
              active === label
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon
              size={19}
              strokeWidth={active === label ? 2.5 : 2}
              className={
                active === label ? "text-indigo-600" : "text-slate-400"
              }
            />
            {t(label)}
          </button>
        ))}
      </nav>
      <div className="mt-4 shrink-0 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <HelpCircle size={17} className="text-violet-300" />
          Besoin d’aide ?
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Notre équipe pédagogique vous répond.
        </p>
        <button className="mt-3 text-xs font-bold text-violet-300">
          Nous contacter →
        </button>
      </div>
    </aside>
  )
}

function Header({
  role,
  setRole,
  onNavigate,
}: {
  role: Role
  setRole: (role: Role) => void
  onNavigate: (label: string) => void
}) {
  const { language, setLanguage, t } = useI18n()
  const [query, setQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationFilter, setNotificationFilter] = useState("Toutes")
  const [notifications, setNotifications] = usePersistentState<Array<{
    id: number
    category: string
    title: string
    detail: string
    priority: "normal" | "important"
    read: boolean
    archived: boolean
    destination?: string
  }>>("notifications", [
    {
      id: 1,
      category: "Apprentissage",
      title: "Nouvelle activité recommandée",
      detail: "Popy propose une mission courte sur les fractions.",
      priority: "normal",
      read: false,
      archived: false,
      destination: "Mes missions",
    },
    {
      id: 2,
      category: "Progression",
      title: "Objectif atteint à 82%",
      detail: "Le bilan hebdomadaire est maintenant disponible.",
      priority: "normal",
      read: false,
      archived: false,
      destination: "Mes progrès",
    },
    {
      id: 3,
      category: "Message",
      title: "Un message attend votre réponse",
      detail: "Mme Leroy a ajouté une observation encourageante.",
      priority: "important",
      read: false,
      archived: false,
      destination: role === "Enseignant" ? "Messagerie" : "Échanges",
    },
    {
      id: 4,
      category: "Robot",
      title: "Batterie de Popy à 73%",
      detail: "Environ 3h30 d’autonomie restante.",
      priority: "normal",
      read: true,
      archived: false,
      destination: role === "Enfant" ? "Mon Popy" : "Robot (optionnel)",
    },
  ])
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine)
    window.addEventListener("online", updateStatus)
    window.addEventListener("offline", updateStatus)
    return () => {
      window.removeEventListener("online", updateStatus)
      window.removeEventListener("offline", updateStatus)
    }
  }, [])

  const person =
    role === "Enfant"
      ? "Léo"
      : role === "Parent"
        ? "Sophie Martin"
        : role === "Enseignant"
          ? "Mme Leroy"
          : role === "AESH"
            ? "Alex Moreau"
            : "Administration"
  const initials =
    role === "Enfant"
      ? "LM"
      : role === "Parent"
        ? "SM"
        : role === "Enseignant"
          ? "CL"
          : role === "AESH"
            ? "AM"
            : "AD"
  const searchResults = navByRole[role].filter((item) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return false
    return (
      item.label.toLowerCase().includes(needle) ||
      t(item.label).toLowerCase().includes(needle)
    )
  })
  const unreadCount = notifications.filter(
    (notification) => !notification.read && !notification.archived,
  ).length
  const visibleNotifications = notifications.filter(
    (notification) =>
      !notification.archived &&
      (notificationFilter === "Toutes" ||
        (notificationFilter === "Non lues" && !notification.read) ||
        notification.category === notificationFilter),
  )
  return (
    <header className="relative z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white px-5 md:px-8">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="relative hidden w-full max-w-xs lg:block">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          placeholder={t("Rechercher une activité...")}
        />
        {query && (
          <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {searchResults.length ? (
              searchResults.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    onNavigate(label)
                    setQuery("")
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Icon size={16} />
                  {t(label)}
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-xs font-semibold text-slate-400">
                {t("Aucun résultat dans cet espace")}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-extrabold xl:flex ${
            online
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {online ? <Wifi size={14} /> : <WifiOff size={14} />}
          {online ? t("Synchronisé") : t("Mode hors ligne")}
        </div>
        <div className="hidden md:block">
          <RoleSwitcher role={role} setRole={setRole} />
        </div>
        <button
          onClick={() => {
            setNotificationsOpen(!notificationsOpen)
            setProfileOpen(false)
          }}
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          aria-label={t("Ouvrir les notifications")}
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-black text-white">
              {unreadCount}
            </span>
          )}
        </button>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <button
          onClick={() => {
            setProfileOpen(!profileOpen)
            setNotificationsOpen(false)
          }}
          className="flex items-center gap-2.5"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-xs font-extrabold text-amber-800">
            {initials}
          </span>
          <span className="hidden text-left xl:block">
            <span className="block text-sm font-extrabold text-slate-800">
              {person}
            </span>
            <span className="block text-[11px] font-semibold text-slate-400">
              {t(role)}
            </span>
          </span>
          <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
      {notificationsOpen && (
        <div className="absolute right-20 top-[70px] w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="font-display font-extrabold text-slate-800">
              {t("Notifications")}
            </span>
            <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-extrabold text-rose-600">
              {unreadCount} {t("nouvelle(s)")}
            </span>
          </div>
          <div className="mb-2 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {["Toutes", "Non lues", "Message", "Robot"].map((filter) => (
              <button
                key={filter}
                onClick={() => setNotificationFilter(filter)}
                className={`min-w-max rounded-lg px-2.5 py-1.5 text-[10px] font-black ${
                  notificationFilter === filter
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {t(filter)}
              </button>
            ))}
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {visibleNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex gap-3 rounded-xl p-3 ${
                  notification.read ? "bg-white" : "bg-indigo-50/70"
                }`}
              >
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    notification.priority === "important"
                      ? "bg-amber-400"
                      : "bg-indigo-500"
                  }`}
                />
                <button
                  onClick={() => {
                    setNotifications(
                      notifications.map((item) =>
                        item.id === notification.id
                          ? { ...item, read: true }
                          : item,
                      ),
                    )
                    if (
                      notification.destination &&
                      navByRole[role].some(
                        (item) => item.label === notification.destination,
                      )
                    ) {
                      onNavigate(notification.destination)
                      setNotificationsOpen(false)
                    }
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-xs font-black text-slate-700">
                    {notification.title}
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold leading-relaxed text-slate-400">
                    {notification.detail}
                  </span>
                  <span className="mt-1 block text-[9px] font-black uppercase text-indigo-500">
                    {notification.category}
                  </span>
                </button>
                <div className="flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                  {!notification.read && (
                    <button
                      onClick={() =>
                        setNotifications(
                          notifications.map((item) =>
                            item.id === notification.id
                              ? { ...item, read: true }
                              : item,
                          ),
                        )
                      }
                      className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600"
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setNotifications(
                        notifications.map((item) =>
                          item.id === notification.id
                            ? { ...item, archived: true }
                            : item,
                        ),
                      )
                    }
                    className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-400"
                  >
                    <Archive size={13} />
                  </button>
                </div>
              </div>
            ))}
            {!visibleNotifications.length && (
              <p className="p-6 text-center text-xs font-bold text-slate-400">
                {t("Aucune notification dans cette catégorie.")}
              </p>
            )}
          </div>
        </div>
      )}
      {profileOpen && (
        <div className="absolute right-5 top-[70px] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          {[
            "Mon compte",
            "Préférences",
            "Exporter mes données",
            "Imprimer cette vue",
            "Aide et sécurité",
          ].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Exporter mes données") {
                  const data = Object.fromEntries(
                    Object.keys(window.localStorage)
                      .filter((key) => key.startsWith("popy-academy:"))
                      .map((key) => [key, window.localStorage.getItem(key)]),
                  )
                  exportJson("popy-academy-sauvegarde.json", data)
                }
                if (item === "Imprimer cette vue") printCurrentView()
                setProfileOpen(false)
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              {t(item)}
            </button>
          ))}
          <div className="mt-1 grid grid-cols-3 gap-1 border-t border-slate-100 pt-2">
            {(["fr", "en", "es"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setLanguage(item)}
                className={`rounded-lg py-2 text-[10px] font-black uppercase ${
                  language === item
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileNav({
  role,
  active,
  setActive,
}: {
  role: Role
  active: string
  setActive: (label: string) => void
}) {
  const { t } = useI18n()
  return (
    <div className="overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
      <div className="flex min-w-max gap-1">
        {navByRole[role].map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold ${
              active === label
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500"
            }`}
          >
            <Icon size={15} />
            {t(label)}
          </button>
        ))}
      </div>
    </div>
  )
}

function PopyApplication() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [onboarded, setOnboarded] = usePersistentState("onboarded", false)
  const [role, setRole] = usePersistentState<Role>("current-role", "Enfant")
  const [active, setActive] = usePersistentState(
    "current-section",
    navByRole.Enfant[0].label,
  )

  const navigateToSection = (label: string, targetRole = role) => {
    setActive(label)
    navigate(`/${roleSlugs[targetRole]}/${sectionSlug(label)}`)
  }

  const changeRole = (nextRole: Role) => {
    setRole(nextRole)
    navigateToSection(navByRole[nextRole][0].label, nextRole)
  }

  useEffect(() => {
    const [roleSegment, sectionSegment] = location.pathname
      .split("/")
      .filter(Boolean)
    const routeRole = roleFromSlug(roleSegment)
    if (!routeRole) return
    const routeSection = navByRole[routeRole].find(
      (item) => sectionSlug(item.label) === sectionSegment,
    )
    setRole(routeRole)
    setActive(routeSection?.label ?? navByRole[routeRole][0].label)
  }, [location.pathname])

  const isDashboard = active === navByRole[role][0].label
  const interfaceProps = {
    active,
    isDashboard,
    setActive: navigateToSection,
  }

  if (!onboarded) {
    return (
      <Suspense fallback={<InterfaceLoader />}>
        <Onboarding
          onComplete={(profile) => {
            window.localStorage.setItem(
              "popy-academy:local-profile",
              JSON.stringify(profile),
            )
            setRole(profile.role)
            navigateToSection(navByRole[profile.role][0].label, profile.role)
            setOnboarded(true)
          }}
        />
      </Suspense>
    )
  }

  return (
    <>
      <a href="#contenu-principal" className="skip-link">
        {t("Aller au contenu principal")}
      </a>
      <div className="flex min-h-screen bg-[#f7f8fc] text-slate-800">
        <Sidebar role={role} active={active} setActive={navigateToSection} />
        <div className="min-w-0 flex-1">
          <Header
            role={role}
            setRole={changeRole}
            onNavigate={navigateToSection}
          />
          <div className="border-b border-slate-200 bg-white px-4 py-2 md:hidden">
            <RoleSwitcher role={role} setRole={changeRole} />
          </div>
          <MobileNav
            role={role}
            active={active}
            setActive={navigateToSection}
          />
          <main id="contenu-principal" tabIndex={-1}>
            <Suspense fallback={<InterfaceLoader />}>
              {role === "Enfant" && <ChildInterface {...interfaceProps} />}
              {role === "Parent" && <ParentInterface {...interfaceProps} />}
              {role === "Enseignant" && (
                <TeacherInterface {...interfaceProps} />
              )}
              {role === "AESH" && <AeshInterface {...interfaceProps} />}
              {role === "Admin" && <AdminInterface {...interfaceProps} />}
            </Suspense>
          </main>
        </div>
      </div>
      <Suspense fallback={null}>
        <GlobalTools role={role} onRoleChange={changeRole} />
        <SessionBootstrap />
      </Suspense>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "*",
    Component: PopyApplication,
  },
])

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ErrorBoundary>
  )
}

function InterfaceLoader() {
  return (
    <div className="mx-auto min-h-[60vh] max-w-[1500px] p-8">
      <div className="mb-6">
        <div className="h-4 w-32 animate-pulse rounded bg-indigo-100" />
        <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
