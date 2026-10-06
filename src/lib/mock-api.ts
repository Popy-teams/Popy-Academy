export type MockApiOptions = {
  latency?: number
  shouldFail?: boolean
  offline?: boolean
}

export class MockApiError extends Error {
  constructor(
    message: string,
    public code: "OFFLINE" | "SERVER_ERROR",
  ) {
    super(message)
  }
}

export async function mockRequest<T>(
  data: T,
  options: MockApiOptions = {},
): Promise<T> {
  const { latency = 450, shouldFail = false, offline = false } = options
  await new Promise((resolve) => globalThis.setTimeout(resolve, latency))

  if (offline) {
    throw new MockApiError(
      "La ressource reste disponible depuis le cache local.",
      "OFFLINE",
    )
  }

  if (shouldFail) {
    throw new MockApiError(
      "Le service simulé n’a pas répondu. Réessayez.",
      "SERVER_ERROR",
    )
  }

  return structuredClone(data)
}
