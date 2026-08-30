import { describe, expect, it } from "vitest";
import { defaultAdminNewsletterFilters } from "@/config/admin-newsletter";
import {
  countNewsletterMetrics,
  filterNewsletterSubscribers,
  formatNewsletterInstant,
  hasActiveNewsletterFilters,
  paginateNewsletterSubscribers,
  shouldRenderNewsletterPagination,
} from "@/lib/admin/newsletter";
import type { AdminNewsletterSubscriber } from "@/types/admin-newsletter";

const SUBSCRIBER: AdminNewsletterSubscriber = {
  createdAt: "2026-09-02T10:00:00.000Z",
  email: "ada@neatly.test",
  id: "subscriber_alpha",
  status: "SUBSCRIBED",
  subscribedAt: "2026-09-02T10:00:00.000Z",
  unsubscribedAt: null,
  updatedAt: "2026-09-02T10:00:00.000Z",
};

describe("filterNewsletterSubscribers", (): void => {
  it("filters supplied subscribers only and never invents rows", (): void => {
    expect(
      filterNewsletterSubscribers([], defaultAdminNewsletterFilters),
    ).toEqual([]);
    expect(
      filterNewsletterSubscribers([SUBSCRIBER], {
        ...defaultAdminNewsletterFilters,
        status: "UNSUBSCRIBED",
      }),
    ).toEqual([]);
    expect(
      filterNewsletterSubscribers([SUBSCRIBER], {
        ...defaultAdminNewsletterFilters,
        query: "subscriber_alpha",
      }),
    ).toEqual([SUBSCRIBER]);
    expect(
      filterNewsletterSubscribers([SUBSCRIBER], {
        ...defaultAdminNewsletterFilters,
        query: "ada@neatly.test",
      }),
    ).toEqual([SUBSCRIBER]);
    expect(
      filterNewsletterSubscribers([SUBSCRIBER], {
        ...defaultAdminNewsletterFilters,
        status: "SUBSCRIBED",
      }),
    ).toEqual([SUBSCRIBER]);
  });

  it("applies subscribed-date presets without inventing subscribers", (): void => {
    const now = new Date("2026-09-02T15:00:00.000Z");

    expect(
      filterNewsletterSubscribers(
        [SUBSCRIBER],
        {
          ...defaultAdminNewsletterFilters,
          dateRange: "today",
        },
        now,
      ),
    ).toEqual([SUBSCRIBER]);
    expect(
      filterNewsletterSubscribers(
        [{ ...SUBSCRIBER, subscribedAt: "2026-08-01T10:00:00.000Z" }],
        {
          ...defaultAdminNewsletterFilters,
          dateRange: "month",
        },
        now,
      ),
    ).toEqual([]);
  });
});

describe("newsletter presentation helpers", (): void => {
  it("formats instants without inventing copy", (): void => {
    expect(formatNewsletterInstant(null, { dateStyle: "medium" })).toBe("—");
    expect(formatNewsletterInstant("not-a-date", { dateStyle: "medium" })).toBe(
      "—",
    );
  });

  it("counts metrics from presented subscribers only", (): void => {
    expect(countNewsletterMetrics([])).toEqual({
      subscribed: 0,
      total: 0,
      unsubscribed: 0,
    });
    expect(countNewsletterMetrics([SUBSCRIBER])).toEqual({
      subscribed: 1,
      total: 1,
      unsubscribed: 0,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveNewsletterFilters(defaultAdminNewsletterFilters)).toBe(
      false,
    );
    expect(
      hasActiveNewsletterFilters({
        ...defaultAdminNewsletterFilters,
        query: "subscriber_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderNewsletterPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderNewsletterPagination(
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

  it("paginates supplied subscribers without inventing extra rows", (): void => {
    const second: AdminNewsletterSubscriber = {
      ...SUBSCRIBER,
      id: "subscriber_beta",
    };
    const result = paginateNewsletterSubscribers([SUBSCRIBER, second], 1, 1);

    expect(result.subscribers).toEqual([SUBSCRIBER]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 1,
      total: 2,
      totalPages: 2,
    });
  });
});
