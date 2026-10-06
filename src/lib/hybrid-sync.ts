import {
  getSyncQueue,
  markOperationConflict,
  markOperationRejected,
  updateSyncStatus,
  type SyncOperation,
} from "./offline-db"

export type SyncPushResult = {
  synced: number
  conflict: number
  rejected: number
  offline: boolean
}

export type AuthSession = {
  access_token: string
  refresh_token: string
  expires_in: number
  mfa_setup_required?: boolean
  user: {
    id: string
    email: string | null
    display_name: string
    role: string
    mfa_enabled?: boolean
  }
}

const AUTH_STORAGE_KEY = "popy-academy-auth"

const defaultApiBase =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL)
    : "http://localhost:5001"

export function getApiBaseUrl() {
  return defaultApiBase
}

export function loadStoredAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function storeAuth(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export async function checkApiHealth(apiBase = getApiBaseUrl()) {
  try {
    const response = await fetch(`${apiBase}/health`)
    if (!response.ok) return false
    const payload = (await response.json()) as { status?: string }
    return payload.status === "ok"
  } catch {
    return false
  }
}

/** Adult auth against the real API (email + password + optional MFA). */
export async function loginAdult(
  input: { email: string; password: string; mfa_token?: string },
  apiBase = getApiBaseUrl(),
): Promise<AuthSession> {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(error.error || "Authentification impossible")
  }
  const session = (await response.json()) as AuthSession
  storeAuth(session)
  return session
}

/** Demo convenience: login with seeded parent account when available. */
export async function demoLogin(apiBase = getApiBaseUrl()) {
  const session = await loginAdult(
    {
      email: "parent.demo@example.invalid",
      password: "DemoPassw0rd!",
    },
    apiBase,
  )
  return {
    token: session.access_token,
    user: {
      id: session.user.id,
      display_name: session.user.display_name,
      role: session.user.role,
    },
  }
}

export async function pushSyncQueue(
  apiBase = getApiBaseUrl(),
  accessToken?: string,
): Promise<SyncPushResult> {
  const queue = await getSyncQueue()
  const pending = queue.filter((operation) => operation.status === "pending")

  if (!pending.length) {
    return { synced: 0, conflict: 0, rejected: 0, offline: false }
  }

  const token = accessToken ?? loadStoredAuth()?.access_token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${apiBase}/sync`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        operations: pending.map((operation) => ({
          id: operation.id,
          entity: operation.entity,
          action: operation.action,
          payload: operation.payload,
          client_timestamp: operation.createdAt,
        })),
      }),
    })
  } catch {
    return { synced: 0, conflict: 0, rejected: 0, offline: true }
  }

  if (!response.ok) {
    throw new Error("Le backend a refusé la synchronisation")
  }

  const payload = (await response.json()) as {
    results: Array<{
      id: string
      status: "synced" | "conflict" | "rejected"
      conflict_reason?: string
      remote_payload?: unknown
    }>
  }

  let synced = 0
  let conflict = 0
  let rejected = 0

  for (const result of payload.results) {
    if (result.status === "synced") {
      await updateSyncStatus(result.id, "synced")
      synced += 1
      continue
    }
    if (result.status === "rejected") {
      await markOperationRejected(
        result.id,
        result.conflict_reason || "Opération rejetée par le serveur.",
      )
      rejected += 1
      continue
    }
    const local = pending.find((item: SyncOperation) => item.id === result.id)
    await markOperationConflict(
      result.id,
      result.remote_payload ?? local?.payload,
      result.conflict_reason || "Conflit détecté par le serveur.",
    )
    conflict += 1
  }

  return { synced, conflict, rejected, offline: false }
}
