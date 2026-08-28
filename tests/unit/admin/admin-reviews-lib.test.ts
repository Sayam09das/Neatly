import { describe, expect, it } from "vitest";
import {
  adminReviewCopy,
  defaultAdminReviewFilters,
  getAdminReviewDetailsPath,
} from "@/config/admin-reviews";
import {
  filterReviews,
  formatReviewDate,
  getAverageReviewRating,
  getReviewerLabel,
  getReviewPreview,
  getReviewRatingLabel,
  getReviewStatusLabel,
  hasActiveReviewFilters,
  shouldRenderReviewPagination,
} from "@/lib/admin/reviews";
import type { AdminReview } from "@/types/admin-review";

const REVIEW: AdminReview = {
  content: "supplied review copy for filter tests",
  createdAt: "2026-03-12T10:00:00.000Z",
  customerName: "Alpha Reviewer",
  customerRole: null,
  id: "review_alpha",
  isActive: true,
  isFeatured: null,
  rating: 4,
  serviceCategory: "RESIDENTIAL",
};

describe("filterReviews", (): void => {
  it("filters supplied reviews only and never invents rows", (): void => {
    expect(filterReviews([], defaultAdminReviewFilters)).toEqual([]);
    expect(
      filterReviews([REVIEW], {
        ...defaultAdminReviewFilters,
        query: "missing",
      }),
    ).toEqual([]);
    expect(
      filterReviews([REVIEW], {
        ...defaultAdminReviewFilters,
        query: "review_alpha",
      }),
    ).toEqual([REVIEW]);
    expect(
      filterReviews([REVIEW], {
        ...defaultAdminReviewFilters,
        rating: "4",
      }),
    ).toEqual([REVIEW]);
    expect(
      filterReviews([REVIEW], {
        ...defaultAdminReviewFilters,
        rating: "5",
      }),
    ).toEqual([]);
  });
});

describe("review presentation helpers", (): void => {
  it("formats supplied dates and keeps empty values neutral", (): void => {
    expect(formatReviewDate(null)).toBe(adminReviewCopy.emptyValue);
    expect(formatReviewDate("not-a-date")).toBe(adminReviewCopy.emptyValue);
    expect(formatReviewDate(REVIEW.createdAt)).not.toBe(
      adminReviewCopy.emptyValue,
    );
    expect(getReviewerLabel(null)).toBe(adminReviewCopy.emptyValue);
    expect(getReviewStatusLabel(null)).toBe(adminReviewCopy.emptyValue);
    expect(getReviewStatusLabel(true)).toBe("Active");
    expect(getReviewStatusLabel(false)).toBe("Inactive");
    expect(getReviewRatingLabel(null)).toBe(adminReviewCopy.emptyValue);
    expect(getReviewRatingLabel(4)).toBe("4 out of 5 stars");
  });

  it("collapses long review text without inventing copy", (): void => {
    const longContent = "x".repeat(200);
    const preview = getReviewPreview(longContent);

    expect(preview.isCollapsed).toBe(true);
    expect(preview.text.endsWith("…")).toBe(true);
    expect(getReviewPreview(null)).toEqual({
      isCollapsed: false,
      text: adminReviewCopy.emptyValue,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveReviewFilters(defaultAdminReviewFilters)).toBe(false);
    expect(
      hasActiveReviewFilters({
        ...defaultAdminReviewFilters,
        query: "review_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderReviewPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderReviewPagination(
        {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
        0,
      ),
    ).toBe(false);
    expect(
      shouldRenderReviewPagination(
        {
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        },
        10,
      ),
    ).toBe(true);
    expect(getAverageReviewRating([])).toBeNull();
    expect(getAdminReviewDetailsPath("review_alpha")).toBe(
      "/admin/reviews/review_alpha",
    );
  });
});
