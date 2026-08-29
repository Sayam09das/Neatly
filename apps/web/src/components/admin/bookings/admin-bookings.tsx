"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { BookingsCreateDialog } from "@/components/admin/bookings/bookings-create-dialog";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";
import { BookingsToolbar } from "@/components/admin/bookings/bookings-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminBookingCopy,
  defaultAdminBookingFilters,
  emptyAdminBookingFilterCatalog,
} from "@/config/admin-bookings";
import {
  type AdminBookingList,
  filterBookings,
  hasActiveBookingFilters,
  listAdminBookingFilterCatalog,
  listAdminBookings,
} from "@/lib/admin/bookings";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminBookingFilterCatalog,
  AdminBookingFilters,
  AdminBookingPresentation,
} from "@/types/admin-booking";

interface AdminBookingsProps {
  filterCatalog?: AdminBookingFilterCatalog;
  presentation?: AdminBookingPresentation;
}

export function AdminBookings({
  filterCatalog,
  presentation,
}: AdminBookingsProps): ReactElement {
  if (presentation === undefined) {
    return <AdminBookingsLive filterCatalog={filterCatalog} />;
  }

  return (
    <AdminBookingsView
      filterCatalog={filterCatalog ?? emptyAdminBookingFilterCatalog}
      presentation={presentation}
    />
  );
}

function AdminBookingsLive({
  filterCatalog: catalogProp,
}: {
  filterCatalog?: AdminBookingFilterCatalog;
}): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminBookingFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    cleanerId: filters.cleanerId,
    customerId: filters.customerId,
    page,
    query: debouncedQuery,
    scheduledFrom: filters.scheduledFrom,
    scheduledTo: filters.scheduledTo,
    serviceId: filters.serviceId,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminBookings(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  const catalogQuery = useAdminQuery({
    enabled: catalogProp === undefined,
    request: (signal) => listAdminBookingFilterCatalog({ signal }),
    requestKey: "booking-filter-catalog",
  });
  const hasActiveFilters = hasActiveBookingFilters(filters);

  return (
    <AdminBookingsView
      filterCatalog={
        catalogProp ?? catalogQuery.data ?? emptyAdminBookingFilterCatalog
      }
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={toLiveBookingPresentation(query, hasActiveFilters)}
    />
  );
}

interface AdminBookingsViewProps {
  filterCatalog: AdminBookingFilterCatalog;
  filters?: AdminBookingFilters;
  onFiltersChange?: (filters: AdminBookingFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminBookingPresentation;
}

function AdminBookingsView({
  filterCatalog,
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminBookingsViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminBookingFilters>(
    defaultAdminBookingFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const sourceBookings =
    presentation.status === "ready" ? presentation.bookings : [];
  const visibleBookings =
    onFiltersChange === undefined
      ? filterBookings(sourceBookings, filters)
      : sourceBookings;
  const hasActiveFilters = hasActiveBookingFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-bookings"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminBookingCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminBookingCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BookingsToolbar
            catalog={filterCatalog}
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminBookingFilters);
            }}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BookingsTable
            bookings={visibleBookings}
            catalog={filterCatalog}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminBookingFilters);
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
      <BookingsCreateDialog
        catalog={filterCatalog}
        onCreated={onMutated}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </div>
  );
}

function toLiveBookingPresentation(
  query: AdminQueryState<AdminBookingList>,
  hasActiveFilters: boolean,
): AdminBookingPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.bookings.length === 0) {
    return hasActiveFilters
      ? {
          bookings: [],
          pagination: query.data?.pagination,
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    bookings: query.data.bookings,
    pagination: query.data.pagination,
    status: "ready",
  };
}
