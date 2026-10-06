import type { WebSocket } from "ws"
import type { UserRole } from "@prisma/client"

export type RealtimeEvent = {
  type: "message" | "notification" | "robot" | "sync" | "activity" | "accommodation"
  roles?: UserRole[]
  userIds?: string[]
  payload: unknown
}

type Client = {
  socket: WebSocket
  userId: string
  role: UserRole
}

const clients = new Set<Client>()

export function addRealtimeClient(client: Client) {
  clients.add(client)
  client.socket.on("close", () => clients.delete(client))
}

export function broadcast(event: RealtimeEvent) {
  const message = JSON.stringify(event)
  for (const client of clients) {
    if (event.userIds?.length && !event.userIds.includes(client.userId)) continue
    if (event.roles?.length && !event.roles.includes(client.role)) continue
    if (client.socket.readyState === 1) {
      client.socket.send(message)
    }
  }
}

export function realtimeClientCount() {
  return clients.size
}

/** Clear clients between tests */
export function resetRealtimeClients() {
  clients.clear()
}
