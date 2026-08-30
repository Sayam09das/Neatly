import { describe, expect, it } from "vitest";
import { defaultAdminBlogFilters } from "@/config/admin-blog";
import {
  countBlogMetrics,
  filterBlogPosts,
  formatBlogInstant,
  getBlogExcerptPreview,
  getBlogTagsLabel,
  getBlogTitle,
  hasActiveBlogFilters,
  paginateBlogPosts,
  shouldRenderBlogPagination,
} from "@/lib/admin/blog";
import type { AdminBlogPost } from "@/types/admin-blog";

const POST: AdminBlogPost = {
  authorId: "admin_test",
  categoryId: null,
  categoryName: null,
  content: "Keep high-traffic rooms on a weekly cadence.",
  createdAt: "2026-09-02T10:00:00.000Z",
  excerpt: "Cleaning tips for busy weeks.",
  id: "post_alpha",
  publishedAt: null,
  seoDescription: null,
  seoTitle: null,
  slug: "cleaning-tips",
  status: "DRAFT",
  tags: ["tips"],
  title: "Cleaning tips",
  updatedAt: "2026-09-02T10:00:00.000Z",
};

describe("filterBlogPosts", (): void => {
  it("filters supplied posts only and never invents rows", (): void => {
    expect(filterBlogPosts([], defaultAdminBlogFilters)).toEqual([]);
    expect(
      filterBlogPosts([POST], {
        ...defaultAdminBlogFilters,
        status: "PUBLISHED",
      }),
    ).toEqual([]);
    expect(
      filterBlogPosts([POST], {
        ...defaultAdminBlogFilters,
        query: "post_alpha",
      }),
    ).toEqual([POST]);
    expect(
      filterBlogPosts([POST], {
        ...defaultAdminBlogFilters,
        query: "cleaning tips",
      }),
    ).toEqual([POST]);
    expect(
      filterBlogPosts([POST], {
        ...defaultAdminBlogFilters,
        status: "DRAFT",
      }),
    ).toEqual([POST]);
  });

  it("applies created-date presets without inventing posts", (): void => {
    const now = new Date("2026-09-02T15:00:00.000Z");

    expect(
      filterBlogPosts(
        [POST],
        {
          ...defaultAdminBlogFilters,
          dateRange: "today",
        },
        now,
      ),
    ).toEqual([POST]);
    expect(
      filterBlogPosts(
        [{ ...POST, createdAt: "2026-08-01T10:00:00.000Z" }],
        {
          ...defaultAdminBlogFilters,
          dateRange: "month",
        },
        now,
      ),
    ).toEqual([]);
  });
});

describe("blog presentation helpers", (): void => {
  it("formats fields without inventing copy", (): void => {
    expect(formatBlogInstant(null, { dateStyle: "medium" })).toBe("—");
    expect(formatBlogInstant("not-a-date", { dateStyle: "medium" })).toBe("—");
    expect(getBlogTitle("")).toBe("—");
    expect(getBlogTagsLabel([])).toBe("No tags were added.");
    expect(getBlogExcerptPreview(POST.excerpt)).toBe(POST.excerpt);
  });

  it("counts metrics from presented posts only", (): void => {
    expect(countBlogMetrics([])).toEqual({
      archived: 0,
      draft: 0,
      published: 0,
      total: 0,
    });
    expect(countBlogMetrics([POST])).toEqual({
      archived: 0,
      draft: 1,
      published: 0,
      total: 1,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveBlogFilters(defaultAdminBlogFilters)).toBe(false);
    expect(
      hasActiveBlogFilters({
        ...defaultAdminBlogFilters,
        query: "post_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderBlogPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderBlogPagination(
        {
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        },
        10,
      ),
    ).toBe(true);
  });

  it("paginates supplied posts without inventing extra rows", (): void => {
    const second: AdminBlogPost = { ...POST, id: "post_beta" };
    const result = paginateBlogPosts([POST, second], 1, 1);

    expect(result.posts).toEqual([POST]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
  });
});
