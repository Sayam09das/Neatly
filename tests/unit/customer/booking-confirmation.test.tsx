/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingConfirmation } from "@/components/customer/booking/booking-confirmation";
import {
  customerBookingConfirmationCopy,
  customerBookingStatusLabels,
} from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

const booking: CustomerBookingView = {
  id: "bk_10482",
  linkedToQuote: true,
  notes: null,
  scheduledAt: "2026-09-12T10:00:00.000Z",
  service: { id: "svc_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "PENDING",
};

describe("BookingConfirmation", (): void => {
  it("shows the real booking state without treating pending as confirmed", (): void => {
    render(<BookingConfirmation booking={booking} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: customerBookingConfirmationCopy.pendingHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(booking.id)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(customerBookingStatusLabels.PENDING)),
    ).toBeInTheDocument();
    expect(screen.getByText("Home Refresh")).toBeInTheDocument();
    expect(screen.getByText("12 Harbour Street")).toBeInTheDocument();
    expect(
      screen.getByText(customerBookingConfirmationCopy.linkedQuote),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/your booking is confirmed/i),
    ).not.toBeInTheDocument();
  });
});
