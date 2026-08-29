import Link from "next/link";
import type { ReactElement } from "react";
import { cleanerJobsCopy } from "@/config/cleaner";
import { type CleanerJobsQuery, cleanerJobsHref } from "@/lib/cleaner/jobs";

interface JobsPaginationProps {
  page: number;
  query: CleanerJobsQuery;
  totalPages: number;
}

export function JobsPagination({
  page,
  query,
  totalPages,
}: JobsPaginationProps): ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={cleanerJobsCopy.paginationLabel}
      className="mt-8 flex flex-wrap items-center gap-3"
    >
      {page > 1 ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerJobsHref({ ...query, page: page - 1 })}
        >
          {cleanerJobsCopy.paginationPrevious}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {cleanerJobsCopy.paginationPrevious}
        </span>
      )}
      <p className="text-body-small text-muted-foreground">
        {page} / {totalPages}
      </p>
      {page < totalPages ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={cleanerJobsHref({ ...query, page: page + 1 })}
        >
          {cleanerJobsCopy.paginationNext}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {cleanerJobsCopy.paginationNext}
        </span>
      )}
    </nav>
  );
}
