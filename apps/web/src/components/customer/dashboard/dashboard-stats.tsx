import type { ReactElement } from "react";
import { customerDashboardCopy } from "@/config/customer";
import { formatCustomerRelativeTime } from "@/lib/customer/schedule";
import type { CustomerOverview } from "@/types/customer";

interface DashboardStatsProps {
  completed: number;
  pendingQuotes: number | null;
  unreadNotifications: number | null;
  upcoming: number;
  upcomingAt: string | null;
}

export function DashboardStats({
  completed,
  pendingQuotes,
  unreadNotifications,
  upcoming,
  upcomingAt,
}: DashboardStatsProps): ReactElement {
  const upcomingWhen =
    upcomingAt === null ? null : formatCustomerRelativeTime(upcomingAt);
  const items = [
    {
      hint:
        upcoming > 0 && upcomingWhen !== null
          ? customerDashboardCopy.nextBookingHint.replace(
              "{when}",
              upcomingWhen,
            )
          : null,
      label: customerDashboardCopy.summaryUpcoming,
      value: upcoming,
    },
    pendingQuotes === null
      ? null
      : {
          hint:
            pendingQuotes > 0 ? customerDashboardCopy.quotesPendingHint : null,
          label: customerDashboardCopy.summaryPending,
          value: pendingQuotes,
        },
    {
      hint: customerDashboardCopy.summaryCompletedHint,
      label: customerDashboardCopy.summaryCompleted,
      value: completed,
    },
    unreadNotifications === null
      ? null
      : {
          hint: customerDashboardCopy.notificationsUnreadHint,
          label: customerDashboardCopy.summaryNotifications,
          value: unreadNotifications,
        },
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <section>
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.summaryHeading}
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-xl border border-border p-4" key={item.label}>
            <dt className="text-caption text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-h3 text-foreground">{item.value}</dd>
            {item.hint === null ? null : (
              <p className="mt-1 text-caption text-muted-foreground">
                {item.hint}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

export function dashboardStatsFromOverview(
  overview: CustomerOverview,
  pendingQuotes: number | null,
  unreadNotifications: number | null,
): DashboardStatsProps {
  return {
    completed: overview.summary.completed,
    pendingQuotes,
    unreadNotifications,
    upcoming: overview.summary.upcoming,
    upcomingAt: overview.upcomingBooking?.scheduledAt ?? null,
  };
}
