import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import {
  connectAdminSse,
  resetAdminSseConnections,
} from "../../../apps/server/src/lib/events/admin-connection-manager.ts";
import {
  publishAdminDomainEvent,
  recordCustomerInboxNotification,
} from "../../../apps/server/src/lib/events/publisher.ts";
import type { UserProfile } from "../../../apps/server/src/services/users/user.types.ts";
import { createDomainHarness } from "../domain/in-memory-domain.ts";

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedDomain = vi.mocked(getDomainServices);

function adminProfile(id: string): UserProfile {
  const now = new Date("2026-08-29T00:00:00.000Z");
  return {
    createdAt: now,
    email: `${id}@neatly.example`,
    emailVerifiedAt: now,
    id,
    lastLoginAt: null,
    name: "Admin",
    role: "ADMIN",
    status: "ACTIVE",
    updatedAt: now,
  };
}

describe("Admin domain event publisher", (): void => {
  afterEach((): void => {
    resetAdminSseConnections();
    mockedDomain.mockReset();
  });

  it("persists a notification for other admins and not the actor", async (): Promise<void> => {
    const harness = createDomainHarness();
    harness.store.users.set("admin-actor", adminProfile("admin-actor"));
    harness.store.users.set("admin-other", adminProfile("admin-other"));
    mockedDomain.mockReturnValue(harness);

    await publishAdminDomainEvent(
      { id: "admin-actor", role: "ADMIN" },
      {
        entityId: "booking-1",
        message: "A new booking requires attention.",
        relatedHref: "/admin/bookings",
        relatedLabel: "View bookings",
        title: "New booking",
        type: "BOOKING_CREATED",
      },
    );

    const rows = [...harness.store.notifications.values()];
    expect(rows).toHaveLength(1);
    expect(rows[0]?.recipientId).toBe("admin-other");
    expect(rows[0]?.title).toBe("New booking");
  });

  it("does not fail the caller when publish internals throw", async (): Promise<void> => {
    mockedDomain.mockImplementation((): never => {
      throw new Error("runtime unavailable");
    });

    await expect(
      publishAdminDomainEvent(
        { id: "admin-actor", role: "ADMIN" },
        {
          entityId: "booking-1",
          message: "A new booking requires attention.",
          relatedHref: "/admin/bookings",
          relatedLabel: "View bookings",
          title: "New booking",
          type: "BOOKING_CREATED",
        },
      ),
    ).resolves.toBeUndefined();
  });

  it("persists a customer inbox row before publishing to that user only", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness);
    const ownerChunks: string[] = [];
    const otherChunks: string[] = [];
    const ownerReq = new EventEmitter() as IncomingMessage;
    const otherReq = new EventEmitter() as IncomingMessage;
    const ownerRes = {
      end(): void {},
      get writableEnded(): boolean {
        return false;
      },
      write(chunk: string): boolean {
        ownerChunks.push(chunk);
        return true;
      },
    } as unknown as ServerResponse;
    const otherRes = {
      end(): void {},
      get writableEnded(): boolean {
        return false;
      },
      write(chunk: string): boolean {
        otherChunks.push(chunk);
        return true;
      },
    } as unknown as ServerResponse;

    connectAdminSse("customer-a", ownerReq, ownerRes);
    connectAdminSse("customer-b", otherReq, otherRes);

    await recordCustomerInboxNotification("customer-a", {
      entityId: "booking-1",
      message: "Your booking request was received.",
      relatedHref: "/dashboard/bookings/booking-1",
      relatedLabel: "View booking",
      title: "Booking requested",
      type: "BOOKING_CREATED",
    });

    const rows = [...harness.store.notifications.values()];
    expect(rows).toHaveLength(1);
    expect(rows[0]?.recipientId).toBe("customer-a");
    expect(ownerChunks.join("")).toContain("event: customer");
    expect(ownerChunks.join("")).toContain("Booking requested");
    expect(otherChunks.join("")).not.toContain("Booking requested");
  });
});
