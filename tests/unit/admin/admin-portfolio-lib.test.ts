import { describe, expect, it } from "vitest";
import { defaultAdminPortfolioFilters } from "@/config/admin-portfolio";
import {
  countPortfolioMetrics,
  filterPortfolioProjects,
  formatPortfolioInstant,
  getPortfolioCategoryLabel,
  getPortfolioFeaturedLabel,
  getPortfolioLocation,
  hasActivePortfolioFilters,
  paginatePortfolioProjects,
  resolvePortfolioDateBounds,
  shouldRenderPortfolioPagination,
} from "@/lib/admin/portfolio";
import type { AdminPortfolioProject } from "@/types/admin-portfolio";

const PROJECT: AdminPortfolioProject = {
  category: "RESIDENTIAL",
  createdAt: "2026-09-02T10:00:00.000Z",
  description: "A residential refresh for a test property.",
  id: "project_alpha",
  isFeatured: true,
  isPublished: true,
  location: "Test District",
  slug: "project-alpha",
  sortOrder: 1,
  title: "Project Alpha",
  updatedAt: "2026-09-02T10:00:00.000Z",
};

describe("filterPortfolioProjects", (): void => {
  it("filters supplied projects only and never invents rows", (): void => {
    expect(filterPortfolioProjects([], defaultAdminPortfolioFilters)).toEqual(
      [],
    );
    expect(
      filterPortfolioProjects([PROJECT], {
        ...defaultAdminPortfolioFilters,
        visibility: "unpublished",
      }),
    ).toEqual([]);
    expect(
      filterPortfolioProjects([PROJECT], {
        ...defaultAdminPortfolioFilters,
        category: "COMMERCIAL",
      }),
    ).toEqual([]);
    expect(
      filterPortfolioProjects([PROJECT], {
        ...defaultAdminPortfolioFilters,
        query: "project_alpha",
      }),
    ).toEqual([PROJECT]);
    expect(
      filterPortfolioProjects([PROJECT], {
        ...defaultAdminPortfolioFilters,
        query: "project-alpha",
      }),
    ).toEqual([PROJECT]);
    expect(
      filterPortfolioProjects([PROJECT], {
        ...defaultAdminPortfolioFilters,
        visibility: "published",
      }),
    ).toEqual([PROJECT]);
  });

  it("applies created-date presets without inventing projects", (): void => {
    const now = new Date("2026-09-02T15:00:00.000Z");

    expect(
      filterPortfolioProjects(
        [PROJECT],
        {
          ...defaultAdminPortfolioFilters,
          dateRange: "today",
        },
        now,
      ),
    ).toEqual([PROJECT]);
    expect(
      filterPortfolioProjects(
        [{ ...PROJECT, createdAt: "2026-08-01T10:00:00.000Z" }],
        {
          ...defaultAdminPortfolioFilters,
          dateRange: "month",
        },
        now,
      ),
    ).toEqual([]);
  });
});

describe("portfolio presentation helpers", (): void => {
  it("formats fields without inventing copy", (): void => {
    expect(formatPortfolioInstant("", { dateStyle: "medium" })).toBe("—");
    expect(formatPortfolioInstant("not-a-date", { dateStyle: "medium" })).toBe(
      "—",
    );
    expect(getPortfolioLocation(null)).toBe("—");
    expect(getPortfolioCategoryLabel("RESIDENTIAL")).toBe("Residential");
    expect(getPortfolioFeaturedLabel(true)).toBe("Featured");
  });

  it("counts metrics from presented projects only", (): void => {
    expect(countPortfolioMetrics([])).toEqual({
      featured: 0,
      published: 0,
      total: 0,
      unpublished: 0,
    });
    expect(countPortfolioMetrics([PROJECT])).toEqual({
      featured: 1,
      published: 1,
      total: 1,
      unpublished: 0,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActivePortfolioFilters(defaultAdminPortfolioFilters)).toBe(false);
    expect(
      hasActivePortfolioFilters({
        ...defaultAdminPortfolioFilters,
        query: "project_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderPortfolioPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderPortfolioPagination(
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

  it("paginates supplied projects without inventing extra rows", (): void => {
    const second: AdminPortfolioProject = { ...PROJECT, id: "project_beta" };
    const result = paginatePortfolioProjects([PROJECT, second], 1, 1);

    expect(result.projects).toEqual([PROJECT]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
  });

  it("resolves local date bounds for presets", (): void => {
    const now = new Date(2026, 8, 2, 15, 0, 0);

    expect(
      resolvePortfolioDateBounds(defaultAdminPortfolioFilters, now),
    ).toBeNull();
    expect(
      resolvePortfolioDateBounds(
        { ...defaultAdminPortfolioFilters, dateRange: "today" },
        now,
      ),
    ).toEqual({
      end: new Date(2026, 8, 2, 23, 59, 59, 999),
      start: new Date(2026, 8, 2),
    });
  });
});
