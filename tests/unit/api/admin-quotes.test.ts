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

const adminUser = {
  email: "ops@neatly.example",
  id: "admin-1",
  lastLoginAt: null,
  name: "Ops",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

const customerUser = {
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

function withAuth(
  user: typeof adminUser | typeof customerUser,
  input: Parameters<typeof dispatchApi>[0] = {},
): Parameters<typeof dispatchApi>[0] {
  mockedAuth.mockReturnValue({
    resolveSession: vi.fn().mockResolvedValue(user),
  } as never);
  return {
    ...input,
    headers: {
      "content-type": "application/json",
      "x-session-token": "session-token-value",
      ...input.headers,
    },
  };
}

describe("Admin quote APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("rejects unauthenticated and non-admin access", async (): Promise<void> => {
    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.adminQuotes,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const unauthenticatedPatch = await dispatchApi({
      body: JSON.stringify({ quotedAmount: 120 }),
      method: "PATCH",
      url: `${API_PATHS.adminQuotes}/clquote000000000000000001`,
    });
    expect(unauthenticatedPatch.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const customer = await dispatchApi(
      withAuth(customerUser, {
        method: "GET",
        url: API_PATHS.adminQuotes,
      }),
    );
    expect(customer.statusCode).toBe(HTTP_STATUS.FORBIDDEN);

    const customerPatch = await dispatchApi(
      withAuth(customerUser, {
        body: JSON.stringify({ quotedAmount: 120 }),
        method: "PATCH",
        url: `${API_PATHS.adminQuotes}/clquote000000000000000001`,
      }),
    );
    expect(customerPatch.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("lists and prices a quote for an admin", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const created = await harness.quotes.createPublic({
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1,
      bedrooms: 1,
      email: "ada@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Ada Customer",
      phone: "5551234567",
      preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      preferredTime: "Morning (8am-12pm)",
      propertyType: "HOUSE",
      serviceAddress: "12 Harbour Street",
      serviceType: "RESIDENTIAL",
    });

    const listed = await dispatchApi(
      withAuth(adminUser, {
        method: "GET",
        url: API_PATHS.adminQuotes,
      }),
    );
    const listBody = parseJsonBody(listed.body) as Envelope<{
      items: Array<{ id: string; status: string }>;
    }>;
    expect(listed.statusCode).toBe(HTTP_STATUS.OK);
    expect(listBody.data.items.map((item) => item.id)).toEqual([created.id]);

    const priced = await dispatchApi(
      withAuth(adminUser, {
        body: JSON.stringify({ quotedAmount: 220 }),
        method: "PATCH",
        url: `${API_PATHS.adminQuotes}/${created.id}`,
      }),
    );
    const pricedBody = parseJsonBody(priced.body) as Envelope<{
      quoteRequest: { quotedAmount: number; status: string };
    }>;
    expect(priced.statusCode).toBe(HTTP_STATUS.OK);
    expect(pricedBody.data.quoteRequest.status).toBe("QUOTED");
    expect(pricedBody.data.quoteRequest.quotedAmount).toBe(220);

    const invalid = await dispatchApi(
      withAuth(adminUser, {
        body: JSON.stringify({ quotedAmount: -5 }),
        method: "PATCH",
        url: `${API_PATHS.adminQuotes}/${created.id}`,
      }),
    );
    expect(invalid.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    void admin;
  });
});
