import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
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

const sessionUser = {
  email: "ada@neatly.example",
  id: "customer-a",
  lastLoginAt: null,
  name: "Ada",
  role: "STAFF" as const,
  status: "ACTIVE" as const,
};

interface Envelope<T> {
  data: T;
  error: { code: string; message: string } | null;
  success: boolean;
}

function futureDate(): Date {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
}

function withAuth(
  input: Parameters<typeof dispatchApi>[0] = {},
): Parameters<typeof dispatchApi>[0] {
  return {
    ...input,
    headers: {
      "content-type": "application/json",
      "x-session-token": "session-token-value",
      ...input.headers,
    },
  };
}

describe("Customer quote read APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("requires a session and ignores customerId query ownership", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerQuotes,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const unauthenticatedDetail = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.customerQuotes}/clquote000000000000000001`,
    });
    expect(unauthenticatedDetail.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);

    const injected = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerQuotes}?customerId=clother000000000000000001`,
      }),
    );
    expect(injected.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const malformed = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerQuotes}/not-a-cuid`,
      }),
    );
    expect(malformed.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns only session-email quotes and hides another customer's request", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const own = await harness.quotes.createPublic({
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1,
      bedrooms: 2,
      email: sessionUser.email,
      frequency: "ONE_TIME",
      fullName: "Ada Customer",
      phone: "5551234567",
      preferredDate: futureDate(),
      preferredTime: "Morning (8am-12pm)",
      propertyType: "HOUSE",
      serviceAddress: "12 Harbour Street",
      serviceType: "RESIDENTIAL",
    });
    const other = await harness.quotes.createPublic({
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

    const list = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.customerQuotes }),
    );
    const listBody = parseJsonBody(list.body) as Envelope<{
      items: Array<{ email: string; id: string }>;
    }>;
    expect(list.statusCode).toBe(HTTP_STATUS.OK);
    expect(list.headers["cache-control"]).toBe("no-store");
    expect(listBody.data.items).toEqual([
      expect.objectContaining({ email: sessionUser.email, id: own.id }),
    ]);
    expect(list.body).not.toContain("adminNotes");
    expect(list.body).not.toContain("other@neatly.example");

    const ownDetail = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerQuotes}/${own.id}`,
      }),
    );
    expect(ownDetail.statusCode).toBe(HTTP_STATUS.OK);
    expect(ownDetail.body).toContain("12 Harbour Street");

    const otherDetail = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerQuotes}/${other.id}`,
      }),
    );
    expect(otherDetail.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(otherDetail.body).not.toContain("9 Queen Street");
  });
});
