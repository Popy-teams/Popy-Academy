import { createHash, randomBytes } from "node:crypto"
import * as argon2 from "argon2"
import { SignJWT, jwtVerify } from "jose"
import * as OTPAuth from "otpauth"
import type { User, UserRole } from "@prisma/client"
import type { Env } from "./env.js"

export type AccessClaims = {
  sub: string
  role: UserRole
  sid: string
  typ: "access"
}

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id })
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password)
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function generateRefreshToken() {
  return randomBytes(48).toString("base64url")
}

export function hashIp(ip?: string) {
  if (!ip) return null
  return createHash("sha256").update(ip).digest("hex").slice(0, 32)
}

function secretKey(secret: string) {
  return new TextEncoder().encode(secret)
}

export async function signAccessToken(
  env: Env,
  user: Pick<User, "id" | "role">,
  sessionId: string,
) {
  return new SignJWT({
    role: user.role,
    sid: sessionId,
    typ: "access",
  } satisfies Omit<AccessClaims, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${env.JWT_ACCESS_TTL_SECONDS}s`)
    .sign(secretKey(env.JWT_ACCESS_SECRET))
}

export async function verifyAccessToken(env: Env, token: string) {
  const { payload } = await jwtVerify(token, secretKey(env.JWT_ACCESS_SECRET))
  if (payload.typ !== "access" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token")
  }
  return {
    sub: payload.sub,
    role: payload.role as UserRole,
    sid: String(payload.sid),
    typ: "access" as const,
  }
}

export function createTotpSecret(env: Env, email: string) {
  const secret = new OTPAuth.Secret({ size: 20 })
  const totp = new OTPAuth.TOTP({
    issuer: env.MFA_ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  })
  return {
    secret: secret.base32,
    uri: totp.toString(),
  }
}

export function verifyTotp(secret: string, token: string) {
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
  const delta = totp.validate({ token, window: 1 })
  return delta !== null
}

/** Parental PIN is client-side only — documented helper, not server auth. */
export const PARENTAL_PIN_NOTE =
  "Le code PIN parental est stocké et vérifié uniquement côté client (IndexedDB). Il ne constitue pas une authentification serveur."
