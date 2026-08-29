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

  it("creates a pending customer booking from the session identity", async (): Promise<void> => {
    const { bookings, catalog, customers } = await seedBookingGraph();
    const offering = await catalog.create(admin, {
      fullDescription: "Move-out",
      name: "Move Out",
      shortDescription: "Empty home",
    });
    const actor: Actor = { id: "customer-a", role: "CUSTOMER" };
    const created = await bookings.createForCustomer(
      actor,
      {
        email: "ada@neatly.example",
        id: "customer-a",
        name: "Ada",
      },
      {
        notes: "Gate code",
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        serviceAddress: "12 Harbour Street",
        serviceId: offering.id,
      },
    );

    expect(created.status).toBe("PENDING");
    expect(created.serviceAddress).toBe("12 Harbour Street");
    expect(created.linkedToQuote).toBe(false);
    expect(JSON.stringify(created)).not.toContain("cleaner");

    const fetched = await bookings.getCustomerBooking(
      actor,
      {
        email: "ada@neatly.example",
        id: "customer-a",
        name: "Ada",
      },
      created.id,
    );
    expect(fetched.id).toBe(created.id);

    const stranger: Actor = { id: "customer-b", role: "CUSTOMER" };
    await customers.create(admin, {
      email: "other@neatly.example",
      name: "Other",
      userId: "customer-b",
    });
    await expect(
      bookings.getCustomerBooking(
        stranger,
        {
          email: "other@neatly.example",
          id: "customer-b",
          name: "Other",
        },
        created.id,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lists and summarizes only the session customer's bookings", async (): Promise<void> => {
    const { bookings, catalog, customers, offering } = await seedBookingGraph();
    const actor: Actor = { id: "customer-a", role: "CUSTOMER" };
    const identity = {
      email: "ada@neatly.example",
      id: "customer-a",
      name: "Ada",
    };
    const otherOffering = await catalog.create(admin, {
      fullDescription: "Office",
      name: "Office Clean",
      shortDescription: "Desks",
    });
    const own = await bookings.createForCustomer(actor, identity, {
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      serviceAddress: "12 Harbour Street",
      serviceId: offering.id,
    });
    const otherActor: Actor = { id: "customer-b", role: "CUSTOMER" };
    await customers.create(admin, {
      email: "other@neatly.example",
      name: "Other",
      userId: "customer-b",
    });
    await bookings.createForCustomer(
      otherActor,
      {
        email: "other@neatly.example",
        id: "customer-b",
        name: "Other",
      },
      {
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        serviceAddress: "99 Other Lane",
        serviceId: otherOffering.id,
      },
    );

    const listed = await bookings.listForCustomer(actor, identity, {});
    expect(listed.items.map((item) => item.id)).toEqual([own.id]);
    expect(listed.pagination.total).toBe(1);
    expect(JSON.stringify(listed)).not.toContain("cleaner");
    expect(JSON.stringify(listed)).not.toContain("customerId");

    const overview = await bookings.getCustomerOverview(actor, identity);
    expect(overview.upcomingBooking?.id).toBe(own.id);
    expect(overview.summary.total).toBe(1);
    expect(overview.summary.pending).toBe(1);
    expect(overview.summary.upcoming).toBe(1);
    expect(overview.recentBookings).toHaveLength(1);

    const emptyActor: Actor = { id: "customer-c", role: "CUSTOMER" };
    const empty = await bookings.listForCustomer(
      emptyActor,
      {
        email: "new@neatly.example",
        id: "customer-c",
        name: "New",
      },
      {},
    );
    expect(empty.items).toEqual([]);
    expect(empty.pagination.total).toBe(0);
  });

  it("lets the owner cancel or update an eligible booking and rejects IDOR", async (): Promise<void> => {
    const { bookings, customers, offering } = await seedBookingGraph();
    const actor: Actor = { id: "customer-a", role: "CUSTOMER" };
    const identity = {
      email: "ada@neatly.example",
      id: "customer-a",
      name: "Ada",
    };
    const created = await bookings.createForCustomer(actor, identity, {
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      serviceAddress: "12 Harbour Street",
      serviceId: offering.id,
    });
    expect(created.actions.canCancel).toBe(true);
    expect(created.actions.canUpdate).toBe(true);

    const nextSchedule = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const updated = await bookings.updateForCustomer(
      actor,
      identity,
      created.id,
      {
        notes: "Side entrance",
        scheduledAt: nextSchedule,
        serviceAddress: "14 Harbour Street",
      },
    );
    expect(updated.notes).toBe("Side entrance");
    expect(updated.serviceAddress).toBe("14 Harbour Street");
    expect(updated.status).toBe("PENDING");

    const stranger: Actor = { id: "customer-b", role: "CUSTOMER" };
    await customers.create(admin, {
      email: "other@neatly.example",
      name: "Other",
      userId: "customer-b",
    });
    await expect(
      bookings.cancelForCustomer(
        stranger,
        {
          email: "other@neatly.example",
          id: "customer-b",
          name: "Other",
        },
        created.id,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);

    const cancelled = await bookings.cancelForCustomer(
      actor,
      identity,
      created.id,
    );
    expect(cancelled.status).toBe("CANCELLED");
    expect(cancelled.actions.canCancel).toBe(false);
    expect(cancelled.actions.canUpdate).toBe(false);
    await expect(
      bookings.updateForCustomer(actor, identity, created.id, {
        notes: "too late",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
