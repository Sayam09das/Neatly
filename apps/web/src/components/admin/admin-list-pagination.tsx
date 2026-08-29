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
  onPageChange?: (page: number) => void;
  pageLabel: string;
  pagination: AdminListPaginationMeta;
  previousLabel: string;
  slot: string;
}

export function AdminListPagination({
  ariaLabel,
  nextLabel,
  onPageChange,
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
        onClick={
          onPageChange === undefined || pagination.page <= 1
            ? undefined
            : (): void => {
                onPageChange(pagination.page - 1);
              }
        }
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
              disabled={onPageChange === undefined || page === pagination.page}
              onClick={
                onPageChange === undefined || page === pagination.page
                  ? undefined
                  : (): void => {
                      onPageChange(page);
                    }
              }
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
        onClick={
          onPageChange === undefined || pagination.page >= pagination.totalPages
            ? undefined
            : (): void => {
                onPageChange(pagination.page + 1);
              }
        }
        size="sm"
        type="button"
        variant="outline"
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
