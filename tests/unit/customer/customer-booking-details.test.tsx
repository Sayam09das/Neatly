/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerBookingDetails } from "@/components/customer/bookings/customer-booking-details";
import {
  CUSTOMER_PATHS,
  customerBookingDetailCopy,
  customerBookingStatusLabels,
} from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/dashboard/bookings/booking_own_1",
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

const booking: CustomerBookingView = {
  actions: { canCancel: true, canUpdate: true },
  id: "booking_own_1",
  linkedToQuote: true,
  notes: "Please use the side entrance.",
  scheduledAt: "2026-09-04T10:00:00.000Z",
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "CONFIRMED",
};

describe("CustomerBookingDetails", (): void => {
  it("renders customer-safe booking fields and permitted management actions", (): void => {
    render(<CustomerBookingDetails booking={booking} review={null} />);

    expect(
      screen.getByRole("heading", { name: "Home Refresh" }),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.id)).toBeInTheDocument();
    expect(
      screen.getByText(customerBookingStatusLabels.CONFIRMED),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.serviceAddress ?? "")).toBeInTheDocument();
    expect(screen.getAllByText(booking.notes ?? "").length).toBeGreaterThan(0);
    expect(
      screen.getByText(customerBookingDetailCopy.linkedQuote),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: customerBookingDetailCopy.backToBookings,
      }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.bookings);
    expect(
      screen.getByRole("navigation", {
        name: customerBookingDetailCopy.breadcrumbLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel booking" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("adminNotes")).not.toBeInTheDocument();
    expect(screen.queryByText("cleanerId")).not.toBeInTheDocument();
  });
});
