"use client";

import { type ReactElement, useId } from "react";
import { ServicesSelect } from "@/components/admin/services/services-filter-controls";
import { adminServiceCopy } from "@/config/admin-services";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
} from "@/types/admin-service";

interface ServicesFilterFieldsProps {
  catalog: AdminServiceFilterCatalog;
  filters: AdminServiceFilters;
  onFiltersChange: (filters: AdminServiceFilters) => void;
}

export function ServicesFilterFields({
  catalog,
  filters,
  onFiltersChange,
}: ServicesFilterFieldsProps): ReactElement {
  const statusId = useId();

  return (
    <div className="flex flex-col gap-4">
      <ServicesSelect
        allLabel={adminServiceCopy.statusAll}
        id={statusId}
        label={adminServiceCopy.statusLabel}
        onChange={(status): void => {
          onFiltersChange({ ...filters, status });
        }}
        options={catalog.statuses.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.status}
      />
    </div>
  );
}
