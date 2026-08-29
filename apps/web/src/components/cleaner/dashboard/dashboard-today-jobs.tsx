import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardJobSummary } from "@/components/cleaner/dashboard/dashboard-job-summary";
import { CLEANER_PATHS, cleanerDashboardCopy } from "@/config/cleaner";
import type { CleanerJob } from "@/types/cleaner";

interface DashboardTodayJobsProps {
  jobs: readonly CleanerJob[];
}

export function DashboardTodayJobs({
  jobs,
}: DashboardTodayJobsProps): ReactElement {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 text-foreground tracking-tight">
          {cleanerDashboardCopy.todayJobsHeading}
        </h2>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CLEANER_PATHS.jobs}
        >
          {cleanerDashboardCopy.viewAllJobs}
        </Link>
      </div>
      {jobs.length === 0 ? (
        <p className="mt-4 text-body text-muted-foreground">
          {cleanerDashboardCopy.todayJobsEmpty}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {jobs.map((job) => (
            <li className="rounded-xl border border-border p-4" key={job.id}>
              <DashboardJobSummary job={job} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
