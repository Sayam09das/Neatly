import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

async function seedBookingGraph() {
  const harness = createDomainHarness();
  const customer = await harness.customers.create(admin, {
    email: "ada@neatly.example",
    name: "Ada",
    userId: "customer-a",
  });
  const cleaner = await harness.cleaners.create(admin, {
    email: "mia@neatly.example",
    name: "Mia",
    userId: "cleaner-a",
  });
  const offering = await harness.catalog.create(admin, {
    fullDescription: "Full clean",
    name: "Home Refresh",
    shortDescription: "Weekly tidy",
  });
  return { ...harness, cleaner, customer, offering };
}

describe("BookingService", (): void => {
  it("creates a pending booking and walks valid transitions", async (): Promise<void> => {
    const { bookings, cleaner, customer, offering } = await seedBookingGraph();
    const created = await bookings.create(admin, {
      customerId: customer.id,
      serviceId: offering.id,
    });

    expect(created.status).toBe("PENDING");
    expect(created.customerId).toBe(customer.id);

    await bookings.changeStatus(admin, created.id, "CONFIRMED");
    const assigned = await bookings.assignCleaner(
      admin,
      created.id,
      cleaner.id,
    );
    expect(assigned.status).toBe("ASSIGNED");
    expect(assigned.cleanerId).toBe(cleaner.id);

    await bookings.changeStatus(admin, assigned.id, "IN_PROGRESS");
    const completed = await bookings.complete(admin, assigned.id);
    expect(completed.status).toBe("COMPLETED");

    await expect(
      bookings.changeStatus(admin, completed.id, "PENDING"),
    ).rejects.toBeInstanceOf(ConflictError);
    await expect(bookings.cancel(admin, completed.id)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("assigns a cleaner at create time and supports cancellation", async (): Promise<void> => {
    const { bookings, cleaner, customer, offering } = await seedBookingGraph();
    const created = await bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      serviceId: offering.id,
    });
    expect(created.status).toBe("ASSIGNED");

    const cancelled = await bookings.cancel(admin, created.id);
    expect(cancelled.status).toBe("CANCELLED");
    await expect(
      bookings.update(admin, cancelled.id, { notes: "late" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("rejects missing relationships and inactive assignees", async (): Promise<void> => {
    const { bookings, catalog, cleaners, customer, offering } =
      await seedBookingGraph();

    await expect(
      bookings.create(admin, {
        customerId: "missing",
        serviceId: offering.id,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    await expect(
      bookings.create(admin, {
        customerId: customer.id,
        serviceId: "missing",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    await catalog.archive(admin, offering.id);
    await expect(
      bookings.create(admin, {
        customerId: customer.id,
        serviceId: offering.id,
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    const inactiveCleaner = await cleaners.create(admin, {
      name: "Idle",
    });
    await cleaners.deactivate(admin, inactiveCleaner.id);
    const activeOffering = await catalog.create(admin, {
      fullDescription: "Move-out",
      name: "Move Out",
      shortDescription: "Empty home",
    });
    await expect(
      bookings.create(admin, {
        cleanerId: inactiveCleaner.id,
        customerId: customer.id,
        serviceId: activeOffering.id,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("scopes list/get by ownership and detects concurrent status races", async (): Promise<void> => {
    const { bookings, customer, offering } = await seedBookingGraph();
    const created = await bookings.create(admin, {
      customerId: customer.id,
      serviceId: offering.id,
    });

    const owner: Actor = { id: "customer-a", role: "CUSTOMER" };
    const stranger: Actor = { id: "customer-b", role: "CUSTOMER" };
    const cleanerPortal: Actor = { id: "cleaner-a", role: "CLEANER" };

    await expect(bookings.getById(owner, created.id)).resolves.toMatchObject({
      id: created.id,
    });
    await expect(bookings.getById(stranger, created.id)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
    await expect(
      bookings.getById(cleanerPortal, created.id),
    ).rejects.toBeInstanceOf(AuthorizationError);

    const ownerList = await bookings.list(owner);
    expect(ownerList.items).toHaveLength(1);
    await expect(bookings.list(stranger)).rejects.toBeInstanceOf(
      AuthorizationError,
    );

    await bookings.changeStatus(admin, created.id, "CONFIRMED");
    await expect(
      bookings.changeStatus(admin, created.id, "CONFIRMED"),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
