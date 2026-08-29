import type { ReactElement } from "react";
import { customerDashboardCopy } from "@/config/customer";
import type { CustomerOverview } from "@/types/customer";

interface DashboardBookingCountsProps {
  overview: CustomerOverview;
}

export function DashboardBookingCounts({
  overview,
}: DashboardBookingCountsProps): ReactElement {
  const items = [
    {
      label: customerDashboardCopy.summaryUpcoming,
      value: overview.summary.upcoming,
    },
    {
      label: customerDashboardCopy.summaryPending,
      value: overview.summary.pending,
    },
    {
      label: customerDashboardCopy.summaryCompleted,
      value: overview.summary.completed,
    },
    {
      label: customerDashboardCopy.summaryTotal,
      value: overview.summary.total,
    },
  ];

  return (
    <section>
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.summaryHeading}
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-xl border border-border p-4" key={item.label}>
            <dt className="text-caption text-muted-foreground">{item.label}</dt>
            <dd className="mt-2 text-h3 text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
