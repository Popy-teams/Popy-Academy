import type { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type { AuthUser } from "../lib/rbac.js"
import { userCanAccessChild } from "../lib/rbac.js"

export type SyncOpInput = {
  id: string
  entity: string
  action: string
  payload: unknown
  client_timestamp: string
  device_id?: string
}

export type SyncResult = {
  id: string
  status: "synced" | "conflict" | "rejected"
  conflict_reason?: string
  remote_payload?: unknown
}

function classifyEntity(entity: string, action: string) {
  if (action === "delete") return "deletion" as const
  if (/consent|permission|privacy|pin|guardian/i.test(entity)) {
    return /consent/i.test(entity) ? ("consent" as const) : ("permission" as const)
  }
  if (/xp|stars|progress|level|campaign|game-stats|score/i.test(entity)) {
    return "progression" as const
  }
  return "general" as const
}

function mergePayload(localValue: unknown, remoteValue: unknown, kind: string) {
  if (
    kind === "progression" &&
    typeof localValue === "number" &&
    typeof remoteValue === "number"
  ) {
    return Math.max(localValue, localValue === remoteValue ? localValue : Math.max(localValue, remoteValue))
  }
  if (kind === "consent" || kind === "permission" || kind === "deletion") {
    return remoteValue ?? localValue
  }
  return localValue
}

async function applyProgression(
  entity: string,
  payload: Record<string, unknown>,
  childId?: string,
) {
  if (!childId) return payload
  if (entity.includes("xp") && typeof payload.value === "number") {
    const child = await prisma.childProfile.findUnique({ where: { id: childId } })
    if (!child) return payload
    const merged = Math.max(child.currentXp, payload.value)
    await prisma.childProfile.update({
      where: { id: childId },
      data: { currentXp: merged },
    })
    return { ...payload, value: merged, remote_value: child.currentXp }
  }
  if (entity.includes("level") && typeof payload.value === "number") {
    const child = await prisma.childProfile.findUnique({ where: { id: childId } })
    if (!child) return payload
    const merged = Math.max(child.currentLevel, payload.value)
    await prisma.childProfile.update({
      where: { id: childId },
      data: { currentLevel: merged },
    })
    return { ...payload, value: merged, remote_value: child.currentLevel }
  }
  return payload
}

export async function processSyncOperations(
  user: AuthUser | null,
  operations: SyncOpInput[],
): Promise<SyncResult[]> {
  const results: SyncResult[] = []

  for (const op of operations) {
    const existing = await prisma.syncOperation.findUnique({
      where: { operationId: op.id },
    })
    if (existing) {
      results.push({
        id: op.id,
        status:
          existing.status === "SYNCED"
            ? "synced"
            : existing.status === "CONFLICT"
              ? "conflict"
              : "rejected",
        conflict_reason: existing.conflictReason ?? undefined,
        remote_payload: existing.remotePayload ?? undefined,
      })
      continue
    }

    const kind = classifyEntity(op.entity, op.action)
    const payload =
      op.payload && typeof op.payload === "object"
        ? (op.payload as Record<string, unknown>)
        : { value: op.payload }

    const childId =
      typeof payload.child_id === "string"
        ? payload.child_id
        : typeof payload.childId === "string"
          ? payload.childId
          : undefined

    if (user && childId) {
      const allowed = await userCanAccessChild(user, childId)
      if (!allowed) {
        await prisma.syncOperation.create({
          data: {
            operationId: op.id,
            deviceId: op.device_id,
            userId: user.id,
            entityType: op.entity,
            entityId: childId,
            operation: op.action,
            payload: payload as Prisma.InputJsonValue,
            clientTimestamp: new Date(op.client_timestamp),
            status: "REJECTED",
            conflictReason: "permission_denied",
          },
        })
        results.push({
          id: op.id,
          status: "rejected",
          conflict_reason: "permission_denied",
        })
        continue
      }
    }

    if (kind === "consent" || kind === "permission" || kind === "deletion") {
      const remote = payload.remote_value ?? payload.server_value
      if (remote !== undefined && remote !== payload.value) {
        await prisma.syncOperation.create({
          data: {
            operationId: op.id,
            deviceId: op.device_id,
            userId: user?.id,
            entityType: op.entity,
            entityId: childId,
            operation: op.action,
            payload: payload as Prisma.InputJsonValue,
            clientTimestamp: new Date(op.client_timestamp),
            status: "CONFLICT",
            conflictReason: "restrictive_server_wins",
            remotePayload: remote as Prisma.InputJsonValue,
          },
        })
        results.push({
          id: op.id,
          status: "conflict",
          conflict_reason: "restrictive_server_wins",
          remote_payload: remote,
        })
        continue
      }
    }

    let applied = payload
    if (kind === "progression" && childId) {
      applied = (await applyProgression(op.entity, payload, childId)) as Record<
        string,
        unknown
      >
      if (
        typeof payload.value === "number" &&
        typeof applied.remote_value === "number" &&
        applied.remote_value !== payload.value &&
        applied.value !== payload.value
      ) {
        // merged — still synced
      } else if (
        typeof payload.value === "number" &&
        typeof applied.remote_value === "number" &&
        applied.remote_value > payload.value
      ) {
        await prisma.syncOperation.create({
          data: {
            operationId: op.id,
            deviceId: op.device_id,
            userId: user?.id,
            entityType: op.entity,
            entityId: childId,
            operation: op.action,
            payload: payload as Prisma.InputJsonValue,
            clientTimestamp: new Date(op.client_timestamp),
            status: "CONFLICT",
            conflictReason: "progression_merge",
            remotePayload: { value: applied.value } as Prisma.InputJsonValue,
          },
        })
        results.push({
          id: op.id,
          status: "conflict",
          conflict_reason: "progression_merge",
          remote_payload: { value: applied.value },
        })
        continue
      }
    }

    const mergedValue = mergePayload(
      payload.value,
      applied.remote_value,
      kind,
    )

    await prisma.syncOperation.create({
      data: {
        operationId: op.id,
        deviceId: op.device_id,
        userId: user?.id,
        entityType: op.entity,
        entityId: childId,
        operation: op.action,
        payload: { ...payload, value: mergedValue } as Prisma.InputJsonValue,
        clientTimestamp: new Date(op.client_timestamp),
        status: "SYNCED",
      },
    })

    results.push({ id: op.id, status: "synced" })
  }

  return results
}
