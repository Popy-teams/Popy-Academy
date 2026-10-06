import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().default(604800),
  MFA_ISSUER: z.string().default("Popy Academy"),
  PORT: z.coerce.number().default(5001),
  APP_ORIGIN: z.string().default("http://localhost:8443"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  RETENTION_AUDIT_DAYS: z.coerce.number().default(365),
  RETENTION_SYNC_DAYS: z.coerce.number().default(90),
  RETENTION_ROBOT_EVENTS_DAYS: z.coerce.number().default(180),
  BILLING_MODE: z.enum(["demo", "stripe"]).default("demo"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RUN_SEED: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => {
      if (typeof v === "boolean") return v
      if (v === undefined) return true
      return v !== "false" && v !== "0"
    }),
  MFA_REQUIRED_ROLES: z.string().default("TEACHER,ADMIN"),
})

export type Env = z.infer<typeof envSchema>

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`)
  }
  return parsed.data
}
