import type { ReactElement } from "react";
import { DashboardBookingSummary } from "@/components/customer/dashboard/dashboard-booking-summary";
import { customerDashboardCopy } from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

interface DashboardRecentActivityProps {
  bookings: readonly CustomerBookingView[];
}

export function DashboardRecentActivity({
  bookings,
}: DashboardRecentActivityProps): ReactElement {
  return (
    <section className="max-w-2xl">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.recentHeading}
      </h2>
      {bookings.length === 0 ? (
        <p className="mt-3 text-body text-muted-foreground">
          {customerDashboardCopy.recentEmpty}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <DashboardBookingSummary booking={booking} compact />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
