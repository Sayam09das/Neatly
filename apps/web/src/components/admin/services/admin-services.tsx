"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { ServicesCreateDialog } from "@/components/admin/services/services-create-dialog";
import { ServicesTable } from "@/components/admin/services/services-table";
import { ServicesToolbar } from "@/components/admin/services/services-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminServiceCopy,
  adminServiceFilterCatalog,
  defaultAdminServiceFilters,
} from "@/config/admin-services";
import {
  type AdminServiceList,
  filterServices,
  hasActiveServiceFilters,
  listAdminServices,
} from "@/lib/admin/services";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
  AdminServicePresentation,
} from "@/types/admin-service";

interface AdminServicesProps {
  filterCatalog?: AdminServiceFilterCatalog;
  presentation?: AdminServicePresentation;
}

export function AdminServices({
  filterCatalog = adminServiceFilterCatalog,
  presentation,
}: AdminServicesProps): ReactElement {
  if (presentation === undefined) {
    return <AdminServicesLive filterCatalog={filterCatalog} />;
  }

  return (
    <AdminServicesView
      filterCatalog={filterCatalog}
      presentation={presentation}
    />
  );
}

function AdminServicesLive({
  filterCatalog,
}: {
  filterCatalog: AdminServiceFilterCatalog;
}): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminServiceFilters,
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
      listAdminServices(
        {
          page,
          query: debouncedQuery,
          status: filters.status,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("services", query.retry);

  return (
    <AdminServicesView
      filterCatalog={filterCatalog}
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={toLiveServicePresentation(
        query,
        hasActiveServiceFilters(filters),
      )}
    />
  );
}

interface AdminServicesViewProps {
  filterCatalog: AdminServiceFilterCatalog;
  filters?: AdminServiceFilters;
  onFiltersChange?: (filters: AdminServiceFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminServicePresentation;
}

function AdminServicesView({
  filterCatalog,
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminServicesViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminServiceFilters>(
    defaultAdminServiceFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const sourceServices =
    presentation.status === "ready" ? presentation.services : [];
  const visibleServices =
    onFiltersChange === undefined
      ? filterServices(sourceServices, filters)
      : sourceServices;
  const hasActiveFilters = hasActiveServiceFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-services"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminServiceCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminServiceCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ServicesToolbar
            catalog={filterCatalog}
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminServiceFilters);
            }}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ServicesTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminServiceFilters);
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
            services={visibleServices}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
      <ServicesCreateDialog
        onCreated={onMutated}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </div>
  );
}

function toLiveServicePresentation(
  query: AdminQueryState<AdminServiceList>,
  hasActiveFilters: boolean,
): AdminServicePresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.services.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          services: [],
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    services: query.data.services,
    status: "ready",
  };
}
