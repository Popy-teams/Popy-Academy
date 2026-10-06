const CACHE_NAME = "popy-academy-v3"
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon.svg",
  "/offline.html",
]
const CACHEABLE_EXTENSIONS = [
  ".js",
  ".css",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".woff2",
  ".webmanifest",
]

function isSelectiveCacheRequest(url) {
  try {
    const parsed = new URL(url)
    if (APP_SHELL.includes(parsed.pathname)) return true
    return CACHEABLE_EXTENSIONS.some((extension) =>
      parsed.pathname.endsWith(extension),
    )
  } catch {
    return false
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const requestUrl = event.request.url
  const cacheable = isSelectiveCacheRequest(requestUrl)

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (cacheable && response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        }
        return response
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cached) => cached || caches.match("/offline.html")),
      ),
  )
})
