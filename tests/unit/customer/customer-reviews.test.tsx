/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerReviews } from "@/components/customer/reviews/customer-reviews";
import {
  customerBookingDetailPath,
  customerReviewsCopy,
} from "@/config/customer";
import type { CustomerReviewWorkspace } from "@/types/customer";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard/reviews",
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

const workspace: CustomerReviewWorkspace = {
  eligibleBookings: [
    {
      id: "booking_ready_1",
      scheduledAt: "2026-08-01T10:00:00.000Z",
      service: { id: "service_1", name: "Home Refresh" },
      status: "COMPLETED",
    },
  ],
  reviews: [
    {
      bookingId: "booking_done_1",
      content: "The team was careful and on time.",
      createdAt: "2026-08-02T10:00:00.000Z",
      id: "review_1",
      rating: 5,
      serviceName: "Office Clean",
      status: "pending",
    },
  ],
};

describe("CustomerReviews", (): void => {
  it("renders real eligible bookings and submitted reviews", (): void => {
    render(<CustomerReviews bookingId={null} workspace={workspace} />);

    expect(
      screen.getByRole("heading", { name: customerReviewsCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText("Home Refresh")).toBeInTheDocument();
    expect(screen.getByText("Office Clean")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerReviewsCopy.viewBooking }),
    ).toHaveAttribute("href", customerBookingDetailPath("booking_done_1"));
    expect(
      screen.getByText("The team was careful and on time."),
    ).toBeInTheDocument();
  });
});
