import { afterAll, beforeAll, beforeEach } from "vitest"
import { PrismaClient } from "@prisma/client"
import { loadEnv } from "../src/lib/env.js"
import { buildApp } from "../src/app.js"
import type { FastifyInstance } from "fastify"
import { resetRealtimeClients } from "../src/services/realtime.js"

export const testEnv = loadEnv({
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://popy:popy@localhost:5432/popy_academy?schema=public",
  JWT_ACCESS_SECRET: "test-access-secret-change-me-32chars",
  JWT_REFRESH_SECRET: "test-refresh-secret-change-me-32chars",
  JWT_ACCESS_TTL_SECONDS: "900",
  JWT_REFRESH_TTL_SECONDS: "604800",
  MFA_ISSUER: "Popy Academy Test",
  PORT: "5001",
  APP_ORIGIN: "http://localhost:8443",
  NODE_ENV: "test",
  RETENTION_AUDIT_DAYS: "365",
  RETENTION_SYNC_DAYS: "90",
  RETENTION_ROBOT_EVENTS_DAYS: "180",
  BILLING_MODE: "demo",
  MFA_REQUIRED_ROLES: "",
})

export const prisma = new PrismaClient({
  datasources: { db: { url: testEnv.DATABASE_URL } },
})

let app: FastifyInstance

export async function getApp() {
  if (!app) {
    app = await buildApp(testEnv)
    await app.ready()
  }
  return app
}

export async function resetDb() {
  await prisma.auditLog.deleteMany()
  await prisma.syncOperation.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.subscriptionPlan.deleteMany()
  await prisma.robotEvent.deleteMany()
  await prisma.robotPairing.deleteMany()
  await prisma.robotDevice.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.observation.deleteMany()
  await prisma.accommodation.deleteMany()
  await prisma.accessibilityProfile.deleteMany()
  await prisma.competencyEvidence.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.learningContent.deleteMany()
  await prisma.competency.deleteMany()
  await prisma.staffAssignment.deleteMany()
  await prisma.classMembership.deleteMany()
  await prisma.class.deleteMany()
  await prisma.school.deleteMany()
  await prisma.guardianship.deleteMany()
  await prisma.childProfile.deleteMany()
  await prisma.mfaSecret.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  resetRealtimeClients()
}

export async function registerAndLogin(input: {
  email: string
  password?: string
  display_name: string
  role: "PARENT" | "TEACHER" | "AESH" | "ADMIN"
}) {
  const api = await getApp()
  const password = input.password ?? "SecurePass123!"
  await api.inject({
    method: "POST",
    url: "/auth/register",
    payload: {
      email: input.email,
      password,
      display_name: input.display_name,
      role: input.role,
    },
  })
  const login = await api.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: input.email, password },
  })
  const body = login.json()
  return {
    token: body.access_token as string,
    refresh: body.refresh_token as string,
    user: body.user as { id: string; role: string; email: string },
  }
}

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await resetDb()
})

afterAll(async () => {
  if (app) await app.close()
  await prisma.$disconnect()
})
