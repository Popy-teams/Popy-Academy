import { getApiBaseUrl, loadStoredAuth, storeAuth, type AuthSession } from "./hybrid-sync"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = options
  const auth = token === undefined ? loadStoredAuth()?.access_token : token
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
      ...(headers as Record<string, string> | undefined),
    },
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string
    }
    throw new ApiError(
      payload.error || `Erreur API ${response.status}`,
      response.status,
      payload.error,
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export type ApiChild = {
  id: string
  display_name: string
  birth_year: number
  school_level: string
  avatar: string | null
  locale: string
  current_xp: number
  current_level: number
}

export async function fetchMyChildren() {
  return apiFetch<ApiChild[]>("/children")
}

export async function createChild(input: {
  display_name: string
  birth_year: number
  school_level: string
}) {
  return apiFetch<ApiChild>("/children", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export type SubscriptionPlan = {
  id: string
  code: string
  name: string
  description: string
  price_cents_month: number
  currency: string
  max_children: number
  computer_access: boolean
  robot_optional: boolean
  robot_included: boolean
  features: string[]
}

export type SubscriptionMe = {
  subscription: null | {
    id: string
    status: string
    access_mode: "COMPUTER" | "HYBRID"
    robot_enabled: boolean
    current_period_end: string
    cancel_at_period_end: boolean
    plan: SubscriptionPlan
  }
  effective_access: {
    mode: "COMPUTER" | "HYBRID"
    computer_ok: boolean
    robot_required: boolean
    robot_enabled: boolean
    plan: SubscriptionPlan | null
  }
}

export async function fetchSubscriptionPlans() {
  return apiFetch<{ principle: string; plans: SubscriptionPlan[] }>(
    "/subscriptions/plans",
  )
}

export async function fetchMySubscription() {
  return apiFetch<SubscriptionMe>("/subscriptions/me")
}

export async function subscribeToPlan(input: {
  plan_code: "ordinateur" | "famille" | "ecole"
  access_mode?: "COMPUTER" | "HYBRID"
  robot_enabled?: boolean
}) {
  return apiFetch("/subscriptions/subscribe", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export type CheckoutResult = {
  mode: "demo" | "stripe"
  checkout_id: string
  checkout_url: string | null
  demo_token?: string
  amount_cents: number
  currency: string
  plan_code: string
  note?: string
}

export async function startCheckout(plan_code: "famille" | "ecole") {
  return apiFetch<CheckoutResult>("/subscriptions/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan_code }),
  })
}

export async function confirmDemoCheckout(input: {
  checkout_id: string
  demo_token: string
}) {
  return apiFetch<{ paid: boolean; plan_code: string }>(
    "/subscriptions/billing/confirm",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  )
}

export async function updateSubscription(input: {
  access_mode?: "COMPUTER" | "HYBRID"
  robot_enabled?: boolean
  cancel_at_period_end?: boolean
}) {
  return apiFetch("/subscriptions/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  })
}

export function rememberSession(session: AuthSession) {
  storeAuth(session)
}
