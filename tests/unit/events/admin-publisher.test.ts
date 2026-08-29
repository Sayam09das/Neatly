import { afterEach, describe, expect, it, vi } from "vitest";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import { resetAdminSseConnections } from "../../../apps/server/src/lib/events/admin-connection-manager.ts";
import { publishAdminDomainEvent } from "../../../apps/server/src/lib/events/publisher.ts";
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
});
