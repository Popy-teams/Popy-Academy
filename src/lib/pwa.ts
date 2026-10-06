export const APP_SHELL_PATHS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg",
  "/offline.html",
] as const

export const CACHEABLE_EXTENSIONS = [
  ".js",
  ".css",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".woff2",
  ".webmanifest",
] as const

export function isSelectiveCacheRequest(url: string) {
  try {
    const parsed = new URL(url, "http://localhost")
    if (APP_SHELL_PATHS.includes(parsed.pathname as (typeof APP_SHELL_PATHS)[number])) {
      return true
    }
    return CACHEABLE_EXTENSIONS.some((extension) =>
      parsed.pathname.endsWith(extension),
    )
  } catch {
    return false
  }
}

export function shouldShowUpdatePrompt(registration: {
  waiting?: unknown
} | null) {
  return Boolean(registration?.waiting)
}

export async function requestServiceWorkerUpdate(
  registration: {
    waiting?: { postMessage: (value: unknown) => void }
  } | null,
) {
  if (!registration?.waiting) return false
  registration.waiting.postMessage({ type: "SKIP_WAITING" })
  return true
}
