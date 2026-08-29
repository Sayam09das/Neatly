import Link from "next/link";
import type { ReactElement } from "react";
import { CleanerJobStatusBadge } from "@/components/cleaner/cleaner-job-status-badge";
import { CleanerRefreshErrorState } from "@/components/cleaner/cleaner-refresh-error";
import {
  CLEANER_PATHS,
  CLEANER_SCHEDULE_DATE_PARAM,
  cleanerJobPath,
  cleanerScheduleCopy,
  cleanerSurfaceCopy,
} from "@/config/cleaner";
import {
  addUtcDays,
  formatCleanerDayHeading,
  formatCleanerTime,
  isUtcToday,
  parseUtcDateParam,
  toUtcDateParam,
} from "@/lib/cleaner/schedule";
import type { CleanerJob, CleanerSchedule } from "@/types/cleaner";

interface CleanerScheduleViewProps {
  schedule: CleanerSchedule | null;
}

export function CleanerScheduleView({
  schedule,
}: CleanerScheduleViewProps): ReactElement {
  if (schedule === null) {
    return <CleanerRefreshErrorState />;
  }

  const selected = parseUtcDateParam(schedule.date) ?? new Date();
  const previous = toUtcDateParam(addUtcDays(selected, -1));
  const next = toUtcDateParam(addUtcDays(selected, 1));
  const today = toUtcDateParam(new Date());
  const firstStart = formatCleanerTime(schedule.summary.firstStart);

  return (
    <div className="w-full min-w-0">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {cleanerSurfaceCopy.schedule.heading}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {cleanerSurfaceCopy.schedule.description}
        </p>
      </header>
      <nav
        aria-label={cleanerSurfaceCopy.schedule.heading}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerScheduleHref(previous)}
        >
          {cleanerScheduleCopy.previousDate}
        </Link>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerScheduleHref(today)}
        >
          {cleanerScheduleCopy.today}
        </Link>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerScheduleHref(next)}
        >
          {cleanerScheduleCopy.nextDate}
        </Link>
      </nav>
      <p className="mt-6 text-h2 text-foreground tracking-tight">
        {formatCleanerDayHeading(schedule.date)}
        {isUtcToday(schedule.date) ? (
          <span className="ml-3 text-body-small font-medium text-muted-foreground">
            {cleanerScheduleCopy.todayLabel}
          </span>
        ) : null}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <dt className="text-caption text-muted-foreground">
            {cleanerScheduleCopy.jobCount}
          </dt>
          <dd className="mt-2 text-h3 text-foreground">
            {schedule.summary.jobCount}
          </dd>
        </div>
        <div className="rounded-xl border border-border p-4">
          <dt className="text-caption text-muted-foreground">
            {cleanerScheduleCopy.firstStart}
          </dt>
          <dd className="mt-2 text-h3 text-foreground">{firstStart ?? "—"}</dd>
        </div>
      </dl>
      <section className="mt-10">
        <h2 className="text-h2 text-foreground tracking-tight">
          {cleanerScheduleCopy.weekHeading}
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {schedule.week.map((day) => (
            <li key={day.date}>
              <Link
                aria-current={day.date === schedule.date ? "date" : undefined}
                className={`flex min-h-touch flex-col rounded-xl border px-3 py-3 text-caption focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  day.date === schedule.date
                    ? "border-foreground bg-muted text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                href={cleanerScheduleHref(day.date)}
              >
                <span>{formatWeekday(day.date)}</span>
                <span className="mt-1 text-body-small font-medium text-foreground">
                  {day.jobCount}
                </span>
                {isUtcToday(day.date) ? (
                  <span className="mt-1">{cleanerScheduleCopy.todayLabel}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {schedule.nextJob === null ? null : (
        <section className="mt-10 max-w-2xl rounded-xl border border-border p-6">
          <h2 className="text-h2 text-foreground tracking-tight">
            {cleanerScheduleCopy.nextJobHeading}
          </h2>
          <ScheduleJobBlock job={schedule.nextJob} />
        </section>
      )}
      <section className="mt-10">
        {schedule.jobs.length === 0 ? (
          <div>
            <h2 className="text-h2 text-foreground tracking-tight">
              {isEmptySchedule(schedule)
                ? cleanerScheduleCopy.emptyScheduleTitle
                : cleanerScheduleCopy.emptyDayTitle}
            </h2>
            <p className="mt-3 text-body text-muted-foreground">
              {isEmptySchedule(schedule)
                ? cleanerScheduleCopy.emptyScheduleDescription
                : cleanerScheduleCopy.emptyDayDescription}
            </p>
            <p className="mt-6">
              <Link
                className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={CLEANER_PATHS.jobs}
              >
                {cleanerScheduleCopy.viewAllJobs}
              </Link>
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-4">
            {schedule.jobs.map((job) => (
              <li className="rounded-xl border border-border p-4" key={job.id}>
                <ScheduleJobBlock job={job} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function ScheduleJobBlock({ job }: { job: CleanerJob }): ReactElement {
  const time = formatCleanerTime(job.scheduledAt);

  return (
    <article className="mt-3 first:mt-0">
      {time === null ? null : (
        <p className="text-caption font-medium text-muted-foreground">{time}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h3 className="text-h3 text-foreground">
          {job.service?.name ?? cleanerScheduleCopy.unnamedService}
        </h3>
        <CleanerJobStatusBadge status={job.status} />
      </div>
      <p className="mt-2 text-body-small text-muted-foreground">
        {job.customerName ?? cleanerScheduleCopy.unnamedCustomer}
      </p>
      {job.serviceAddress === null || job.serviceAddress === "" ? null : (
        <p className="mt-1 text-body-small text-muted-foreground">
          {job.serviceAddress}
        </p>
      )}
      <p className="mt-4">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerJobPath(job.id)}
        >
          {cleanerScheduleCopy.viewJob}
        </Link>
      </p>
    </article>
  );
}

function cleanerScheduleHref(date: string): string {
  return `${CLEANER_PATHS.schedule}?${CLEANER_SCHEDULE_DATE_PARAM}=${date}`;
}

function isEmptySchedule(schedule: CleanerSchedule): boolean {
  return (
    schedule.nextJob === null &&
    schedule.week.every((day) => day.jobCount === 0)
  );
}

function formatWeekday(isoDate: string): string {
  const parsed = parseUtcDateParam(isoDate);

  if (parsed === null) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
  }).format(parsed);
}
