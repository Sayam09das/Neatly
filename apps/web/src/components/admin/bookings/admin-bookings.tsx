"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { BookingsCreateDialog } from "@/components/admin/bookings/bookings-create-dialog";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";
import { BookingsToolbar } from "@/components/admin/bookings/bookings-toolbar";
import {
  adminBookingCopy,
  defaultAdminBookingFilters,
  emptyAdminBookingFilterCatalog,
} from "@/config/admin-bookings";
import { filterBookings, hasActiveBookingFilters } from "@/lib/admin/bookings";
import type {
  AdminBookingFilterCatalog,
  AdminBookingFilters,
  AdminBookingPresentation,
} from "@/types/admin-booking";

interface AdminBookingsProps {
  filterCatalog?: AdminBookingFilterCatalog;
  presentation: AdminBookingPresentation;
}

export function AdminBookings({
  filterCatalog = emptyAdminBookingFilterCatalog,
  presentation,
}: AdminBookingsProps): ReactElement {
  const [filters, setFilters] = useState<AdminBookingFilters>(
    defaultAdminBookingFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sourceBookings =
    presentation.status === "ready" ? presentation.bookings : [];
  const visibleBookings = filterBookings(sourceBookings, filters);
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
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminBookingFilters);
            }}
            onCreate={(): void => {
              setCreateOpen(true);
            }}
            pagination={
              presentation.status === "ready"
                ? presentation.pagination
                : undefined
            }
            presentation={presentation}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
      <BookingsCreateDialog onOpenChange={setCreateOpen} open={createOpen} />
    </div>
  );
}
