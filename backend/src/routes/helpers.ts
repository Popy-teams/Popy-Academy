import type { FastifyReply, FastifyRequest } from "fastify"
import type { AuthUser, Permission } from "../lib/rbac.js"
import { assertPermission, writeAuditLog } from "../lib/rbac.js"
import { hashIp } from "../lib/auth.js"

export function requireAuth(request: FastifyRequest, reply: FastifyReply): AuthUser | null {
  if (!request.user) {
    reply.code(401).send({ error: "unauthorized" })
    return null
  }
  return request.user
}

export function requirePerm(
  request: FastifyRequest,
  reply: FastifyReply,
  permission: Permission,
): AuthUser | null {
  const user = requireAuth(request, reply)
  if (!user) return null
  try {
    assertPermission(user.role, permission)
    return user
  } catch {
    reply.code(403).send({ error: "forbidden" })
    return null
  }
}

export async function audit(
  request: FastifyRequest,
  action: string,
  resourceType: string,
  resourceId: string | null,
  result: string,
) {
  await writeAuditLog({
    actorUserId: request.user?.id,
    action,
    resourceType,
    resourceId,
    result,
    ipHash: hashIp(request.ip),
  })
}

export function getOperationId(request: FastifyRequest) {
  const header = request.headers["idempotency-key"] ?? request.headers["x-operation-id"]
  if (typeof header === "string" && header.length > 0) return header
  const body = request.body as { operation_id?: string } | undefined
  return body?.operation_id
}
