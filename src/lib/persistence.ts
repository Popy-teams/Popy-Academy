import { useEffect, useState } from "react"

import { enqueueSync, readLocalData, writeLocalData } from "./offline-db"

const PREFIX = "popy-academy:"

export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
) {
  const [value, setValue] = useState<T>(() => {
    let fallback: T
    if (typeof initialValue === "function") {
      const createInitialValue = initialValue as () => T
      fallback = createInitialValue()
    } else {
      fallback = initialValue
    }

    try {
      const stored = window.localStorage.getItem(`${PREFIX}${key}`)
      return stored ? JSON.parse(stored) as T : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    let cancelled = false
    readLocalData<T>(key).then((stored) => {
      if (!cancelled && stored !== undefined) setValue(stored)
    })
    return () => {
      cancelled = true
    }
  }, [key])

  useEffect(() => {
    try {
      window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
    } catch {
      // Keep the interface usable if local storage is unavailable.
    }
    writeLocalData(key, value).catch(() => undefined)
    enqueueSync(key, value).catch(() => undefined)
  }, [key, value])

  return [value, setValue] as const
}

export function clearLocalPopyData() {
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => window.localStorage.removeItem(key))
}
