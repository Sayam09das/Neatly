import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import { createDomainHarness } from "../domain/in-memory-domain.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);
const admin: Actor = { id: "admin-1", role: "ADMIN" };

interface Envelope<T> {
  data: T;
  error: { code: string; message: string; requestId?: string } | null;
  success: boolean;
}

function futureDateInput(): string {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

describe("Public quote APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("creates a quote request without authentication", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const offering = await harness.catalog.create(admin, {
      fullDescription: "A complete residential clean.",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });

    const response = await dispatchApi({
      body: JSON.stringify({
        additionalNotes: "Pets on site",
        approximateSize: "1,000-2,000 sq ft",
        bathrooms: 2,
        bedrooms: 3,
        email: "ada@neatly.example",
        frequency: "ONE_TIME",
        fullName: "Ada Customer",
        phone: "5551234567",
        preferredDate: futureDateInput(),
        preferredTime: "Morning (8am-12pm)",
        propertyType: "HOUSE",
        serviceAddress: "12 Harbour Street",
        serviceId: offering.id,
        serviceType: "RESIDENTIAL",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerQuotes,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      quoteRequest: { id: string; status: string; serviceId: string | null };
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(body.data.quoteRequest.status).toBe("NEW");
    expect(body.data.quoteRequest.serviceId).toBe(offering.id);
    expect(JSON.stringify(body.data)).not.toContain("adminNotes");
    expect(JSON.stringify(body.data)).not.toContain("Ada Customer");
  });

  it("rejects honeypot submissions and client-owned status", async (): Promise<void> => {
    const response = await dispatchApi({
      body: JSON.stringify({
        approximateSize: "Under 1,000 sq ft",
        companyWebsite: "https://spam.example",
        email: "bot@example.com",
        frequency: "ONE_TIME",
        fullName: "Bot",
        phone: "5551234567",
        preferredDate: futureDateInput(),
        preferredTime: "Morning (8am-12pm)",
        propertyType: "OFFICE",
        serviceAddress: "1 Main",
        status: "QUOTED",
        serviceType: "COMMERCIAL",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerQuotes,
    });

    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
