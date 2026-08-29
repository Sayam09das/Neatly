import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { logInfo } from "../logger.ts";
import type { AdminDomainEvent, CustomerRealtimeEvent } from "./event-types.ts";

export interface AdminSseConnection {
  adminId: string;
  close: () => void;
  comment: (text: string) => void;
  id: string;
  send: (eventName: string, payload: unknown) => void;
}

const connections = new Map<string, AdminSseConnection>();
const connectionsByAdmin = new Map<string, Set<string>>();

export function connectAdminSse(
  adminId: string,
  req: IncomingMessage,
  res: ServerResponse,
): AdminSseConnection {
  const id = randomUUID();
  const connection: AdminSseConnection = {
    adminId,
    close: (): void => {
      if (!res.writableEnded) {
        res.end();
      }
      disconnectAdminSse(id);
    },
    comment: (text: string): void => {
      if (!res.writableEnded) {
        res.write(`: ${text}\n\n`);
      }
    },
    id,
    send: (eventName: string, payload: unknown): void => {
      if (res.writableEnded) {
        return;
      }

      const data = JSON.stringify(payload);
      res.write(
        `event: ${eventName}\nid: ${readEventId(payload)}\ndata: ${data}\n\n`,
      );
    },
  };

  connections.set(id, connection);
  const adminSet = connectionsByAdmin.get(adminId) ?? new Set<string>();
  adminSet.add(id);
  connectionsByAdmin.set(adminId, adminSet);

  req.on("close", (): void => {
    disconnectAdminSse(id);
  });

  logInfo("Admin SSE connected", {
    adminConnections: adminSet.size,
    connectionId: id,
    totalConnections: connections.size,
  });

  return connection;
}

export function disconnectAdminSse(connectionId: string): void {
  const connection = connections.get(connectionId);

  if (connection === undefined) {
    return;
  }

  connections.delete(connectionId);
  const adminSet = connectionsByAdmin.get(connection.adminId);

  if (adminSet !== undefined) {
    adminSet.delete(connectionId);

    if (adminSet.size === 0) {
      connectionsByAdmin.delete(connection.adminId);
    }
  }

  logInfo("Admin SSE disconnected", {
    connectionId,
    totalConnections: connections.size,
  });
}

export function publishAdminSse(
  adminId: string,
  event: AdminDomainEvent,
): void {
  publishNamedSse(adminId, "admin", event);
}

export function publishCustomerSse(
  recipientUserId: string,
  event: CustomerRealtimeEvent,
): void {
  publishNamedSse(recipientUserId, "customer", event);
}

function publishNamedSse(
  recipientId: string,
  eventName: "admin" | "customer",
  event: AdminDomainEvent | CustomerRealtimeEvent,
): void {
  const recipientSet = connectionsByAdmin.get(recipientId);

  if (recipientSet === undefined) {
    return;
  }

  for (const connectionId of recipientSet) {
    connections.get(connectionId)?.send(eventName, event);
  }
}

export function closeAllAdminSse(): void {
  for (const connection of connections.values()) {
    connection.close();
  }
}

export function countAdminSseConnections(): number {
  return connections.size;
}

export function resetAdminSseConnections(): void {
  connections.clear();
  connectionsByAdmin.clear();
}

function readEventId(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "eventId" in payload &&
    typeof payload.eventId === "string"
  ) {
    return payload.eventId;
  }

  return randomUUID();
}
