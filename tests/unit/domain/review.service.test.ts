import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

describe("ReviewService", (): void => {
  it("creates, retrieves, updates, and hides testimonials", async (): Promise<void> => {
    const { reviews } = createDomainHarness();
    const created = await reviews.create(admin, {
      content: "The team left the kitchen spotless.",
      customerName: "Ada",
      rating: 5,
    });

    expect(created.isActive).toBe(true);
    expect(created.rating).toBe(5);

    const fetched = await reviews.getById(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await reviews.update(admin, created.id, { rating: 4 });
    expect(updated.rating).toBe(4);

    const hidden = await reviews.hide(admin, created.id);
    expect(hidden.isActive).toBe(false);
    await expect(reviews.getById(created.id)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(reviews.getById(created.id, admin)).resolves.toMatchObject({
      isActive: false,
    });
  });

  it("rejects invalid ratings and missing reviews", async (): Promise<void> => {
    const { reviews } = createDomainHarness();
    await expect(
      reviews.create(admin, {
        content: "Nice",
        customerName: "Ada",
        rating: 6,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(reviews.getById("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("creates one customer review per completed owned booking", async (): Promise<void> => {
    const harness = createDomainHarness();
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: "customer-a",
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Home",
      name: "Home Refresh",
      shortDescription: "Weekly",
    });
    const booking = await harness.bookings.create(admin, {
      customerId: customer.id,
      serviceId: offering.id,
    });
    await harness.bookings.changeStatus(admin, booking.id, "CONFIRMED");
    const actor: Actor = { id: "customer-a", role: "CUSTOMER" };
    const identity = {
      email: "ada@neatly.example",
      id: "customer-a",
      name: "Ada",
    };

    await expect(
      harness.reviews.createForCustomer(actor, identity, {
        bookingId: booking.id,
        content: "The team was careful and on time.",
        rating: 5,
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    await harness.bookings.assignCleaner(
      admin,
      booking.id,
      (
        await harness.cleaners.create(admin, {
          email: "mia@neatly.example",
          name: "Mia",
        })
      ).id,
    );
    await harness.bookings.changeStatus(admin, booking.id, "IN_PROGRESS");
    await harness.bookings.complete(admin, booking.id);

    const created = await harness.reviews.createForCustomer(actor, identity, {
      bookingId: booking.id,
      content: "The team was careful and on time.",
      rating: 5,
    });
    expect(created.status).toBe("pending");
    expect(created.bookingId).toBe(booking.id);
    expect(created.serviceName).toBe("Home Refresh");

    await expect(
      harness.reviews.createForCustomer(actor, identity, {
        bookingId: booking.id,
        content: "A second review should not save.",
        rating: 4,
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    const stranger: Actor = { id: "customer-b", role: "CUSTOMER" };
    await harness.customers.create(admin, {
      email: "other@neatly.example",
      name: "Other",
      userId: "customer-b",
    });
    await expect(
      harness.reviews.updateForCustomer(
        stranger,
        {
          email: "other@neatly.example",
          id: "customer-b",
          name: "Other",
        },
        created.id,
        { rating: 1 },
      ),
    ).rejects.toBeInstanceOf(NotFoundError);

    const workspace = await harness.reviews.listForCustomer(actor, identity);
    expect(workspace.reviews.map((item) => item.id)).toEqual([created.id]);
    expect(workspace.eligibleBookings).toEqual([]);
  });

  it("lists only active testimonials for the public homepage", async (): Promise<void> => {
    const harness = createDomainHarness();
    const hidden = await harness.reviews.create(admin, {
      content: "This unpublished note must stay off the homepage.",
      customerName: "Hidden",
      isActive: false,
      rating: 5,
    });
    const featured = await harness.reviews.create(admin, {
      content: "The team left the kitchen spotless.",
      customerName: "Ada",
      customerRole: "Westside",
      isFeatured: true,
      rating: 5,
      serviceCategory: "RESIDENTIAL",
      sortOrder: 2,
    });
    const later = await harness.reviews.create(admin, {
      content: "Careful work throughout the apartment.",
      customerName: "Bea",
      rating: 4,
      sortOrder: 1,
    });

    const listed = await harness.reviews.listPublic();

    expect(listed.items.map((item) => item.id)).toEqual([
      featured.id,
      later.id,
    ]);
    expect(listed.items[0]).toMatchObject({
      customerName: "Ada",
      featured: true,
      rating: 5,
      serviceCategory: "RESIDENTIAL",
    });
    expect(listed.items.some((item) => item.id === hidden.id)).toBe(false);
    expect(JSON.stringify(listed.items)).not.toContain("customerId");
    expect(JSON.stringify(listed.items)).not.toContain("bookingId");
    expect(JSON.stringify(listed.items)).not.toContain("avatarMediaId");
  });

  it("caps the public homepage list and keeps pending customer reviews private", async (): Promise<void> => {
    const harness = createDomainHarness();
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: "customer-a",
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Home",
      name: "Home Refresh",
      shortDescription: "Weekly",
    });
    const booking = await harness.bookings.create(admin, {
      customerId: customer.id,
      serviceId: offering.id,
    });
    await harness.bookings.changeStatus(admin, booking.id, "CONFIRMED");
    await harness.bookings.assignCleaner(
      admin,
      booking.id,
      (
        await harness.cleaners.create(admin, {
          email: "mia@neatly.example",
          name: "Mia",
        })
      ).id,
    );
    await harness.bookings.changeStatus(admin, booking.id, "IN_PROGRESS");
    await harness.bookings.complete(admin, booking.id);

    const actor: Actor = { id: "customer-a", role: "CUSTOMER" };
    await harness.reviews.createForCustomer(
      actor,
      {
        email: "ada@neatly.example",
        id: "customer-a",
        name: "Ada",
      },
      {
        bookingId: booking.id,
        content: "The team was careful and on time.",
        rating: 5,
      },
    );

    for (let index = 0; index < 8; index += 1) {
      await harness.reviews.create(admin, {
        content: `Published review number ${String(index + 1)} for the homepage.`,
        customerName: `Reviewer ${String(index + 1)}`,
        rating: 5,
      });
    }

    const listed = await harness.reviews.listPublic();
    expect(listed.items).toHaveLength(6);
    expect(listed.items.every((item) => item.customerName !== "Ada")).toBe(
      true,
    );
  });
});
