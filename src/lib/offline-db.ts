import { clear, createStore, del, entries, get, set } from "idb-keyval"

const dataStore = createStore("popy-academy-data", "app-data")
const queueStore = createStore("popy-academy-sync", "sync-queue")

export type ConflictStrategy =
  | "local"
  | "remote"
  | "merge"
  | "restrictive"
  | "manual"

export type ConflictEntityKind =
  | "progression"
  | "consent"
  | "permission"
  | "deletion"
  | "general"

export type SyncOperationStatus =
  | "pending"
  | "synced"
  | "conflict"
  | "rejected"

export type SyncOperation = {
  id: string
  entity: string
  action: "upsert" | "delete"
  payload: unknown
  createdAt: string
  status: SyncOperationStatus
  conflictReason?: string
  remotePayload?: unknown
  resolvedAt?: string
  resolutionStrategy?: ConflictStrategy
  requiresAdult?: boolean
}

const SENSITIVE_ENTITY_PATTERNS = [
  /consent/i,
  /permission/i,
  /privacy/i,
  /pin/i,
  /guardian/i,
]

const PROGRESSION_ENTITY_PATTERNS = [
  /xp/i,
  /stars/i,
  /progress/i,
  /level/i,
  /campaign/i,
  /game-stats/i,
  /done/i,
  /score/i,
]

export function classifyEntity(
  entity: string,
  action: SyncOperation["action"] = "upsert",
): ConflictEntityKind {
  if (action === "delete") return "deletion"
  if (SENSITIVE_ENTITY_PATTERNS.some((pattern) => pattern.test(entity))) {
    if (/consent/i.test(entity)) return "consent"
    return "permission"
  }
  if (PROGRESSION_ENTITY_PATTERNS.some((pattern) => pattern.test(entity))) {
    return "progression"
  }
  return "general"
}

export function getDefaultStrategy(
  kind: ConflictEntityKind,
): ConflictStrategy {
  switch (kind) {
    case "progression":
      return "merge"
    case "consent":
    case "permission":
    case "deletion":
      return "restrictive"
    default:
      return "manual"
  }
}

