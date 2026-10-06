// @vitest-environment jsdom
import "fake-indexeddb/auto"

import { beforeEach, describe, expect, it } from "vitest"

import {
  clearAllLocalData,
  enqueueSync,
  getSyncQueue,
  markOperationConflict,
  readLocalData,
  resolveSyncConflict,
  writeLocalData,
} from "./offline-db"
import {
  isSelectiveCacheRequest,
  requestServiceWorkerUpdate,
  shouldShowUpdatePrompt,
} from "./pwa"

describe("IndexedDB browser persistence", () => {
  beforeEach(async () => {
    await clearAllLocalData()
  })

  it("writes and reads values through IndexedDB", async () => {
    await writeLocalData("browser-child-stars", 1280)
    await expect(readLocalData("browser-child-stars")).resolves.toBe(1280)
  })

  it("queues sync operations and resolves conflicts", async () => {
    const operation = await enqueueSync("child-campaign-xp", 40)
    await markOperationConflict(operation.id, 55, "XP divergents")
    const resolved = await resolveSyncConflict(operation.id, "merge")
    expect(resolved?.status).toBe("synced")
    expect(resolved?.payload).toBe(55)
    await expect(readLocalData("child-campaign-xp")).resolves.toBe(55)
    const queue = await getSyncQueue()
    expect(queue.some((item) => item.id === operation.id)).toBe(true)
  })
})

describe("PWA browser helpers", () => {
  it("keeps API routes out of the selective cache", () => {
    expect(isSelectiveCacheRequest("/offline.html")).toBe(true)
    expect(isSelectiveCacheRequest("/assets/index.css")).toBe(true)
    expect(isSelectiveCacheRequest("/api/sync")).toBe(false)
  })

  it("asks a waiting service worker to activate", async () => {
    const messages: unknown[] = []
    const registration = {
      waiting: {
        postMessage: (value: unknown) => messages.push(value),
      },
    }
    expect(shouldShowUpdatePrompt(registration)).toBe(true)
    await expect(requestServiceWorkerUpdate(registration)).resolves.toBe(true)
    expect(messages).toEqual([{ type: "SKIP_WAITING" }])
  })
})
