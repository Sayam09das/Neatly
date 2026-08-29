import type { ReactElement } from "react";
import { CleanerRefreshErrorState } from "@/components/cleaner/cleaner-refresh-error";
import { DashboardJobCounts } from "@/components/cleaner/dashboard/dashboard-job-counts";
import { DashboardNextJob } from "@/components/cleaner/dashboard/dashboard-next-job";
import { DashboardQuickActions } from "@/components/cleaner/dashboard/dashboard-quick-actions";
import { DashboardTodayJobs } from "@/components/cleaner/dashboard/dashboard-today-jobs";
import { cleanerDashboardCopy } from "@/config/cleaner";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";
import {
  formatCleanerDateHeading,
  getCleanerGreeting,
} from "@/lib/cleaner/schedule";
import type { CleanerOverview } from "@/types/cleaner";

interface CleanerDashboardOverviewProps {
  identity: CleanerNavbarIdentity;
  now: Date;
  overview: CleanerOverview | null;
}

export function CleanerDashboardOverview({
  identity,
  now,
  overview,
}: CleanerDashboardOverviewProps): ReactElement {
  if (overview === null) {
    return <CleanerRefreshErrorState />;
  }

  const greeting = getCleanerGreeting(identity.name, now);
  const dateLabel = formatCleanerDateHeading(now);

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">{greeting}</h1>
        <p className="mt-3 text-body text-muted-foreground">{dateLabel}</p>
        <p className="mt-2 text-body text-muted-foreground">
          {cleanerDashboardCopy.summaryIntro}
        </p>
      </header>
      <DashboardJobCounts summary={overview.summary} />
      <DashboardNextJob job={overview.nextJob} />
      <DashboardTodayJobs jobs={overview.todayJobs} />
      <DashboardQuickActions />
    </div>
  );
}
