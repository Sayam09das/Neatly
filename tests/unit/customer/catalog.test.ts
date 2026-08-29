import { afterEach, describe, expect, it, vi } from "vitest";
import { CUSTOMER_PATHS } from "@/config/customer";
import {
  customerServicesHref,
  isLocalCustomerServiceImage,
  loadPublicCatalog,
  mapPublicCatalogList,
  parseCustomerServicesSearchParams,
} from "@/lib/customer/catalog";

vi.mock("@neatly/config/server", () => ({
  loadServerEnv: (): { NEATLY_API_URL: string } => ({
    NEATLY_API_URL: "http://127.0.0.1:4010",
  }),
}));

const catalogItem = {
  coverImageAlt: "A tidy kitchen",
  coverImageUrl: "/media/kitchen.jpg",
  id: "svc_1",
  isFeatured: true,
  name: "Home Refresh",
  shortDescription: "Weekly tidy",
  slug: "home-refresh",
};

describe("customer services query", (): void => {
  it("reads shareable search and page state from the URL", (): void => {
    expect(
      parseCustomerServicesSearchParams({ q: "  deep  ", page: "2" }),
    ).toEqual({ page: 2, q: "deep" });
    expect(
      parseCustomerServicesSearchParams({ q: ["move"], page: "0" }),
    ).toEqual({ page: 1, q: "move" });
    expect(customerServicesHref({ page: 1, q: "" })).toBe(
      CUSTOMER_PATHS.services,
    );
    expect(customerServicesHref({ page: 2, q: "deep" })).toBe(
      "/services?q=deep&page=2",
    );
  });

  it("maps public catalog payloads and rejects admin fields as the card model", (): void => {
    const mapped = mapPublicCatalogList({
      items: [catalogItem],
      pagination: { limit: 20, page: 1, total: 1, totalPages: 1 },
    });

    expect(mapped).toEqual({
      pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      services: [catalogItem],
    });
    expect(mapPublicCatalogList({ items: [{ name: "Broken" }] })).toBeNull();
    expect(isLocalCustomerServiceImage("/media/kitchen.jpg")).toBe(true);
    expect(isLocalCustomerServiceImage("https://cdn.example/kitchen.jpg")).toBe(
      false,
    );
    expect(isLocalCustomerServiceImage("//cdn.example/kitchen.jpg")).toBe(
      false,
    );
  });
});

describe("loadPublicCatalog", (): void => {
  afterEach((): void => {
    vi.unstubAllGlobals();
  });

  it("loads published services from the customer catalog API", async (): Promise<void> => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async (): Promise<unknown> => ({
        data: {
          items: [catalogItem],
          pagination: { limit: 20, page: 1, total: 1, totalPages: 1 },
        },
        success: true,
      }),
      status: 200,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await loadPublicCatalog({ page: 1, q: "tidy" });

    expect(result).toEqual({
      list: {
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
        services: [catalogItem],
      },
      ok: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "http://127.0.0.1:4010/api/v1/customer/services?search=tidy",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("fails closed on network errors and malformed payloads", async (): Promise<void> => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    );

    expect(await loadPublicCatalog({ page: 1, q: "" })).toEqual({ ok: false });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<unknown> => ({
          success: true,
          data: { items: [] },
        }),
        status: 200,
      }),
    );

    expect(await loadPublicCatalog({ page: 1, q: "" })).toEqual({ ok: false });
  });
});
