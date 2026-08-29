import Link from "next/link";
import type { ReactElement } from "react";
import { CleanerJobStatusBadge } from "@/components/cleaner/cleaner-job-status-badge";
import { cleanerDashboardCopy, cleanerJobPath } from "@/config/cleaner";
import { formatCleanerSchedule } from "@/lib/cleaner/schedule";
import type { CleanerJob } from "@/types/cleaner";

interface DashboardJobSummaryProps {
  job: CleanerJob;
}

export function DashboardJobSummary({
  job,
}: DashboardJobSummaryProps): ReactElement {
  const schedule = formatCleanerSchedule(job.scheduledAt);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium text-body text-foreground">
          {job.service?.name ?? cleanerDashboardCopy.unnamedService}
        </p>
        <CleanerJobStatusBadge status={job.status} />
      </div>
      <p className="mt-2 text-body-small text-muted-foreground">
        {job.customerName ?? cleanerDashboardCopy.unnamedCustomer}
      </p>
      {schedule === null ? null : (
        <p className="mt-1 text-body-small text-muted-foreground">{schedule}</p>
      )}
      {job.serviceAddress === null || job.serviceAddress === "" ? null : (
        <p className="mt-1 text-body-small text-muted-foreground">
          {job.serviceAddress}
        </p>
      )}
      <p className="mt-3">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerJobPath(job.id)}
        >
          {cleanerDashboardCopy.viewJob}
        </Link>
      </p>
    </div>
  );
}
