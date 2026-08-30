"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { CleanersCreateDialog } from "@/components/admin/cleaners/cleaners-create-dialog";
import { CleanersTable } from "@/components/admin/cleaners/cleaners-table";
import { CleanersToolbar } from "@/components/admin/cleaners/cleaners-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminCleanerCopy,
  adminCleanerFilterCatalog,
  defaultAdminCleanerFilters,
  emptyAdminCleanerFilterCatalog,
} from "@/config/admin-cleaners";
import { type AdminCleanerList, listAdminCleaners } from "@/lib/admin/cleaners";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminCleanerFilterCatalog,
  AdminCleanerFilters,
  AdminCleanerPresentation,
} from "@/types/admin-cleaner";

interface AdminCleanersProps {
  filterCatalog?: AdminCleanerFilterCatalog;
  presentation?: AdminCleanerPresentation;
}

export function AdminCleaners({
  filterCatalog,
  presentation,
}: AdminCleanersProps): ReactElement {
  if (presentation === undefined) {
    return (
      <AdminCleanersLive
        filterCatalog={filterCatalog ?? adminCleanerFilterCatalog}
      />
    );
  }

  return (
    <AdminCleanersView
      filterCatalog={filterCatalog ?? emptyAdminCleanerFilterCatalog}
      presentation={presentation}
    />
  );
}

function AdminCleanersLive({
  filterCatalog,
}: {
  filterCatalog: AdminCleanerFilterCatalog;
}): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminCleanerFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    page,
    query: debouncedQuery,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminCleaners(
        {
          page,
          query: debouncedQuery,
          status: filters.status,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("cleaners", query.retry);
  const hasActiveFilters = filters.query !== "" || filters.status !== "";
  const presentation = toLiveCleanerPresentation(query, hasActiveFilters);

  return (
    <AdminCleanersView
      filterCatalog={filterCatalog}
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={presentation}
    />
  );
}

interface AdminCleanersViewProps {
  filterCatalog: AdminCleanerFilterCatalog;
  filters?: AdminCleanerFilters;
  onFiltersChange?: (filters: AdminCleanerFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminCleanerPresentation;
}

function AdminCleanersView({
  filterCatalog,
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminCleanersViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminCleanerFilters>(
    defaultAdminCleanerFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const sourceCleaners =
    presentation.status === "ready" ? presentation.cleaners : [];
  const hasActiveFilters = filters.query !== "" || filters.status !== "";

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-cleaners"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminCleanerCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminCleanerCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <CleanersToolbar
            catalog={filterCatalog}
            filters={filters}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            onFiltersChange={setFilters}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <CleanersTable
            cleaners={sourceCleaners}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminCleanerFilters);
            }}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            onMutated={onMutated}
            onPageChange={onPageChange}
            pagination={
              presentation.status === "ready"
                ? presentation.pagination
                : undefined
            }
            presentation={presentation}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
      <CleanersCreateDialog
        onCreated={onMutated}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </div>
  );
}

function toLiveCleanerPresentation(
  query: AdminQueryState<AdminCleanerList>,
  hasActiveFilters: boolean,
): AdminCleanerPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return {
      onRetry: query.retry,
      status: "error",
    };
  }

  if (query.data === null || query.data.cleaners.length === 0) {
    return hasActiveFilters
      ? {
          cleaners: [],
          pagination: query.data?.pagination,
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    cleaners: query.data.cleaners,
    pagination: query.data.pagination,
    status: "ready",
  };
}
