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
});
