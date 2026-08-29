/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerBookingDetails } from "@/components/customer/bookings/customer-booking-details";
import {
  CUSTOMER_PATHS,
  customerBookingDetailCopy,
  customerBookingStatusLabels,
} from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

const booking: CustomerBookingView = {
  id: "booking_own_1",
  linkedToQuote: true,
  notes: "Please use the side entrance.",
  scheduledAt: "2026-09-04T10:00:00.000Z",
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "CONFIRMED",
};

describe("CustomerBookingDetails", (): void => {
  it("renders customer-safe booking fields without mutations or admin notes", (): void => {
    render(<CustomerBookingDetails booking={booking} />);

    expect(
      screen.getByRole("heading", { name: "Home Refresh" }),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.id)).toBeInTheDocument();
    expect(
      screen.getByText(customerBookingStatusLabels.CONFIRMED),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.serviceAddress ?? "")).toBeInTheDocument();
    expect(screen.getByText(booking.notes ?? "")).toBeInTheDocument();
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
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
    expect(screen.queryByText("adminNotes")).not.toBeInTheDocument();
    expect(screen.queryByText("cleanerId")).not.toBeInTheDocument();
  });
});
