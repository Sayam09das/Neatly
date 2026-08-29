/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerNotifications } from "@/components/customer/notifications/customer-notifications";
import {
  CUSTOMER_PATHS,
  customerEmptyCopy,
  customerNotificationsCopy,
} from "@/config/customer";
import type { CustomerNotificationList } from "@/types/customer";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard/notifications",
  useRouter: (): { refresh: () => void } => ({ refresh: vi.fn() }),
}));

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

const list: CustomerNotificationList = {
  items: [
    {
      createdAt: "2026-08-29T10:00:00.000Z",
      id: "ntf_unread_1",
      isRead: false,
      message: "Your booking request was received.",
      readAt: null,
      relatedHref: "/dashboard/bookings/booking_1",
      relatedLabel: "View booking",
      title: "Booking requested",
    },
    {
      createdAt: "2026-08-28T10:00:00.000Z",
      id: "ntf_read_1",
      isRead: true,
      message: "Your review was submitted and is awaiting publication.",
      readAt: "2026-08-28T11:00:00.000Z",
      relatedHref: "/dashboard/reviews",
      relatedLabel: "View reviews",
      title: "Review submitted",
    },
  ],
  pagination: {
    limit: 20,
    page: 1,
    total: 2,
    totalPages: 1,
  },
};

describe("CustomerNotifications", (): void => {
  it("renders real inbox rows without inventing records", (): void => {
    render(<CustomerNotifications list={list} query={{ page: 1 }} />);

    expect(
      screen.getByRole("heading", {
        name: customerNotificationsCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Booking requested")).toBeInTheDocument();
    expect(screen.getByText("Review submitted")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View booking" })).toHaveAttribute(
      "href",
      "/dashboard/bookings/booking_1",
    );
    expect(
      screen.getByRole("button", {
        name: customerNotificationsCopy.markAllAction,
      }),
    ).toBeEnabled();
    expect(screen.queryByText("recipientId")).not.toBeInTheDocument();
  });

  it("uses the empty state when the inbox has no rows", (): void => {
    render(
      <CustomerNotifications
        list={{
          items: [],
          pagination: { limit: 20, page: 1, total: 0, totalPages: 0 },
        }}
        query={{ page: 1 }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: customerEmptyCopy.notifications.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: customerNotificationsCopy.markAllAction,
      }),
    ).not.toBeInTheDocument();
    expect(CUSTOMER_PATHS.notifications).toBe("/dashboard/notifications");
  });
});
