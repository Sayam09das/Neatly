"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { ServicesCreateDialog } from "@/components/admin/services/services-create-dialog";
import { ServicesTable } from "@/components/admin/services/services-table";
import { ServicesToolbar } from "@/components/admin/services/services-toolbar";
import {
  adminServiceCopy,
  adminServiceFilterCatalog,
  defaultAdminServiceFilters,
} from "@/config/admin-services";
import { filterServices, hasActiveServiceFilters } from "@/lib/admin/services";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
  AdminServicePresentation,
} from "@/types/admin-service";

interface AdminServicesProps {
  filterCatalog?: AdminServiceFilterCatalog;
  presentation: AdminServicePresentation;
}

export function AdminServices({
  filterCatalog = adminServiceFilterCatalog,
  presentation,
}: AdminServicesProps): ReactElement {
  const [filters, setFilters] = useState<AdminServiceFilters>(
    defaultAdminServiceFilters,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sourceServices =
    presentation.status === "ready" ? presentation.services : [];
  const visibleServices = filterServices(sourceServices, filters);
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
      <ServicesCreateDialog onOpenChange={setCreateOpen} open={createOpen} />
    </div>
  );
}
