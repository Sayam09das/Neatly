import { describe, expect, it } from "vitest";
import {
  countActiveQuotes,
  isCustomerDashboardEmpty,
  previewNotifications,
  previewQuotes,
} from "@/lib/customer/dashboard";
import type {
  CustomerNotification,
  CustomerOverview,
  CustomerQuoteView,
} from "@/types/customer";

const quote = (status: CustomerQuoteView["status"]): CustomerQuoteView => ({
  additionalNotes: null,
  approximateSize: "1,000-2,000 sq ft",
  bathrooms: 1,
  bedrooms: 2,
  createdAt: "2026-08-30T10:00:00.000Z",
  email: "ada@neatly.example",
  frequency: "ONE_TIME",
  fullName: "Ada Lovelace",
  id: `quote_${status}`,
  phone: "9876543210",
  preferredDate: "2026-09-04T00:00:00.000Z",
  preferredTime: "Morning (8am-12pm)",
  propertyType: "APARTMENT",
  serviceAddress: "12 Harbour Street",
  serviceId: null,
  serviceType: "RESIDENTIAL",
  status,
});

const emptyOverview: CustomerOverview = {
  recentBookings: [],
  summary: { completed: 0, pending: 0, total: 0, upcoming: 0 },
  upcomingBooking: null,
};

describe("customer dashboard helpers", (): void => {
  it("counts only active quote statuses", (): void => {
    expect(
      countActiveQuotes([
        quote("NEW"),
        quote("QUOTED"),
        quote("CONVERTED"),
        quote("DECLINED"),
      ]),
    ).toBe(2);
  });

  it("limits quote and notification previews", (): void => {
    const quotes = [
      quote("NEW"),
      quote("QUOTED"),
      quote("REVIEWING"),
      quote("CONTACTED"),
    ];
    expect(previewQuotes(quotes)).toHaveLength(3);

    const items: CustomerNotification[] = [
      {
        createdAt: "2026-08-30T10:00:00.000Z",
        id: "n1",
        isRead: true,
        message: "Read update",
        readAt: "2026-08-30T11:00:00.000Z",
        relatedHref: null,
        relatedLabel: null,
        title: "Read",
      },
      {
        createdAt: "2026-08-30T12:00:00.000Z",
        id: "n2",
        isRead: false,
        message: "Unread update",
        readAt: null,
        relatedHref: null,
        relatedLabel: null,
        title: "Unread",
      },
    ];

    expect(previewNotifications(items).map((item) => item.id)).toEqual(["n2"]);
  });

  it("treats a customer with no bookings or quotes as empty", (): void => {
    expect(isCustomerDashboardEmpty(emptyOverview, [], 0)).toBe(true);
    expect(isCustomerDashboardEmpty(emptyOverview, [quote("NEW")], 0)).toBe(
      false,
    );
    expect(isCustomerDashboardEmpty(emptyOverview, [], 2)).toBe(false);
  });
});
