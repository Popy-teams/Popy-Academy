// @vitest-environment jsdom
import "fake-indexeddb/auto"

import { beforeEach, describe, expect, it, vi } from "vitest"

import { pushSyncQueue } from "./hybrid-sync"
import {
  clearAllLocalData,
  enqueueSync,
  getSyncQueue,
} from "./offline-db"

describe("hybrid sync adapter", () => {
  beforeEach(async () => {
    await clearAllLocalData()
    vi.restoreAllMocks()
  })

  it("marks operations from the backend response", async () => {
    await enqueueSync("child-stars", 10)
    const pending = await getSyncQueue()

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [
            {
              id: pending[0].id,
              status: "synced",
              server_timestamp: "2026-10-05T10:00:00.000Z",
            },
          ],
        }),
      }),
    )

    const result = await pushSyncQueue("http://api.test")
    expect(result).toEqual({
      synced: 1,
      conflict: 0,
      rejected: 0,
      offline: false,
    })
    const queue = await getSyncQueue()
    expect(queue[0].status).toBe("synced")
  })

  it("sends Authorization when a session is stored", async () => {
    await enqueueSync("child-stars", 10)
    localStorage.setItem(
      "popy-academy-auth",
      JSON.stringify({
        access_token: "test-token",
        refresh_token: "r",
        expires_in: 900,
        user: { id: "1", email: "a@b.c", display_name: "A", role: "PARENT" },
      }),
    )
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    })
    vi.stubGlobal("fetch", fetchMock)
    await pushSyncQueue("http://api.test")
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer test-token",
    )
  })

  it("reports offline when the backend cannot be reached", async () => {
    await enqueueSync("child-stars", 12)
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    )
    await expect(pushSyncQueue("http://api.test")).resolves.toEqual({
      synced: 0,
      conflict: 0,
      rejected: 0,
      offline: true,
    })
  })
})
