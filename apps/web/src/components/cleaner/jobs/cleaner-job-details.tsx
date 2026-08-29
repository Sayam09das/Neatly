import Link from "next/link";
import type { ReactElement } from "react";
import { CleanerJobStatusBadge } from "@/components/cleaner/cleaner-job-status-badge";
import { CleanerJobWorkflow } from "@/components/cleaner/jobs/cleaner-job-workflow";
import { CLEANER_PATHS, cleanerJobDetailCopy } from "@/config/cleaner";
import { formatCleanerSchedule } from "@/lib/cleaner/schedule";
import type { CleanerJob } from "@/types/cleaner";

interface CleanerJobDetailsProps {
  job: CleanerJob;
}

export function CleanerJobDetails({
  job,
}: CleanerJobDetailsProps): ReactElement {
  const schedule = formatCleanerSchedule(job.scheduledAt);

  return (
    <article className="w-full min-w-0 max-w-2xl">
      <nav aria-label={cleanerJobDetailCopy.breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CLEANER_PATHS.home}
            >
              {cleanerJobDetailCopy.breadcrumbDashboard}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CLEANER_PATHS.jobs}
            >
              {cleanerJobDetailCopy.breadcrumbJobs}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {cleanerJobDetailCopy.breadcrumbCurrent}
          </li>
        </ol>
      </nav>
      <p className="mt-6 mb-6">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CLEANER_PATHS.jobs}
        >
          {cleanerJobDetailCopy.backToJobs}
        </Link>
      </p>
      <p className="text-label font-medium text-foreground uppercase tracking-wide">
        {cleanerJobDetailCopy.statusLabel}
      </p>
      <div className="mt-3">
        <CleanerJobStatusBadge status={job.status} />
      </div>
      <h1 className="mt-6 text-h1 text-foreground tracking-tight">
        {job.service?.name ?? cleanerJobDetailCopy.unnamedService}
      </h1>
      <section className="mt-8">
        <h2 className="text-h2 text-foreground tracking-tight">
          {cleanerJobDetailCopy.customerHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {job.customerName ?? cleanerJobDetailCopy.unnamedCustomer}
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-h2 text-foreground tracking-tight">
          {cleanerJobDetailCopy.scheduleHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {schedule ?? cleanerJobDetailCopy.scheduleUnavailable}
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-h2 text-foreground tracking-tight">
          {cleanerJobDetailCopy.locationHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {job.serviceAddress === null || job.serviceAddress === ""
            ? cleanerJobDetailCopy.locationUnavailable
            : job.serviceAddress}
        </p>
      </section>
      <CleanerJobWorkflow job={job} />
    </article>
  );
}
