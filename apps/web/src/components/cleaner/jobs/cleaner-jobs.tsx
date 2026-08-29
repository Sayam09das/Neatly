import Link from "next/link";
import type { ReactElement } from "react";
import { CleanerRefreshErrorState } from "@/components/cleaner/cleaner-refresh-error";
import { JobsFilters } from "@/components/cleaner/jobs/jobs-filters";
import { JobsList } from "@/components/cleaner/jobs/jobs-list";
import { JobsPagination } from "@/components/cleaner/jobs/jobs-pagination";
import {
  CLEANER_PATHS,
  cleanerJobsCopy,
  cleanerSurfaceCopy,
} from "@/config/cleaner";
import {
  type CleanerJobsQuery,
  cleanerJobsHasFilters,
} from "@/lib/cleaner/jobs";
import type { CleanerJobList } from "@/types/cleaner";

interface CleanerJobsProps {
  list: CleanerJobList | null;
  query: CleanerJobsQuery;
}

export function CleanerJobs({ list, query }: CleanerJobsProps): ReactElement {
  const filtered = cleanerJobsHasFilters(query);

  return (
    <div className="w-full min-w-0">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {cleanerSurfaceCopy.jobs.heading}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {cleanerSurfaceCopy.jobs.description}
        </p>
      </header>
      <JobsFilters query={query} />
      {list === null ? (
        <div className="mt-8">
          <CleanerRefreshErrorState />
        </div>
      ) : list.items.length === 0 ? (
        <div className="mt-8">
          {filtered ? (
            <div>
              <h2 className="text-h2 text-foreground tracking-tight">
                {cleanerJobsCopy.filteredEmptyTitle}
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                {cleanerJobsCopy.filteredEmptyDescription}
              </p>
              <p className="mt-6">
                <Link
                  className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={CLEANER_PATHS.jobs}
                >
                  {cleanerJobsCopy.clearFilters}
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-h2 text-foreground tracking-tight">
                {cleanerJobsCopy.emptyTitle}
              </h2>
              <p className="mt-3 text-body text-muted-foreground">
                {cleanerJobsCopy.emptyDescription}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <JobsList items={list.items} />
          <JobsPagination
            page={list.pagination.page}
            query={query}
            totalPages={list.pagination.totalPages}
          />
        </>
      )}
    </div>
  );
}
