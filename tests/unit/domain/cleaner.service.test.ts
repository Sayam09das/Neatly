import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

describe("CleanerService", (): void => {
  it("creates, retrieves, updates, and deactivates cleaners", async (): Promise<void> => {
    const { cleaners } = createDomainHarness();
    const created = await cleaners.create(admin, {
      email: "Mia@Neatly.example",
      name: "Mia Cleaner",
    });

    expect(created.email).toBe("mia@neatly.example");
    expect(created.status).toBe("ACTIVE");

    const fetched = await cleaners.getById(admin, created.id);
    expect(fetched.name).toBe("Mia Cleaner");

    const updated = await cleaners.update(admin, created.id, {
      name: "Mia Updated",
    });
    expect(updated.name).toBe("Mia Updated");

    await expect(
      cleaners.create(admin, {
        email: "mia@neatly.example",
        name: "Duplicate",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    const inactive = await cleaners.deactivate(admin, created.id);
    expect(inactive.status).toBe("INACTIVE");

    const stats = await cleaners.stats(admin);
    expect(stats.inactive).toBe(1);

    const restored = await cleaners.activate(admin, created.id);
    expect(restored.status).toBe("ACTIVE");
  });

  it("returns a session cleaner only for an active linked profile", async (): Promise<void> => {
    const { cleaners } = createDomainHarness();
    const linked = await cleaners.create(admin, {
      email: "mia@neatly.example",
      name: "Mia Cleaner",
      userId: "cleaner-a",
    });
    const portal: Actor = { id: "cleaner-a", role: "CLEANER" };
    const session = await cleaners.getForSession(portal);

    expect(session.id).toBe(linked.id);
    expect(session.name).toBe("Mia Cleaner");
    expect(JSON.stringify(session)).not.toContain("userId");

    await expect(
      cleaners.getForSession({ id: "cleaner-a", role: "CUSTOMER" }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    await expect(
      cleaners.getForSession({ id: "missing-user", role: "CLEANER" }),
    ).rejects.toBeInstanceOf(AuthorizationError);

    await cleaners.deactivate(admin, linked.id);
    await expect(cleaners.getForSession(portal)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });

  it("rejects missing cleaners and non-admin lists", async (): Promise<void> => {
    const { cleaners } = createDomainHarness();
    const portal: Actor = { id: "cleaner-1", role: "CLEANER" };

    await expect(cleaners.getById(admin, "missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(cleaners.list(portal)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });

  it("reads and updates session availability without changing bookings", async (): Promise<void> => {
    const harness = createDomainHarness();
    const cleaner = await harness.cleaners.create(admin, {
      email: "mia@neatly.example",
      name: "Mia Cleaner",
      userId: "cleaner-a",
    });
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: "customer-a",
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const portal: Actor = { id: "cleaner-a", role: "CLEANER" };
    const empty = await harness.cleaners.getAvailability(portal);
    expect(empty.week.every((day) => day.available === false)).toBe(true);
    expect(empty.conflicts).toEqual([]);

    const openMonday = empty.week.map((day) =>
      day.day === "monday"
        ? {
            available: true,
            day: "monday" as const,
            end: "17:00",
            start: "09:00",
          }
        : day,
    );
    const saved = await harness.cleaners.updateAvailability(portal, openMonday);
    expect(saved.week.find((day) => day.day === "monday")?.available).toBe(
      true,
    );
    expect(saved.conflicts).toEqual([]);

    const job = await harness.bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      scheduledAt: upcomingUtcMonday(),
      serviceId: offering.id,
    });
    const conflicting = await harness.cleaners.updateAvailability(
      portal,
      saved.week.map((day) =>
        day.day === "monday"
          ? { available: false, day: "monday", end: null, start: null }
          : day,
      ),
    );
    expect(conflicting.conflicts.map((conflict) => conflict.jobId)).toEqual([
      job.id,
    ]);
    const stillAssigned = await harness.bookings.getById(admin, job.id);
    expect(stillAssigned.status).toBe("ASSIGNED");
    expect(stillAssigned.cleanerId).toBe(cleaner.id);

    await expect(
      harness.cleaners.updateAvailability(
        { id: "cleaner-b", role: "CLEANER" },
        empty.week,
      ),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});

function upcomingUtcMonday(): Date {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const weekday = start.getUTCDay();
  const daysUntilNextMonday = weekday === 1 ? 7 : (8 - weekday) % 7;
  return new Date(
    start.getTime() +
      daysUntilNextMonday * 24 * 60 * 60 * 1000 +
      10 * 60 * 60 * 1000,
  );
}
