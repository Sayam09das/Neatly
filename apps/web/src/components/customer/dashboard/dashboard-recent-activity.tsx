import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardBookingSummary } from "@/components/customer/dashboard/dashboard-booking-summary";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

interface DashboardRecentActivityProps {
  bookings: readonly CustomerBookingView[];
}

export function DashboardRecentActivity({
  bookings,
}: DashboardRecentActivityProps): ReactElement {
  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerDashboardCopy.recentHeading}
        </h2>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.bookings}
        >
          {customerDashboardCopy.recentViewAll}
        </Link>
      </div>
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
