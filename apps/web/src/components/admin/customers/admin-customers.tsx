"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { CustomersCreateDialog } from "@/components/admin/customers/customers-create-dialog";
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { CustomersToolbar } from "@/components/admin/customers/customers-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminCustomerCopy,
  adminCustomerFilterCatalog,
  defaultAdminCustomerFilters,
  emptyAdminCustomerFilterCatalog,
} from "@/config/admin-customers";
import {
  type AdminCustomerList,
  filterCustomers,
  hasActiveCustomerFilters,
  listAdminCustomers,
} from "@/lib/admin/customers";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
  AdminCustomerPresentation,
} from "@/types/admin-customer";

interface AdminCustomersProps {
  filterCatalog?: AdminCustomerFilterCatalog;
  presentation?: AdminCustomerPresentation;
}

export function AdminCustomers({
  filterCatalog,
  presentation,
}: AdminCustomersProps): ReactElement {
  if (presentation === undefined) {
    return (
      <AdminCustomersLive
        filterCatalog={filterCatalog ?? adminCustomerFilterCatalog}
      />
    );
  }

  return (
    <AdminCustomersView
      filterCatalog={filterCatalog ?? emptyAdminCustomerFilterCatalog}
      presentation={presentation}
    />
  );
}

function AdminCustomersLive({
  filterCatalog,
}: {
  filterCatalog: AdminCustomerFilterCatalog;
}): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminCustomerFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    joinedFrom: filters.joinedFrom,
    joinedTo: filters.joinedTo,
    page,
    query: debouncedQuery,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminCustomers(
        {
          joinedFrom: filters.joinedFrom,
          joinedTo: filters.joinedTo,
          page,
          query: debouncedQuery,
          status: filters.status,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("customers", query.retry);
  const hasActiveFilters = hasActiveCustomerFilters(filters);
  const presentation = toLiveCustomerPresentation(query, hasActiveFilters);

  return (
    <AdminCustomersView
      filterCatalog={filterCatalog}
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={presentation}
    />
  );
}

interface AdminCustomersViewProps {
  filterCatalog: AdminCustomerFilterCatalog;
  filters?: AdminCustomerFilters;
  onFiltersChange?: (filters: AdminCustomerFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminCustomerPresentation;
}

function AdminCustomersView({
  filterCatalog,
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminCustomersViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminCustomerFilters>(
    defaultAdminCustomerFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const sourceCustomers =
    presentation.status === "ready" ? presentation.customers : [];
  const visibleCustomers =
    onFiltersChange === undefined
      ? filterCustomers(sourceCustomers, filters)
      : sourceCustomers;
  const hasActiveFilters = hasActiveCustomerFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-customers"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminCustomerCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminCustomerCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <CustomersToolbar
            catalog={filterCatalog}
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminCustomerFilters);
            }}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <CustomersTable
            customers={visibleCustomers}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminCustomerFilters);
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
      <CustomersCreateDialog
        onCreated={onMutated}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </div>
  );
}

function toLiveCustomerPresentation(
  query: AdminQueryState<AdminCustomerList>,
  hasActiveFilters: boolean,
): AdminCustomerPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return {
      onRetry: query.retry,
      status: "error",
    };
  }

  if (query.data === null || query.data.customers.length === 0) {
    return hasActiveFilters
      ? {
          customers: [],
          pagination: query.data?.pagination,
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    customers: query.data.customers,
    pagination: query.data.pagination,
    status: "ready",
  };
}
