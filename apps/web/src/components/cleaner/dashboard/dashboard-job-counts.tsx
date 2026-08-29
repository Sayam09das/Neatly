import type { ReactElement } from "react";
import { cleanerDashboardCopy } from "@/config/cleaner";
import type { CleanerOverviewSummary } from "@/types/cleaner";

interface DashboardJobCountsProps {
  summary: CleanerOverviewSummary;
}

export function DashboardJobCounts({
  summary,
}: DashboardJobCountsProps): ReactElement {
  const items = [
    {
      label: cleanerDashboardCopy.assignedToday,
      value: summary.assignedToday,
    },
    {
      label: cleanerDashboardCopy.completedToday,
      value: summary.completedToday,
    },
    {
      label: cleanerDashboardCopy.upcoming,
      value: summary.upcoming,
    },
    {
      label: cleanerDashboardCopy.inProgress,
      value: summary.inProgress,
    },
  ];

  return (
    <section>
      <h2 className="text-h2 text-foreground tracking-tight">
        {cleanerDashboardCopy.overviewHeading}
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
