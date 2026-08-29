import Link from "next/link";
import type { ReactElement } from "react";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";
import {
  customerBookingDetailCopy,
  customerBookingDetailPath,
  customerDashboardCopy,
} from "@/config/customer";
import { formatCustomerSchedule } from "@/lib/customer/schedule";
import type { CustomerBookingView } from "@/types/customer";

interface DashboardBookingSummaryProps {
  booking: CustomerBookingView;
  compact?: boolean;
}

export function DashboardBookingSummary({
  booking,
  compact = false,
}: DashboardBookingSummaryProps): ReactElement {
  const schedule = formatCustomerSchedule(booking.scheduledAt);

  return (
    <div className={compact ? "p-4" : "mt-4"}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium text-body text-foreground">
          {booking.service?.name ?? customerBookingDetailCopy.unnamedService}
        </p>
        <BookingStatusBadge status={booking.status} />
      </div>
      {schedule === null ? null : (
        <p className="mt-2 text-body-small text-muted-foreground">{schedule}</p>
      )}
      <p className="mt-3">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerBookingDetailPath(booking.id)}
        >
          {customerDashboardCopy.viewBooking}
        </Link>
      </p>
    </div>
  );
}
