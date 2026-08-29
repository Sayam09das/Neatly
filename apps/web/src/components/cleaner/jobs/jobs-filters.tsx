import { Button, Input, Label } from "@neatly/ui";
import type { ReactElement } from "react";
import {
  CLEANER_JOBS_SEARCH_INPUT_ID,
  CLEANER_JOBS_SEARCH_PARAM,
  CLEANER_JOBS_STATUS_INPUT_ID,
  CLEANER_JOBS_STATUS_PARAM,
  CLEANER_JOBS_WINDOW_INPUT_ID,
  CLEANER_JOBS_WINDOW_PARAM,
  CLEANER_PATHS,
  cleanerJobStatusLabels,
  cleanerJobsCopy,
} from "@/config/cleaner";
import {
  CLEANER_JOB_STATUSES,
  type CleanerJobsQuery,
} from "@/lib/cleaner/jobs";

interface JobsFiltersProps {
  query: CleanerJobsQuery;
}

export function JobsFilters({ query }: JobsFiltersProps): ReactElement {
  return (
    <form
      action={CLEANER_PATHS.jobs}
      className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4"
      method="get"
    >
      <div className="md:col-span-2">
        <Label htmlFor={CLEANER_JOBS_SEARCH_INPUT_ID}>
          {cleanerJobsCopy.searchLabel}
        </Label>
        <Input
          autoComplete="off"
          className="mt-2"
          defaultValue={query.q}
          id={CLEANER_JOBS_SEARCH_INPUT_ID}
          name={CLEANER_JOBS_SEARCH_PARAM}
          placeholder={cleanerJobsCopy.searchPlaceholder}
          type="search"
        />
      </div>
      <div>
        <Label htmlFor={CLEANER_JOBS_STATUS_INPUT_ID}>
          {cleanerJobsCopy.filterLabel}
        </Label>
        <select
          className="mt-2 flex min-h-touch w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={query.status}
          id={CLEANER_JOBS_STATUS_INPUT_ID}
          name={CLEANER_JOBS_STATUS_PARAM}
        >
          <option value="">{cleanerJobsCopy.allStatuses}</option>
          {CLEANER_JOB_STATUSES.map((status) => (
            <option key={status} value={status}>
              {cleanerJobStatusLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={CLEANER_JOBS_WINDOW_INPUT_ID}>
          {cleanerJobsCopy.windowLabel}
        </Label>
        <select
          className="mt-2 flex min-h-touch w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={query.window}
          id={CLEANER_JOBS_WINDOW_INPUT_ID}
          name={CLEANER_JOBS_WINDOW_PARAM}
        >
          <option value="">{cleanerJobsCopy.allWindows}</option>
          <option value="today">{cleanerJobsCopy.windowToday}</option>
          <option value="upcoming">{cleanerJobsCopy.windowUpcoming}</option>
          <option value="past">{cleanerJobsCopy.windowPast}</option>
        </select>
      </div>
      <div className="md:col-span-4">
        <Button type="submit">{cleanerJobsCopy.searchLabel}</Button>
      </div>
    </form>
  );
}
