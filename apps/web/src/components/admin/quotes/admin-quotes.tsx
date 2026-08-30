"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { QuotesMetrics } from "@/components/admin/quotes/quotes-metrics";
import { QuotesTable } from "@/components/admin/quotes/quotes-table";
import { QuotesToolbar } from "@/components/admin/quotes/quotes-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminQuoteCopy,
  defaultAdminQuoteFilters,
} from "@/config/admin-quotes";
import type { AdminQuoteList } from "@/lib/admin/quotes";
import {
  filterQuotes,
  hasActiveQuoteFilters,
  listAdminQuotes,
  paginateQuotes,
} from "@/lib/admin/quotes";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminQuote,
  AdminQuoteFilters,
  AdminQuotePagination,
  AdminQuotePresentation,
} from "@/types/admin-quote";

interface AdminQuotesProps {
  presentation?: AdminQuotePresentation;
}

export function AdminQuotes({ presentation }: AdminQuotesProps): ReactElement {
  if (presentation === undefined) {
    return <AdminQuotesLive />;
  }

  return <AdminQuotesView presentation={presentation} />;
}

function AdminQuotesLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminQuoteFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    dateRange: filters.dateRange,
    page,
    query: debouncedQuery,
    requestedFrom: filters.requestedFrom,
    requestedTo: filters.requestedTo,
    serviceType: filters.serviceType,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminQuotes(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("quotes", query.retry);
  const hasActiveFilters = hasActiveQuoteFilters(filters);

  return (
    <AdminQuotesView
      filters={filters}
      onFiltersChange={setFilters}
      onPageChange={setPage}
      page={page}
      presentation={toLiveQuotePresentation(query, hasActiveFilters)}
    />
  );
}

function toLiveQuotePresentation(
  query: AdminQueryState<AdminQuoteList>,
  hasActiveFilters: boolean,
): AdminQuotePresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.quotes.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          quotes: [],
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    quotes: query.data.quotes,
    status: "ready",
  };
}

interface AdminQuotesViewProps {
  filters?: AdminQuoteFilters;
  onFiltersChange?: (filters: AdminQuoteFilters) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  presentation: AdminQuotePresentation;
}

function AdminQuotesView({
  filters: filtersProp,
  onFiltersChange,
  onPageChange,
  page: pageProp,
  presentation,
}: AdminQuotesViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminQuoteFilters>(
    defaultAdminQuoteFilters,
  );
  const [localPage, setLocalPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = (next: AdminQuoteFilters): void => {
    if (onFiltersChange === undefined) {
      setLocalFilters(next);
      setLocalPage(1);
      return;
    }

    onFiltersChange(next);
  };
  const page = pageProp ?? localPage;
  const setPage = onPageChange ?? setLocalPage;
  const sourceQuotes = getSourceQuotes(presentation);
  const filteredQuotes =
    onFiltersChange === undefined
      ? filterQuotes(sourceQuotes, filters)
      : sourceQuotes;
  const paged = resolveVisibleQuotes(
    filteredQuotes,
    page,
    presentation,
    onFiltersChange,
  );
  const hasActiveFilters = hasActiveQuoteFilters(filters);

  return (
    <div className="mx-auto w-full min-w-0 max-w-page" data-slot="admin-quotes">
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminQuoteCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminQuoteCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <QuotesMetrics presentation={presentation} quotes={sourceQuotes} />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <QuotesToolbar
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminQuoteFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <QuotesTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminQuoteFilters);
            }}
            onPageChange={setPage}
            pagination={paged.pagination}
            presentation={presentation}
            quotes={paged.quotes}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function getSourceQuotes(
  presentation: AdminQuotePresentation,
): readonly AdminQuote[] {
  return presentation.status === "ready" ? presentation.quotes : [];
}

function resolveVisibleQuotes(
  quotes: readonly AdminQuote[],
  page: number,
  presentation: AdminQuotePresentation,
  onFiltersChange: ((filters: AdminQuoteFilters) => void) | undefined,
): {
  pagination: AdminQuotePagination | undefined;
  quotes: readonly AdminQuote[];
} {
  if (
    onFiltersChange !== undefined &&
    presentation.status === "ready" &&
    presentation.pagination !== undefined
  ) {
    return {
      pagination: presentation.pagination,
      quotes,
    };
  }

  const paged = paginateQuotes(quotes, page);

  return {
    pagination: paged.pagination,
    quotes: paged.quotes,
  };
}
