"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { CustomersCreateDialog } from "@/components/admin/customers/customers-create-dialog";
import { CustomersTable } from "@/components/admin/customers/customers-table";
import { CustomersToolbar } from "@/components/admin/customers/customers-toolbar";
import {
  adminCustomerCopy,
  defaultAdminCustomerFilters,
  emptyAdminCustomerFilterCatalog,
} from "@/config/admin-customers";
import {
  filterCustomers,
  hasActiveCustomerFilters,
} from "@/lib/admin/customers";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
  AdminCustomerPresentation,
} from "@/types/admin-customer";

interface AdminCustomersProps {
  filterCatalog?: AdminCustomerFilterCatalog;
  presentation: AdminCustomerPresentation;
}

export function AdminCustomers({
  filterCatalog = emptyAdminCustomerFilterCatalog,
  presentation,
}: AdminCustomersProps): ReactElement {
  const [filters, setFilters] = useState<AdminCustomerFilters>(
    defaultAdminCustomerFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sourceCustomers =
    presentation.status === "ready" ? presentation.customers : [];
  const visibleCustomers = filterCustomers(sourceCustomers, filters);
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
            pagination={
              presentation.status === "ready"
                ? presentation.pagination
                : undefined
            }
            presentation={presentation}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
      <CustomersCreateDialog onOpenChange={setCreateOpen} open={createOpen} />
    </div>
  );
}