export function requiresAdultResolution(kind: ConflictEntityKind) {
  return (
    kind === "consent" ||
    kind === "permission" ||
    kind === "deletion" ||
    kind === "general"
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isRestrictiveBoolean(localValue: boolean, remoteValue: boolean) {
  return localValue && remoteValue
}

function mergeValues(localValue: unknown, remoteValue: unknown): unknown {
  if (typeof localValue === "number" && typeof remoteValue === "number") {
    return Math.max(localValue, remoteValue)
  }

  if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
    const merged = new Map<string, unknown>()
    for (const item of [...remoteValue, ...localValue]) {
      if (isPlainObject(item) && typeof item.id !== "undefined") {
        merged.set(String(item.id), item)
      } else {
        merged.set(JSON.stringify(item), item)
      }
    }
    return [...merged.values()]
  }

  if (isPlainObject(localValue) && isPlainObject(remoteValue)) {
    const keys = new Set([
      ...Object.keys(localValue),
      ...Object.keys(remoteValue),
    ])
    const result: Record<string, unknown> = {}
    for (const key of keys) {
      if (!(key in localValue)) {
        result[key] = remoteValue[key]
      } else if (!(key in remoteValue)) {
        result[key] = localValue[key]
      } else {
        result[key] = mergeValues(localValue[key], remoteValue[key])
      }
    }
    return result
  }

  return localValue
}

function restrictiveValues(localValue: unknown, remoteValue: unknown): unknown {
  if (typeof localValue === "boolean" && typeof remoteValue === "boolean") {
    return isRestrictiveBoolean(localValue, remoteValue)
  }

  if (typeof localValue === "string" && typeof remoteValue === "string") {
    const restrictiveStatuses = [
      "revoked",
      "denied",
      "rejected",
      "deleted",
      "blocked",
      "inactive",
    ]
    const localRank = restrictiveStatuses.indexOf(localValue.toLowerCase())
    const remoteRank = restrictiveStatuses.indexOf(remoteValue.toLowerCase())
    if (localRank >= 0 || remoteRank >= 0) {
      if (localRank < 0) return remoteValue
      if (remoteRank < 0) return localValue
      return localRank <= remoteRank ? localValue : remoteValue
    }
  }

  if (isPlainObject(localValue) && isPlainObject(remoteValue)) {
    const keys = new Set([
      ...Object.keys(localValue),
      ...Object.keys(remoteValue),
    ])
    const result: Record<string, unknown> = {}
    for (const key of keys) {
      if (!(key in localValue)) {
        result[key] = remoteValue[key]
      } else if (!(key in remoteValue)) {
        result[key] = localValue[key]
      } else {
        result[key] = restrictiveValues(localValue[key], remoteValue[key])
      }
    }
    return result
  }

  return remoteValue
}

export function resolveLocalConflict<T>(
  localValue: T,
  remoteValue: T,
  strategy: ConflictStrategy,
) {
  switch (strategy) {
    case "local":
      return localValue
    case "remote":
      return remoteValue
    case "merge":
      return mergeValues(localValue, remoteValue) as T
    case "restrictive":
      return restrictiveValues(localValue, remoteValue) as T
    case "manual":
      return localValue
  }
}

export function createSyncOperation(
  entity: string,
  payload: unknown,
  action: SyncOperation["action"] = "upsert",
): SyncOperation {
  const kind = classifyEntity(entity, action)
  return {
    id: crypto.randomUUID(),
    entity,
    action,
    payload,
    createdAt: new Date().toISOString(),
    status: "pending",
    requiresAdult: requiresAdultResolution(kind),
  }
}

export async function readLocalData<T>(key: string) {
  return get<T>(key, dataStore)
}

export async function writeLocalData<T>(key: string, value: T) {
  await set(key, value, dataStore)
}

export async function removeLocalData(key: string) {
  await del(key, dataStore)
}

export async function enqueueSync(
  entity: string,
  payload: unknown,
  action: SyncOperation["action"] = "upsert",
) {
  const operation = createSyncOperation(entity, payload, action)
  await set(operation.id, operation, queueStore)
  return operation
}

export async function getSyncQueue() {
  const queued = await entries<string, SyncOperation>(queueStore)
  return queued
    .map(([, operation]) => operation)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function getConflictOperations() {
  const queued = await getSyncQueue()
  return queued.filter((operation) => operation.status === "conflict")
}

export async function clearSyncedOperations() {
  const queued = await entries<string, SyncOperation>(queueStore)
  await Promise.all(
    queued
      .filter(([, operation]) => operation.status === "synced")
      .map(([key]) => del(key, queueStore)),
  )
}

export async function updateSyncStatus(
  id: string,
  status: SyncOperationStatus,
) {
  const operation = await get<SyncOperation>(id, queueStore)
  if (!operation) return
  await set(id, { ...operation, status }, queueStore)
}

export async function markOperationConflict(
  id: string,
  remotePayload: unknown,
  conflictReason = "Version distante différente de la version locale.",
) {
  const operation = await get<SyncOperation>(id, queueStore)
  if (!operation) return
  const kind = classifyEntity(operation.entity, operation.action)
  await set(
    id,
    {
      ...operation,
      status: "conflict",
      remotePayload,
      conflictReason,
      requiresAdult: requiresAdultResolution(kind),
    },
    queueStore,
  )
}

export async function markOperationRejected(
  id: string,
  conflictReason = "Opération rejetée par la politique serveur.",
) {
  const operation = await get<SyncOperation>(id, queueStore)
  if (!operation) return
  await set(
    id,
    {
      ...operation,
      status: "rejected",
      conflictReason,
      requiresAdult: true,
    },
    queueStore,
  )
}

export async function resolveSyncConflict(
  id: string,
  strategy: ConflictStrategy,
  options: { adultConfirmed?: boolean } = {},
) {
  const operation = await get<SyncOperation>(id, queueStore)
  if (!operation || operation.status !== "conflict") {
    return null
  }

  const kind = classifyEntity(operation.entity, operation.action)
  if (
    requiresAdultResolution(kind) &&
    strategy !== "restrictive" &&
    !options.adultConfirmed
  ) {
    throw new Error(
      "Un adulte doit confirmer la résolution de ce conflit sensible.",
    )
  }

  const remotePayload =
    operation.remotePayload === undefined
      ? operation.payload
      : operation.remotePayload
  const resolvedPayload = resolveLocalConflict(
    operation.payload,
    remotePayload,
    strategy === "manual" ? "local" : strategy,
  )

  if (operation.action === "delete" && strategy === "restrictive") {
    await removeLocalData(operation.entity)
  } else if (operation.action !== "delete") {
    await writeLocalData(operation.entity, resolvedPayload)
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          `popy-academy:${operation.entity}`,
          JSON.stringify(resolvedPayload),
        )
      } catch {
        // Keep IndexedDB as the source of truth if storage is unavailable.
      }
    }
  }

  const resolved: SyncOperation = {
    ...operation,
    payload: resolvedPayload,
    status: "synced",
    resolvedAt: new Date().toISOString(),
    resolutionStrategy: strategy,
  }
  await set(id, resolved, queueStore)
  return resolved
}

