import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardBookingSummary } from "@/components/customer/dashboard/dashboard-booking-summary";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

interface DashboardUpcomingBookingProps {
  booking: CustomerBookingView | null;
}

export function DashboardUpcomingBooking({
  booking,
}: DashboardUpcomingBookingProps): ReactElement {
  return (
    <section className="max-w-2xl rounded-xl border border-border p-6">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.nextBookingHeading}
      </h2>
      {booking === null ? (
        <>
          <p className="mt-3 text-body text-foreground">
            {customerDashboardCopy.nextBookingEmptyTitle}
          </p>
          <p className="mt-2 text-body text-muted-foreground">
            {customerDashboardCopy.nextBookingEmptyDescription}
          </p>
          <p className="mt-6">
            <Link
              className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CUSTOMER_PATHS.dashboardServices}
            >
              {customerDashboardCopy.nextBookingEmptyAction}
            </Link>
          </p>
        </>
      ) : (
        <DashboardBookingSummary booking={booking} />
      )}
    </section>
  );
}
