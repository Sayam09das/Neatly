"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { NewsletterMetrics } from "@/components/admin/newsletter/newsletter-metrics";
import { NewsletterTable } from "@/components/admin/newsletter/newsletter-table";
import { NewsletterToolbar } from "@/components/admin/newsletter/newsletter-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminNewsletterCopy,
  defaultAdminNewsletterFilters,
} from "@/config/admin-newsletter";
import {
  type AdminNewsletterList,
  filterNewsletterSubscribers,
  hasActiveNewsletterFilters,
  listAdminNewsletterSubscribers,
  paginateNewsletterSubscribers,
} from "@/lib/admin/newsletter";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminNewsletterFilters,
  AdminNewsletterPagination,
  AdminNewsletterPresentation,
  AdminNewsletterSubscriber,
} from "@/types/admin-newsletter";

interface AdminNewsletterProps {
  presentation?: AdminNewsletterPresentation;
}

export function AdminNewsletter({
  presentation,
}: AdminNewsletterProps): ReactElement {
  if (presentation === undefined) {
    return <AdminNewsletterLive />;
  }

  return <AdminNewsletterView presentation={presentation} />;
}

function AdminNewsletterLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminNewsletterFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    dateRange: filters.dateRange,
    page,
    query: debouncedQuery,
    status: filters.status,
    subscribedFrom: filters.subscribedFrom,
    subscribedTo: filters.subscribedTo,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminNewsletterSubscribers(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("newsletter", query.retry);

  return (
    <AdminNewsletterView
      filters={filters}
      onFiltersChange={setFilters}
      onPageChange={setPage}
      page={page}
      presentation={toLiveNewsletterPresentation(
        query,
        hasActiveNewsletterFilters(filters),
      )}
    />
  );
}

interface AdminNewsletterViewProps {
  filters?: AdminNewsletterFilters;
  onFiltersChange?: (filters: AdminNewsletterFilters) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  presentation: AdminNewsletterPresentation;
}

function AdminNewsletterView({
  filters: filtersProp,
  onFiltersChange,
  onPageChange,
  page: pageProp,
  presentation,
}: AdminNewsletterViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminNewsletterFilters>(
    defaultAdminNewsletterFilters,
  );
  const [localPage, setLocalPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = (next: AdminNewsletterFilters): void => {
    if (onFiltersChange === undefined) {
      setLocalFilters(next);
      setLocalPage(1);
      return;
    }

    onFiltersChange(next);
  };
  const page = pageProp ?? localPage;
  const setPage = onPageChange ?? setLocalPage;
  const sourceSubscribers = getSourceSubscribers(presentation);
  const filteredSubscribers =
    onFiltersChange === undefined
      ? filterNewsletterSubscribers(sourceSubscribers, filters)
      : sourceSubscribers;
  const paged = resolveVisibleSubscribers(
    filteredSubscribers,
    page,
    presentation,
    onFiltersChange,
  );
  const hasActiveFilters = hasActiveNewsletterFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-newsletter"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminNewsletterCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminNewsletterCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <NewsletterMetrics
            presentation={presentation}
            subscribers={sourceSubscribers}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <NewsletterToolbar
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminNewsletterFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <NewsletterTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminNewsletterFilters);
            }}
            onPageChange={setPage}
            pagination={paged.pagination}
            presentation={presentation}
            subscribers={paged.subscribers}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function getSourceSubscribers(
  presentation: AdminNewsletterPresentation,
): readonly AdminNewsletterSubscriber[] {
  return presentation.status === "ready" ? presentation.subscribers : [];
}

function resolveVisibleSubscribers(
  subscribers: readonly AdminNewsletterSubscriber[],
  page: number,
  presentation: AdminNewsletterPresentation,
  onFiltersChange: ((filters: AdminNewsletterFilters) => void) | undefined,
): {
  pagination: AdminNewsletterPagination | undefined;
  subscribers: readonly AdminNewsletterSubscriber[];
} {
  if (
    onFiltersChange !== undefined &&
    presentation.status === "ready" &&
    presentation.pagination !== undefined
  ) {
    return {
      pagination: presentation.pagination,
      subscribers,
    };
  }

  const paged = paginateNewsletterSubscribers(subscribers, page);

  return {
    pagination: paged.pagination,
    subscribers: paged.subscribers,
  };
}

function toLiveNewsletterPresentation(
  query: AdminQueryState<AdminNewsletterList>,
  hasActiveFilters: boolean,
): AdminNewsletterPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.subscribers.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          status: "ready",
          subscribers: [],
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    status: "ready",
    subscribers: query.data.subscribers,
  };
}
