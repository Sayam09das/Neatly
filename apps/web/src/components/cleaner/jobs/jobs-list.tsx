import Link from "next/link";
import type { ReactElement } from "react";
import { CleanerJobStatusBadge } from "@/components/cleaner/cleaner-job-status-badge";
import { cleanerJobPath, cleanerJobsCopy } from "@/config/cleaner";
import { formatCleanerSchedule } from "@/lib/cleaner/schedule";
import type { CleanerJob } from "@/types/cleaner";

interface JobsListProps {
  items: readonly CleanerJob[];
}

export function JobsList({ items }: JobsListProps): ReactElement {
  return (
    <>
      <ul className="mt-8 flex flex-col gap-4 lg:hidden">
        {items.map((job) => (
          <li className="rounded-xl border border-border p-4" key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>
      <div className="mt-8 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-xl text-left">
          <caption className="sr-only">{cleanerJobsCopy.tableCaption}</caption>
          <thead>
            <tr className="border-b border-border text-caption text-muted-foreground">
              <th className="py-3 pr-4 font-medium">Service</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Schedule</th>
              <th className="py-3 pr-4 font-medium">Location</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 font-medium">
                <span className="sr-only">{cleanerJobsCopy.viewJob}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((job) => (
              <tr className="border-b border-border" key={job.id}>
                <td className="py-4 pr-4 text-body text-foreground">
                  {job.service?.name ?? cleanerJobsCopy.unnamedService}
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {job.customerName ?? cleanerJobsCopy.unnamedCustomer}
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {formatCleanerSchedule(job.scheduledAt) ?? "—"}
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {job.serviceAddress === null || job.serviceAddress === ""
                    ? "—"
                    : job.serviceAddress}
                </td>
                <td className="py-4 pr-4">
                  <CleanerJobStatusBadge status={job.status} />
                </td>
                <td className="py-4">
                  <JobViewLink id={job.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function JobCard({ job }: { job: CleanerJob }): ReactElement {
  const schedule = formatCleanerSchedule(job.scheduledAt);

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h3 text-foreground">
          {job.service?.name ?? cleanerJobsCopy.unnamedService}
        </h2>
        <CleanerJobStatusBadge status={job.status} />
      </div>
      <p className="mt-2 text-body-small text-muted-foreground">
        {job.customerName ?? cleanerJobsCopy.unnamedCustomer}
      </p>
      {schedule === null ? null : (
        <p className="mt-1 text-body-small text-muted-foreground">{schedule}</p>
      )}
      {job.serviceAddress === null || job.serviceAddress === "" ? null : (
        <p className="mt-1 text-body-small text-muted-foreground">
          {job.serviceAddress}
        </p>
      )}
      <p className="mt-4">
        <JobViewLink id={job.id} />
      </p>
    </article>
  );
}

function JobViewLink({ id }: { id: string }): ReactElement {
  return (
    <Link
      className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={cleanerJobPath(id)}
    >
      {cleanerJobsCopy.viewJob}
    </Link>
  );
}
