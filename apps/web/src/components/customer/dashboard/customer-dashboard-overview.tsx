import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { DashboardBookingCounts } from "@/components/customer/dashboard/dashboard-booking-counts";
import { DashboardQuickActions } from "@/components/customer/dashboard/dashboard-quick-actions";
import { DashboardRecentActivity } from "@/components/customer/dashboard/dashboard-recent-activity";
import { DashboardUpcomingBooking } from "@/components/customer/dashboard/dashboard-upcoming-booking";
import { customerDashboardCopy } from "@/config/customer";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";
import { customerFirstName } from "@/lib/customer/schedule";
import type { CustomerOverview } from "@/types/customer";

interface CustomerDashboardOverviewProps {
  identity: CustomerNavbarIdentity;
  overview: CustomerOverview | null;
}

export function CustomerDashboardOverview({
  identity,
  overview,
}: CustomerDashboardOverviewProps): ReactElement {
  if (overview === null) {
    return <CustomerRefreshErrorState />;
  }

  const firstName = customerFirstName(identity.name);
  const greeting =
    firstName === ""
      ? customerDashboardCopy.greetingFallback
      : customerDashboardCopy.greetingNamed.replace("{name}", firstName);

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">{greeting}</h1>
        <p className="mt-3 text-body text-muted-foreground">
          {customerDashboardCopy.summaryHeading}
        </p>
      </header>
      <DashboardUpcomingBooking booking={overview.upcomingBooking} />
      <DashboardBookingCounts overview={overview} />
      {overview.summary.pending > 0 ? (
        <section className="max-w-prose">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerDashboardCopy.attentionHeading}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">
            {overview.summary.pending} {customerDashboardCopy.attentionPending}.{" "}
            {customerDashboardCopy.attentionBody}
          </p>
        </section>
      ) : null}
      <DashboardRecentActivity bookings={overview.recentBookings} />
      <DashboardQuickActions />
    </div>
  );
}
