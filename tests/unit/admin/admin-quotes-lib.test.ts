import { describe, expect, it } from "vitest";
import { defaultAdminQuoteFilters } from "@/config/admin-quotes";
import {
  countQuoteMetrics,
  filterQuotes,
  formatQuoteRequestedAt,
  hasActiveQuoteFilters,
  paginateQuotes,
  resolveQuoteDateBounds,
  shouldRenderQuotePagination,
} from "@/lib/admin/quotes";
import type { AdminQuote } from "@/types/admin-quote";

const QUOTE: AdminQuote = {
  additionalNotes: null,
  approximateSize: "Under 1,000 sq ft",
  bathrooms: 1,
  bedrooms: 2,
  createdAt: "2026-08-30T09:00:00.000Z",
  email: "ada@neatly.test",
  frequency: "WEEKLY",
  fullName: "Ada Lovelace",
  id: "quote_alpha",
  phone: "+1-555-0100",
  preferredDate: "2026-09-02T10:00:00.000Z",
  preferredTime: "Morning (8am-12pm)",
  propertyType: "HOUSE",
  serviceAddress: "123 Test Street",
  serviceId: null,
  serviceType: "RESIDENTIAL",
  status: "NEW",
  updatedAt: "2026-08-30T09:00:00.000Z",
};

describe("filterQuotes", (): void => {
  it("filters supplied quotes only and never invents rows", (): void => {
    expect(filterQuotes([], defaultAdminQuoteFilters)).toEqual([]);
    expect(
      filterQuotes([QUOTE], {
        ...defaultAdminQuoteFilters,
        status: "DECLINED",
      }),
    ).toEqual([]);
    expect(
      filterQuotes([QUOTE], {
        ...defaultAdminQuoteFilters,
        query: "quote_alpha",
      }),
    ).toEqual([QUOTE]);
    expect(
      filterQuotes([QUOTE], {
        ...defaultAdminQuoteFilters,
        query: "ada@neatly.test",
      }),
    ).toEqual([QUOTE]);
    expect(
      filterQuotes([QUOTE], {
        ...defaultAdminQuoteFilters,
        serviceType: "RESIDENTIAL",
      }),
    ).toEqual([QUOTE]);
    expect(
      filterQuotes([QUOTE], {
        ...defaultAdminQuoteFilters,
        serviceType: "COMMERCIAL",
      }),
    ).toEqual([]);
  });

  it("applies requested-date presets without inventing quotes", (): void => {
    const now = new Date("2026-09-02T15:00:00.000Z");

    expect(
      filterQuotes(
        [QUOTE],
        {
          ...defaultAdminQuoteFilters,
          dateRange: "today",
        },
        now,
      ),
    ).toEqual([QUOTE]);
    expect(
      filterQuotes(
        [QUOTE],
        {
          ...defaultAdminQuoteFilters,
          dateRange: "week",
        },
        now,
      ),
    ).toEqual([QUOTE]);
    expect(
      filterQuotes(
        [{ ...QUOTE, preferredDate: "2026-08-01T10:00:00.000Z" }],
        {
          ...defaultAdminQuoteFilters,
          dateRange: "month",
        },
        now,
      ),
    ).toEqual([]);
  });
});

describe("quote presentation helpers", (): void => {
  it("formats requested dates and keeps empty values neutral", (): void => {
    expect(formatQuoteRequestedAt("", "")).toBe("—");
    expect(formatQuoteRequestedAt("not-a-date", "")).toBe("—");
    expect(
      formatQuoteRequestedAt(QUOTE.preferredDate, QUOTE.preferredTime),
    ).toContain(QUOTE.preferredTime);
  });

  it("counts metrics from presented quotes only", (): void => {
    expect(countQuoteMetrics([])).toEqual({
      converted: 0,
      new: 0,
      quoted: 0,
      reviewing: 0,
      total: 0,
    });
    expect(countQuoteMetrics([QUOTE])).toEqual({
      converted: 0,
      new: 1,
      quoted: 0,
      reviewing: 0,
      total: 1,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveQuoteFilters(defaultAdminQuoteFilters)).toBe(false);
    expect(
      hasActiveQuoteFilters({
        ...defaultAdminQuoteFilters,
        query: "quote_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderQuotePagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderQuotePagination(
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
      shouldRenderQuotePagination(
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

  it("paginates supplied quotes without inventing extra rows", (): void => {
    const second: AdminQuote = { ...QUOTE, id: "quote_beta" };
    const result = paginateQuotes([QUOTE, second], 1, 1);

    expect(result.quotes).toEqual([QUOTE]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
  });

  it("resolves local date bounds for presets", (): void => {
    const now = new Date(2026, 8, 2, 15, 0, 0);

    expect(resolveQuoteDateBounds(defaultAdminQuoteFilters, now)).toBeNull();
    expect(
      resolveQuoteDateBounds(
        { ...defaultAdminQuoteFilters, dateRange: "today" },
        now,
      ),
    ).toEqual({
      end: new Date(2026, 8, 2, 23, 59, 59, 999),
      start: new Date(2026, 8, 2),
    });
  });
});
