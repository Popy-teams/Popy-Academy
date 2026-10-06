import type { UserRole } from "@prisma/client"
import { prisma } from "./prisma.js"

export type AuthUser = {
  id: string
  role: UserRole
  email: string | null
  displayName: string
  mfaEnabled?: boolean
}

export type Permission =
  | "profile:read"
  | "profile:write"
  | "child:read"
  | "child:write"
  | "class:read"
  | "class:write"
  | "assignment:read"
  | "assignment:write"
  | "content:read"
  | "content:write"
  | "activity:read"
  | "activity:write"
  | "competency:read"
  | "competency:write"
  | "accommodation:read"
  | "accommodation:write"
  | "observation:read"
  | "observation:write"
  | "message:read"
  | "message:write"
  | "notification:read"
  | "consent:read"
  | "consent:write"
  | "robot:read"
  | "robot:write"
  | "robot:emergency"
  | "export:own"
  | "export:institution"
  | "privacy:erase"
  | "audit:read"
  | "admin:manage"
  | "subscription:read"
  | "subscription:write"

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CHILD: [
    "profile:read",
    "child:read",
    "content:read",
    "activity:read",
    "activity:write",
    "competency:read",
    "message:read",
    "notification:read",
    "subscription:read",
  ],
  PARENT: [
    "profile:read",
    "profile:write",
    "child:read",
    "child:write",
    "activity:read",
    "competency:read",
    "accommodation:read",
    "observation:read",
    "message:read",
    "message:write",
    "notification:read",
    "consent:read",
    "consent:write",
    "export:own",
    "privacy:erase",
    "subscription:read",
    "subscription:write",
  ],
  TEACHER: [
    "profile:read",
    "profile:write",
    "child:read",
    "class:read",
    "assignment:read",
    "assignment:write",
    "content:read",
    "content:write",
    "activity:read",
    "activity:write",
    "competency:read",
    "competency:write",
    "accommodation:read",
    "accommodation:write",
    "observation:read",
    "observation:write",
    "message:read",
    "message:write",
    "notification:read",
    "robot:read",
    "robot:write",
    "robot:emergency",
    "export:own",
    "subscription:read",
  ],
  AESH: [
    "profile:read",
    "child:read",
    "activity:read",
    "accommodation:read",
    "observation:read",
    "observation:write",
    "message:read",
    "message:write",
    "notification:read",
    "subscription:read",
  ],
  ADMIN: [
    "profile:read",
    "profile:write",
    "child:read",
    "class:read",
    "class:write",
    "assignment:read",
    "assignment:write",
    "content:read",
    "content:write",
    "activity:read",
    "competency:read",
    "message:read",
    "message:write",
    "notification:read",
    "robot:read",
    "robot:write",
    "robot:emergency",
    "export:institution",
    "audit:read",
    "admin:manage",
    "subscription:read",
    "subscription:write",
  ],
}

export function hasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export function assertPermission(role: UserRole, permission: Permission) {
  if (!hasPermission(role, permission)) {
    const error = new Error("Forbidden")
    ;(error as Error & { statusCode: number }).statusCode = 403
    throw error
  }
}

export async function userCanAccessChild(user: AuthUser, childId: string) {
  if (user.role === "ADMIN") return true

  if (user.role === "PARENT") {
    const link = await prisma.guardianship.findFirst({
      where: {
        childId,
        guardianUserId: user.id,
        OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }],
      },
    })
    return Boolean(link)
  }

  if (user.role === "TEACHER" || user.role === "AESH") {
    const direct = await prisma.staffAssignment.findFirst({
      where: {
        userId: user.id,
        childId,
        OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }],
      },
    })
    if (direct) return true

    const viaClass = await prisma.staffAssignment.findFirst({
      where: {
        userId: user.id,
        OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }],
        class: {
          memberships: { some: { childId } },
        },
      },
    })
    return Boolean(viaClass)
  }

  return false
}

export async function writeAuditLog(input: {
  actorUserId?: string | null
  action: string
  resourceType: string
  resourceId?: string | null
  result: string
  ipHash?: string | null
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      result: input.result,
      ipHash: input.ipHash ?? null,
    },
  })
}
