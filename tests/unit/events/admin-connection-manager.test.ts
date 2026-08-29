import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import {
  closeAllAdminSse,
  connectAdminSse,
  countAdminSseConnections,
  disconnectAdminSse,
  publishAdminSse,
  resetAdminSseConnections,
} from "../../../apps/server/src/lib/events/admin-connection-manager.ts";
import type { AdminDomainEvent } from "../../../apps/server/src/lib/events/event-types.ts";

function createSsePair(): {
  chunks: string[];
  req: IncomingMessage;
  res: ServerResponse;
} {
  const chunks: string[] = [];
  const req = new EventEmitter() as IncomingMessage;
  let writableEnded = false;
  const res = {
    end(): void {
      writableEnded = true;
    },
    get writableEnded(): boolean {
      return writableEnded;
    },
    write(chunk: string): boolean {
      chunks.push(chunk);
      return true;
    },
  } as unknown as ServerResponse;

  return { chunks, req, res };
}

function sampleEvent(eventId: string): AdminDomainEvent {
  return {
    actorId: "admin-1",
    entityId: "booking-1",
    eventId,
    message: "A new booking requires attention.",
    notificationId: "notif-1",
    relatedHref: "/admin/bookings",
    timestamp: "2026-08-29T00:00:00.000Z",
    title: "New booking",
    type: "BOOKING_CREATED",
  };
}

describe("Admin SSE connection manager", (): void => {
  afterEach((): void => {
    resetAdminSseConnections();
  });

  it("publishes to every connection for the same admin", (): void => {
    const first = createSsePair();
    const second = createSsePair();
    connectAdminSse("admin-2", first.req, first.res);
    connectAdminSse("admin-2", second.req, second.res);

    expect(countAdminSseConnections()).toBe(2);
    publishAdminSse("admin-2", sampleEvent("evt-1"));

    expect(first.chunks.join("")).toContain("evt-1");
    expect(second.chunks.join("")).toContain("evt-1");
    expect(first.chunks.join("")).toContain("BOOKING_CREATED");
  });

  it("does not leak events to another admin", (): void => {
    const other = createSsePair();
    connectAdminSse("admin-3", other.req, other.res);
    publishAdminSse("admin-2", sampleEvent("evt-2"));
    expect(other.chunks.join("")).not.toContain("evt-2");
  });

  it("cleans up on disconnect and close-all", (): void => {
    const pair = createSsePair();
    const connection = connectAdminSse("admin-4", pair.req, pair.res);
    expect(countAdminSseConnections()).toBe(1);
    disconnectAdminSse(connection.id);
    expect(countAdminSseConnections()).toBe(0);

    connectAdminSse("admin-4", pair.req, pair.res);
    closeAllAdminSse();
    expect(countAdminSseConnections()).toBe(0);
  });
});