export async function autoResolveSafeConflicts() {
  const conflicts = await getConflictOperations()
  const resolved = []

  for (const operation of conflicts) {
    const kind = classifyEntity(operation.entity, operation.action)
    const strategy = getDefaultStrategy(kind)
    if (strategy === "manual" || requiresAdultResolution(kind)) continue
    const result = await resolveSyncConflict(operation.id, strategy, {
      adultConfirmed: false,
    })
    if (result) resolved.push(result)
  }

  return resolved
}

export async function markAllOperationsSynced() {
  const queued = await entries<string, SyncOperation>(queueStore)
  await Promise.all(
    queued.map(([key, operation]) =>
      set(key, { ...operation, status: "synced" }, queueStore),
    ),
  )
}

export async function simulateSyncPass() {
  const queued = await getSyncQueue()
  const pending = queued.filter((operation) => operation.status === "pending")
  const results = {
    synced: 0,
    conflict: 0,
    rejected: 0,
  }

  for (const [index, operation] of pending.entries()) {
    const kind = classifyEntity(operation.entity, operation.action)
    if (kind === "consent" || kind === "permission") {
      await markOperationConflict(
        operation.id,
        restrictiveValues(operation.payload, {
          status: "revoked",
          active: false,
        }),
        "Le serveur impose la décision la plus restrictive.",
      )
      results.conflict += 1
      continue
    }

    if (kind === "deletion") {
      await markOperationRejected(
        operation.id,
        "La suppression nécessite une confirmation adulte côté serveur.",
      )
      results.rejected += 1
      continue
    }

    if (kind === "progression" && index % 3 === 0) {
      await markOperationConflict(
        operation.id,
        mergeValues(operation.payload, typeof operation.payload === "number"
          ? Number(operation.payload) + 5
          : operation.payload),
        "Progression locale et distante divergentes.",
      )
      results.conflict += 1
      continue
    }

    if (kind === "general" && index % 4 === 0) {
      await markOperationConflict(
        operation.id,
        operation.payload,
        "Conflit général à trancher par un adulte.",
      )
      results.conflict += 1
      continue
    }

    await updateSyncStatus(operation.id, "synced")
    results.synced += 1
  }

  await autoResolveSafeConflicts()
  return results
}

export async function clearAllLocalData() {
  await Promise.all([clear(dataStore), clear(queueStore)])
}
