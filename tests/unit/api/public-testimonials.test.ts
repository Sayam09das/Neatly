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

interface PublicReviewList {
  items: Array<{
    content: string;
    createdAt: string;
    customerName: string;
    customerRole: string | null;
    featured: boolean;
    id: string;
    rating: number;
    serviceCategory: string | null;
  }>;
}

describe("Public testimonial APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("lists active testimonials without authentication", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);

    const active = await harness.reviews.create(admin, {
      content: "The team left the kitchen spotless.",
      customerName: "Ada",
      isFeatured: true,
      rating: 5,
      serviceCategory: "RESIDENTIAL",
    });
    await harness.reviews.create(admin, {
      content: "This unpublished note must stay off the homepage.",
      customerName: "Hidden",
      isActive: false,
      rating: 5,
    });

    const response = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerTestimonials,
    });
    const body = parseJsonBody(response.body) as Envelope<PublicReviewList>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]?.id).toBe(active.id);
    expect(body.data.items[0]?.featured).toBe(true);
    expect(Object.keys(body.data.items[0] ?? {}).sort()).toEqual([
      "content",
      "createdAt",
      "customerName",
      "customerRole",
      "featured",
      "id",
      "rating",
      "serviceCategory",
    ]);
    expect(JSON.stringify(body.data.items)).not.toContain("customerId");
    expect(JSON.stringify(body.data.items)).not.toContain("bookingId");
    expect(JSON.stringify(body.data.items)).not.toContain("avatarMediaId");
    expect(JSON.stringify(body.data.items)).not.toContain("isActive");
  });

  it("does not expose inactive reviews through public query parameters", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);

    await harness.reviews.create(admin, {
      content: "This unpublished note must stay off the homepage.",
      customerName: "Hidden",
      isActive: false,
      rating: 4,
    });

    const response = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.customerTestimonials}?active=false`,
    });
    const body = parseJsonBody(response.body) as Envelope<PublicReviewList>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.items).toEqual([]);
  });
});
