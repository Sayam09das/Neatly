"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";

export interface AdminListPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface AdminListPaginationProps {
  ariaLabel: string;
  nextLabel: string;
  pageLabel: string;
  pagination: AdminListPaginationMeta;
  previousLabel: string;
  slot: string;
}

export function AdminListPagination({
  ariaLabel,
  nextLabel,
  pageLabel,
  pagination,
  previousLabel,
  slot,
}: AdminListPaginationProps): ReactElement {
  const pages = Array.from(
    { length: pagination.totalPages },
    (_unused, index) => index + 1,
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center justify-between gap-3"
      data-slot={slot}
    >
      <Button
        aria-label={previousLabel}
        disabled={pagination.page <= 1}
        size="sm"
        type="button"
        variant="outline"
      >
        {previousLabel}
      </Button>
      <ol className="flex flex-wrap items-center gap-1">
        {pages.map((page) => (
          <li key={page}>
            <Button
              aria-current={page === pagination.page ? "page" : undefined}
              aria-label={`${pageLabel} ${page}`}
              disabled
              size="sm"
              type="button"
              variant={page === pagination.page ? "secondary" : "ghost"}
            >
              {page}
            </Button>
          </li>
        ))}
      </ol>
      <Button
        aria-label={nextLabel}
        disabled={pagination.page >= pagination.totalPages}
        size="sm"
        type="button"
        variant="outline"
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
