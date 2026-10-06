import { describe, expect, it } from "vitest"
import * as OTPAuth from "otpauth"
import { buildApp } from "../src/app.js"
import { loadEnv } from "../src/lib/env.js"
import { getApp, prisma, registerAndLogin, testEnv } from "./setup.js"

describe("MFA enforcement + billing", () => {
  it("blocks teacher API until MFA is enabled when required", async () => {
    const strictEnv = loadEnv({
      ...process.env,
      DATABASE_URL: testEnv.DATABASE_URL,
      JWT_ACCESS_SECRET: testEnv.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: testEnv.JWT_REFRESH_SECRET,
      JWT_ACCESS_TTL_SECONDS: String(testEnv.JWT_ACCESS_TTL_SECONDS),
      JWT_REFRESH_TTL_SECONDS: String(testEnv.JWT_REFRESH_TTL_SECONDS),
      MFA_ISSUER: testEnv.MFA_ISSUER,
      PORT: String(testEnv.PORT),
      APP_ORIGIN: testEnv.APP_ORIGIN,
      NODE_ENV: "test",
      RETENTION_AUDIT_DAYS: String(testEnv.RETENTION_AUDIT_DAYS),
      RETENTION_SYNC_DAYS: String(testEnv.RETENTION_SYNC_DAYS),
      RETENTION_ROBOT_EVENTS_DAYS: String(testEnv.RETENTION_ROBOT_EVENTS_DAYS),
      BILLING_MODE: "demo",
      MFA_REQUIRED_ROLES: "TEACHER,ADMIN",
      RUN_SEED: "false",
    })
    const app = await buildApp(strictEnv)
    await app.ready()

    await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "teacher-mfa@example.invalid",
        password: "SecurePass123!",
        display_name: "Teacher MFA",
        role: "TEACHER",
      },
    })
    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "teacher-mfa@example.invalid",
        password: "SecurePass123!",
      },
    })
    expect(login.statusCode).toBe(200)
    expect(login.json().mfa_setup_required).toBe(true)
    const token = login.json().access_token as string

    const blocked = await app.inject({
      method: "GET",
      url: "/robots",
      headers: { authorization: `Bearer ${token}` },
    })
    expect(blocked.statusCode).toBe(403)
    expect(blocked.json().error).toBe("mfa_setup_required")

    const enroll = await app.inject({
      method: "POST",
      url: "/auth/mfa/enroll",
      headers: { authorization: `Bearer ${token}` },
    })
    const secret = enroll.json().secret as string
    const totp = new OTPAuth.TOTP({
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })
    await app.inject({
      method: "POST",
      url: "/auth/mfa/verify",
      headers: { authorization: `Bearer ${token}` },
      payload: { token: totp.generate() },
    })

    // New login after MFA enabled
    const login2 = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "teacher-mfa@example.invalid",
        password: "SecurePass123!",
        mfa_token: totp.generate(),
      },
    })
    expect(login2.json().mfa_setup_required).toBe(false)

    await app.close()
  })

  it("runs demo checkout then confirms paid family plan", async () => {
    await prisma.subscriptionPlan.create({
      data: {
        code: "famille",
        name: "Famille",
        description: "Family",
        priceCentsMonth: 1299,
        maxChildren: 5,
        computerAccess: true,
        robotOptional: true,
        robotIncluded: false,
        features: ["multi"],
        sortOrder: 2,
      },
    })
    await prisma.subscriptionPlan.create({
      data: {
        code: "ordinateur",
        name: "Ordinateur",
        description: "PC",
        priceCentsMonth: 0,
        maxChildren: 2,
        computerAccess: true,
        robotOptional: true,
        robotIncluded: false,
        features: ["pc"],
        sortOrder: 1,
      },
    })

    const app = await getApp()
    const parent = await registerAndLogin({
      email: "bill@example.invalid",
      display_name: "Bill",
      role: "PARENT",
    })

    const checkout = await app.inject({
      method: "POST",
      url: "/subscriptions/billing/checkout",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: { plan_code: "famille" },
    })
    expect(checkout.statusCode).toBe(200)
    expect(checkout.json().mode).toBe("demo")
    const { checkout_id, demo_token } = checkout.json() as {
      checkout_id: string
      demo_token: string
    }

    const confirm = await app.inject({
      method: "POST",
      url: "/subscriptions/billing/confirm",
      headers: { authorization: `Bearer ${parent.token}` },
      payload: { checkout_id, demo_token },
    })
    expect(confirm.statusCode).toBe(200)
    expect(confirm.json().paid).toBe(true)
    expect(confirm.json().robot_required).toBe(false)

    const me = await app.inject({
      method: "GET",
      url: "/subscriptions/me",
      headers: { authorization: `Bearer ${parent.token}` },
    })
    expect(me.json().subscription.plan.code).toBe("famille")
  })
})
