import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../../apps/server/src/lib/errors.ts";
import { createDomainHarness } from "./in-memory-domain.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };

function futureDate(): Date {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
}

describe("QuoteService", (): void => {
  it("creates a public quote with status NEW and omits admin fields", async (): Promise<void> => {
    const { catalog, quotes } = createDomainHarness();
    const offering = await catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });

    const created = await quotes.createPublic({
      additionalNotes: "Gate code 12",
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1.5,
      bedrooms: 2,
      email: "ada@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Ada Customer",
      phone: "5551234567",
      preferredDate: futureDate(),
      preferredTime: "Morning (8am-12pm)",
      propertyType: "HOUSE",
      serviceAddress: "12 Harbour Street",
      serviceId: offering.id,
      serviceType: "RESIDENTIAL",
    });

    expect(created.status).toBe("NEW");
    expect(created.serviceId).toBe(offering.id);
    expect(created.serviceType).toBe("RESIDENTIAL");
    expect(JSON.stringify(created)).not.toContain("adminNotes");
    expect(JSON.stringify(created)).not.toContain("fullName");
  });

  it("rejects inactive services and past preferred dates", async (): Promise<void> => {
    const { catalog, quotes } = createDomainHarness();
    const offering = await catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    await catalog.archive(admin, offering.id);

    await expect(
      quotes.createPublic({
        approximateSize: "1,000-2,000 sq ft",
        bathrooms: 1,
        bedrooms: 1,
        email: "ada@neatly.example",
        frequency: "WEEKLY",
        fullName: "Ada Customer",
        phone: "5551234567",
        preferredDate: futureDate(),
        preferredTime: "Afternoon (12pm-4pm)",
        propertyType: "HOUSE",
        serviceAddress: "12 Harbour Street",
        serviceId: offering.id,
        serviceType: "RESIDENTIAL",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    await expect(
      quotes.createPublic({
        approximateSize: "Under 1,000 sq ft",
        email: "ada@neatly.example",
        frequency: "ONE_TIME",
        fullName: "Ada Customer",
        phone: "5551234567",
        preferredDate: new Date("2020-01-01T00:00:00.000Z"),
        preferredTime: "Morning (8am-12pm)",
        propertyType: "OFFICE",
        serviceAddress: "12 Harbour Street",
        serviceType: "COMMERCIAL",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects unknown quote ids", async (): Promise<void> => {
    const { quotes } = createDomainHarness();
    await expect(quotes.getById("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("lists and reads only quotes matching the session email", async (): Promise<void> => {
    const { quotes } = createDomainHarness();
    const own = await quotes.createPublic({
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1,
      bedrooms: 2,
      email: "ada@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Ada Customer",
      phone: "5551234567",
      preferredDate: futureDate(),
      preferredTime: "Morning (8am-12pm)",
      propertyType: "HOUSE",
      serviceAddress: "12 Harbour Street",
      serviceType: "RESIDENTIAL",
    });
    const other = await quotes.createPublic({
      approximateSize: "Under 1,000 sq ft",
      email: "other@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Other Customer",
      phone: "5550000000",
      preferredDate: futureDate(),
      preferredTime: "Afternoon (12pm-4pm)",
      propertyType: "OFFICE",
      serviceAddress: "9 Queen Street",
      serviceType: "COMMERCIAL",
    });
    const identity = {
      email: "ada@neatly.example",
      id: "user-ada",
      name: "Ada",
    };

    const list = await quotes.listForCustomer(identity);
    expect(list.items).toHaveLength(1);
    expect(list.items[0]?.id).toBe(own.id);
    expect(JSON.stringify(list)).not.toContain("adminNotes");

    const detail = await quotes.getForCustomer(identity, own.id);
    expect(detail.email).toBe("ada@neatly.example");
    expect(detail.serviceAddress).toBe("12 Harbour Street");

    await expect(
      quotes.getForCustomer(identity, other.id),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lets admin quote a request and the owner accept it", async (): Promise<void> => {
    const { quotes } = createDomainHarness();
    const created = await quotes.createPublic({
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1,
      bedrooms: 1,
      email: "ada@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Ada Customer",
      phone: "5551234567",
      preferredDate: futureDate(),
      preferredTime: "Morning (8am-12pm)",
      propertyType: "HOUSE",
      serviceAddress: "12 Harbour Street",
      serviceType: "RESIDENTIAL",
    });
    const identity = {
      email: "ada@neatly.example",
      id: "user-ada",
      name: "Ada",
    };

    await expect(
      quotes.acceptForCustomer(identity, created.id),
    ).rejects.toBeInstanceOf(ConflictError);

    const quoted = await quotes.updateForAdmin(admin, created.id, {
      quotedAmount: 180.5,
    });
    expect(quoted.status).toBe("QUOTED");
    expect(quoted.quotedAmount).toBe(180.5);

    await expect(
      quotes.updateForAdmin(admin, created.id, { quotedAmount: -12 }),
    ).rejects.toBeInstanceOf(ValidationError);

    const accepted = await quotes.acceptForCustomer(identity, created.id);
    expect(accepted.status).toBe("ACCEPTED");
    const again = await quotes.acceptForCustomer(identity, created.id);
    expect(again.status).toBe("ACCEPTED");

    const listed = await quotes.listForAdmin(admin, {});
    expect(listed.items[0]?.status).toBe("ACCEPTED");
    expect(listed.items[0]?.adminNotes).toBeNull();
  });
});
