import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardJobSummary } from "@/components/cleaner/dashboard/dashboard-job-summary";
import { CLEANER_PATHS, cleanerDashboardCopy } from "@/config/cleaner";
import type { CleanerJob } from "@/types/cleaner";

interface DashboardNextJobProps {
  job: CleanerJob | null;
}

export function DashboardNextJob({ job }: DashboardNextJobProps): ReactElement {
  return (
    <section className="max-w-2xl rounded-xl border border-border p-6">
      <h2 className="text-h2 text-foreground tracking-tight">
        {cleanerDashboardCopy.nextJobHeading}
      </h2>
      {job === null ? (
        <>
          <p className="mt-3 text-body text-foreground">
            {cleanerDashboardCopy.nextJobEmptyTitle}
          </p>
          <p className="mt-2 text-body text-muted-foreground">
            {cleanerDashboardCopy.nextJobEmptyDescription}
          </p>
          <p className="mt-6">
            <Link
              className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CLEANER_PATHS.jobs}
            >
              {cleanerDashboardCopy.nextJobEmptyAction}
            </Link>
          </p>
        </>
      ) : (
        <DashboardJobSummary job={job} />
      )}
    </section>
  );
}
