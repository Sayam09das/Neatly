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

describe("Customer help API", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("requires a session and returns only published service FAQs", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerHelp,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);

    const harness = createDomainHarness();
    await harness.catalog.create(admin, {
      faqs: [{ answer: "Yes, weekly.", question: "Is this recurring?" }],
      fullDescription: "A complete residential clean.",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    mockedDomain.mockReturnValue(harness as never);

    const response = await dispatchApi({
      headers: { "x-session-token": "session-token-value" },
      method: "GET",
      url: API_PATHS.customerHelp,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      topics: Array<{ name: string; slug: string }>;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.topics).toEqual([
      {
        faqs: [{ answer: "Yes, weekly.", question: "Is this recurring?" }],
        name: "Home Refresh",
        slug: "home-refresh",
      },
    ]);
    expect(response.body).not.toContain("adminNotes");
    expect(response.body).not.toContain("coverMediaId");
  });
});
