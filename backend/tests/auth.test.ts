import { describe, expect, it } from "vitest"
import * as OTPAuth from "otpauth"
import { getApp, prisma, registerAndLogin } from "./setup.js"

describe("Phase 2 — auth", () => {
  it("registers and logs in with email/password", async () => {
    const session = await registerAndLogin({
      email: "auth@example.invalid",
      display_name: "Auth User",
      role: "PARENT",
    })
    expect(session.token).toBeTruthy()
    expect(session.user.role).toBe("PARENT")
  })

  it("rejects bad password", async () => {
    const app = await getApp()
    await registerAndLogin({
      email: "bad@example.invalid",
      display_name: "Bad",
      role: "PARENT",
    })
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "bad@example.invalid", password: "wrong-password" },
    })
    expect(res.statusCode).toBe(401)
  })

  it("enrolls MFA and requires TOTP on login", async () => {
    const app = await getApp()
    const session = await registerAndLogin({
      email: "mfa@example.invalid",
      display_name: "MFA",
      role: "TEACHER",
    })

    const enroll = await app.inject({
      method: "POST",
      url: "/auth/mfa/enroll",
      headers: { authorization: `Bearer ${session.token}` },
    })
    expect(enroll.statusCode).toBe(200)
    const { secret } = enroll.json() as { secret: string }

    const totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })
    const token = totp.generate()

    const verify = await app.inject({
      method: "POST",
      url: "/auth/mfa/verify",
      headers: { authorization: `Bearer ${session.token}` },
      payload: { token },
    })
    expect(verify.statusCode).toBe(200)

    const loginWithout = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "mfa@example.invalid", password: "SecurePass123!" },
    })
    expect(loginWithout.statusCode).toBe(401)
    expect(loginWithout.json().error).toBe("mfa_required")

    const loginWith = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "mfa@example.invalid",
        password: "SecurePass123!",
        mfa_token: totp.generate(),
      },
    })
    expect(loginWith.statusCode).toBe(200)
  })

  it("rotates refresh tokens and detects reuse", async () => {
    const app = await getApp()
    const session = await registerAndLogin({
      email: "refresh@example.invalid",
      display_name: "Refresh",
      role: "PARENT",
    })

    const first = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: { refresh_token: session.refresh },
    })
    expect(first.statusCode).toBe(200)
    const rotated = first.json() as { refresh_token: string }

    const reuse = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: { refresh_token: session.refresh },
    })
    expect(reuse.statusCode).toBe(401)
    expect(reuse.json().error).toBe("refresh_reuse_detected")

    const second = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      payload: { refresh_token: rotated.refresh_token },
    })
    // family revoked after reuse
    expect(second.statusCode).toBe(401)

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: session.user.id },
    })
    expect(tokens.every((t) => t.revokedAt !== null)).toBe(true)
  })
})
