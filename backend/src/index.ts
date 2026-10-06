import { loadEnv } from "./lib/env.js"
import { buildApp } from "./app.js"

async function main() {
  const env = loadEnv()
  const app = await buildApp(env)
  await app.listen({ port: env.PORT, host: "0.0.0.0" })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
