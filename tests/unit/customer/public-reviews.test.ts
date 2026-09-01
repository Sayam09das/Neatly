import { afterEach, describe, expect, it, vi } from "vitest";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import type { LandingTestimonial } from "@/config/landing";
import {
  formatPublicReviewDate,
  getPublicReviewInitials,
  getPublicReviewRatingLabel,
  loadPublicReviews,
  mapPublicReview,
  mapPublicReviewList,
} from "@/lib/customer/public-reviews";

vi.mock("@neatly/config/server", () => ({
  loadServerEnv: (): { NEATLY_API_URL: string } => ({
    NEATLY_API_URL: "http://127.0.0.1:4010",
  }),
}));

const publicReview = {
  content: "The team left the kitchen spotless.",
  createdAt: "2026-08-12T10:00:00.000Z",
  customerName: "Ada Lovelace",
  customerRole: "Westside",
  featured: true,
  id: "rev_1",
  rating: 5,
  serviceCategory: "RESIDENTIAL",
};

describe("public reviews mapping", (): void => {
  it("maps customer-facing fields and strips private metadata", (): void => {
    const mapped = mapPublicReview(publicReview);

    expect(mapped).toEqual({
      date: "August 2026",
      featured: true,
      id: "rev_1",
      location: "Westside",
      name: "Ada Lovelace",
      quote: "The team left the kitchen spotless.",
      rating: 5,
      service: "Residential",
    } satisfies LandingTestimonial);
    expect(JSON.stringify(mapped)).not.toContain("customerId");
    expect(JSON.stringify(mapped)).not.toContain("bookingId");
    expect(JSON.stringify(mapped)).not.toContain("avatarMediaId");
    expect(JSON.stringify(mapped)).not.toContain("email");
    expect(mapPublicReview({ customerName: "Broken" })).toBeNull();
    expect(mapPublicReviewList({ items: [publicReview] })).toHaveLength(1);
    expect(mapPublicReviewList({ items: [{ name: "Broken" }] })).toBeNull();
    expect(getPublicReviewRatingLabel(5)).toBe("5 out of 5 stars");
    expect(getPublicReviewInitials("Ada Lovelace")).toBe("AL");
    expect(formatPublicReviewDate("not-a-date")).toBeUndefined();
  });
});

describe("loadPublicReviews", (): void => {
  afterEach((): void => {
    vi.unstubAllGlobals();
  });

  it("loads active testimonials from the public customer API", async (): Promise<void> => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async (): Promise<unknown> => ({
        data: { items: [publicReview] },
        success: true,
      }),
      status: 200,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await loadPublicReviews();

    expect(result).toEqual({
      items: [
        {
          date: "August 2026",
          featured: true,
          id: "rev_1",
          location: "Westside",
          name: "Ada Lovelace",
          quote: "The team left the kitchen spotless.",
          rating: 5,
          service: "Residential",
        },
      ],
      ok: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      `http://127.0.0.1:4010${CUSTOMER_API_PATHS.testimonials}`,
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

    expect(await loadPublicReviews()).toEqual({ items: [], ok: false });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<unknown> => ({
          data: { items: [{ customerName: "Broken" }] },
          success: true,
        }),
        status: 200,
      }),
    );

    expect(await loadPublicReviews()).toEqual({ items: [], ok: false });
  });
});
