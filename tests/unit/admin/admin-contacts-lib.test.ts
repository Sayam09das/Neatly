import { describe, expect, it } from "vitest";
import { defaultAdminContactFilters } from "@/config/admin-contacts";
import {
  countContactMetrics,
  filterContacts,
  formatContactInstant,
  getContactMessagePreview,
  hasActiveContactFilters,
  paginateContacts,
  resolveContactDateBounds,
  shouldRenderContactPagination,
} from "@/lib/admin/contacts";
import type { AdminContact } from "@/types/admin-contact";

const CONTACT: AdminContact = {
  adminNotes: null,
  createdAt: "2026-09-02T10:00:00.000Z",
  email: "ada@neatly.test",
  fullName: "Ada Lovelace",
  id: "contact_alpha",
  message: "Please confirm weekend availability for a commercial office.",
  phone: null,
  status: "NEW",
  subject: "Office cleaning inquiry",
  updatedAt: "2026-09-02T10:00:00.000Z",
};

describe("filterContacts", (): void => {
  it("filters supplied contacts only and never invents rows", (): void => {
    expect(filterContacts([], defaultAdminContactFilters)).toEqual([]);
    expect(
      filterContacts([CONTACT], {
        ...defaultAdminContactFilters,
        status: "ARCHIVED",
      }),
    ).toEqual([]);
    expect(
      filterContacts([CONTACT], {
        ...defaultAdminContactFilters,
        query: "contact_alpha",
      }),
    ).toEqual([CONTACT]);
    expect(
      filterContacts([CONTACT], {
        ...defaultAdminContactFilters,
        query: "ada@neatly.test",
      }),
    ).toEqual([CONTACT]);
    expect(
      filterContacts([CONTACT], {
        ...defaultAdminContactFilters,
        query: "office cleaning",
      }),
    ).toEqual([CONTACT]);
  });

  it("applies created-date presets without inventing contacts", (): void => {
    const now = new Date("2026-09-02T15:00:00.000Z");

    expect(
      filterContacts(
        [CONTACT],
        {
          ...defaultAdminContactFilters,
          dateRange: "today",
        },
        now,
      ),
    ).toEqual([CONTACT]);
    expect(
      filterContacts(
        [{ ...CONTACT, createdAt: "2026-08-01T10:00:00.000Z" }],
        {
          ...defaultAdminContactFilters,
          dateRange: "month",
        },
        now,
      ),
    ).toEqual([]);
  });
});

describe("contact presentation helpers", (): void => {
  it("formats instants and message previews without inventing copy", (): void => {
    expect(formatContactInstant("", { dateStyle: "medium" })).toBe("—");
    expect(formatContactInstant("not-a-date", { dateStyle: "medium" })).toBe(
      "—",
    );
    expect(getContactMessagePreview("")).toBe("—");
    expect(getContactMessagePreview(CONTACT.message)).toBe(CONTACT.message);
  });

  it("counts metrics from presented contacts only", (): void => {
    expect(countContactMetrics([])).toEqual({
      archived: 0,
      new: 0,
      read: 0,
      responded: 0,
      total: 0,
    });
    expect(countContactMetrics([CONTACT])).toEqual({
      archived: 0,
      new: 1,
      read: 0,
      responded: 0,
      total: 1,
    });
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveContactFilters(defaultAdminContactFilters)).toBe(false);
    expect(
      hasActiveContactFilters({
        ...defaultAdminContactFilters,
        query: "contact_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderContactPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderContactPagination(
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

  it("paginates supplied contacts without inventing extra rows", (): void => {
    const second: AdminContact = { ...CONTACT, id: "contact_beta" };
    const result = paginateContacts([CONTACT, second], 1, 1);

    expect(result.contacts).toEqual([CONTACT]);
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
      resolveContactDateBounds(defaultAdminContactFilters, now),
    ).toBeNull();
    expect(
      resolveContactDateBounds(
        { ...defaultAdminContactFilters, dateRange: "today" },
        now,
      ),
    ).toEqual({
      end: new Date(2026, 8, 2, 23, 59, 59, 999),
      start: new Date(2026, 8, 2),
    });
  });
});
