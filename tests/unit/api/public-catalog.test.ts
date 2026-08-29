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

interface PublicCatalogList {
  items: Array<{
    coverImageAlt: string | null;
    coverImageUrl: string | null;
    id: string;
    isFeatured: boolean;
    name: string;
    shortDescription: string;
    slug: string;
  }>;
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

describe("Public catalog APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("lists active services without authentication", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);

    const active = await harness.catalog.create(admin, {
      fullDescription: "A complete residential clean.",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const archived = await harness.catalog.create(admin, {
      fullDescription: "Retired offering.",
      name: "Archived Clean",
      shortDescription: "No longer listed",
    });
    await harness.catalog.archive(admin, archived.id);

    const response = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerServices,
    });
    const body = parseJsonBody(response.body) as Envelope<PublicCatalogList>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]?.id).toBe(active.id);
    expect(body.data.items[0]?.slug).toBe("home-refresh");
    expect(Object.keys(body.data.items[0] ?? {}).sort()).toEqual([
      "coverImageAlt",
      "coverImageUrl",
      "id",
      "isFeatured",
      "name",
      "shortDescription",
      "slug",
    ]);
    expect(JSON.stringify(body.data.items)).not.toContain("faqs");
    expect(JSON.stringify(body.data.items)).not.toContain("fullDescription");
  });

  it("does not expose archived services through public query parameters", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);

    await harness.catalog.create(admin, {
      fullDescription: "Visible offering.",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const archived = await harness.catalog.create(admin, {
      fullDescription: "Retired offering.",
      name: "Archived Clean",
      shortDescription: "No longer listed",
    });
    await harness.catalog.archive(admin, archived.id);

    const response = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.customerServices}?active=false`,
    });
    const body = parseJsonBody(response.body) as Envelope<PublicCatalogList>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.items.map((item) => item.id)).not.toContain(archived.id);
    expect(body.data.items).toHaveLength(1);
  });

  it("searches published names and short descriptions", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);

    await harness.catalog.create(admin, {
      fullDescription: "A complete residential clean.",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    await harness.catalog.create(admin, {
      fullDescription: "Kitchen focus.",
      name: "Studio Reset",
      shortDescription: "Appliance detail",
    });

    const response = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.customerServices}?search=appliance`,
    });
    const body = parseJsonBody(response.body) as Envelope<PublicCatalogList>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]?.slug).toBe("studio-reset");
  });
});
