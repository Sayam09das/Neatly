import type { ReactElement } from "react";
import { DashboardAccountAlert } from "@/components/customer/dashboard/dashboard-account-alert";
import { DashboardEmpty } from "@/components/customer/dashboard/dashboard-empty";
import { DashboardGreeting } from "@/components/customer/dashboard/dashboard-greeting";
import { DashboardLoadError } from "@/components/customer/dashboard/dashboard-load-error";
import { DashboardNotificationPreview } from "@/components/customer/dashboard/dashboard-notification-preview";
import { DashboardQuickActions } from "@/components/customer/dashboard/dashboard-quick-actions";
import { DashboardRecentActivity } from "@/components/customer/dashboard/dashboard-recent-activity";
import { DashboardRecentQuotes } from "@/components/customer/dashboard/dashboard-recent-quotes";
import { DashboardServicesCta } from "@/components/customer/dashboard/dashboard-services-cta";
import {
  DashboardStats,
  dashboardStatsFromOverview,
} from "@/components/customer/dashboard/dashboard-stats";
import { DashboardUpcomingBooking } from "@/components/customer/dashboard/dashboard-upcoming-booking";
import { customerDashboardCopy } from "@/config/customer";
import {
  type CustomerDashboardWorkspace,
  countActiveQuotes,
  isCustomerDashboardEmpty,
} from "@/lib/customer/dashboard";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";

interface CustomerDashboardOverviewProps {
  identity: CustomerNavbarIdentity;
  workspace: CustomerDashboardWorkspace;
}

export function CustomerDashboardOverview({
  identity,
  workspace,
}: CustomerDashboardOverviewProps): ReactElement {
  if (workspace.overview === null) {
    return <DashboardLoadError />;
  }

  const quotes =
    workspace.quotes.status === "ready" ? workspace.quotes.data.items : [];
  const unread =
    workspace.notifications.status === "ready"
      ? workspace.notifications.data.unreadCount
      : null;
  const empty =
    workspace.quotes.status === "ready" &&
    isCustomerDashboardEmpty(workspace.overview, quotes, unread ?? 0);

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      <DashboardGreeting name={identity.name} />
      <DashboardAccountAlert emailVerified={workspace.accountVerified} />
      {empty ? (
        <DashboardEmpty />
      ) : (
        <>
          <DashboardStats
            {...dashboardStatsFromOverview(
              workspace.overview,
              workspace.quotes.status === "ready"
                ? countActiveQuotes(quotes)
                : null,
              unread,
            )}
          />
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
            <DashboardUpcomingBooking
              booking={workspace.overview.upcomingBooking}
            />
            <DashboardNotificationPreview
              notifications={workspace.notifications}
            />
          </div>
          {workspace.overview.summary.pending > 0 ? (
            <section className="max-w-prose">
              <h2 className="text-h2 text-foreground tracking-tight">
                {customerDashboardCopy.attentionHeading}
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                {workspace.overview.summary.pending}{" "}
                {customerDashboardCopy.attentionPending}.{" "}
                {customerDashboardCopy.attentionBody}
              </p>
            </section>
          ) : null}
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
            <DashboardRecentQuotes quotes={workspace.quotes} />
            <DashboardRecentActivity
              bookings={workspace.overview.recentBookings}
            />
          </div>
        </>
      )}
      <DashboardServicesCta />
      <DashboardQuickActions />
    </div>
  );
}
