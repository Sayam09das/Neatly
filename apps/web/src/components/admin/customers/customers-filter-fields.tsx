"use client";

import { type ReactElement, useId } from "react";
import {
  CustomersDateField,
  CustomersSelect,
} from "@/components/admin/customers/customers-filter-controls";
import { adminCustomerCopy } from "@/config/admin-customers";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
} from "@/types/admin-customer";

interface CustomersFilterFieldsProps {
  catalog: AdminCustomerFilterCatalog;
  filters: AdminCustomerFilters;
  onFiltersChange: (filters: AdminCustomerFilters) => void;
}

export function CustomersFilterFields({
  catalog,
  filters,
  onFiltersChange,
}: CustomersFilterFieldsProps): ReactElement {
  const statusId = useId();
  const activityId = useId();
  const fromId = useId();
  const toId = useId();

  return (
    <div className="flex flex-col gap-4">
      <CustomersSelect
        emptyLabel={adminCustomerCopy.statusEmpty}
        id={statusId}
        label={adminCustomerCopy.statusLabel}
        onChange={(status): void => {
          onFiltersChange({ ...filters, status });
        }}
        options={catalog.statuses.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.status}
      />
      <CustomersSelect
        emptyLabel={adminCustomerCopy.activityEmpty}
        id={activityId}
        label={adminCustomerCopy.activityLabel}
        onChange={(): void => undefined}
        options={[]}
        value=""
      />
      <CustomersDateField
        id={fromId}
        label={adminCustomerCopy.joinedFromLabel}
        onChange={(joinedFrom): void => {
          onFiltersChange({ ...filters, joinedFrom });
        }}
        value={filters.joinedFrom}
      />
      <CustomersDateField
        id={toId}
        label={adminCustomerCopy.joinedToLabel}
        onChange={(joinedTo): void => {
          onFiltersChange({ ...filters, joinedTo });
        }}
        value={filters.joinedTo}
      />
    </div>
  );
}
