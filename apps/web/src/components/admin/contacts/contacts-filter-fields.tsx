"use client";

import { type ReactElement, useId } from "react";
import {
  ContactsDateField,
  ContactsSelect,
} from "@/components/admin/contacts/contacts-filter-controls";
import {
  adminContactCopy,
  adminContactDateRangeFilterOptions,
  adminContactStatusFilterOptions,
} from "@/config/admin-contacts";
import {
  isAdminContactDateRange,
  isAdminContactStatus,
} from "@/lib/admin/contacts";
import {
  ADMIN_CONTACT_STATUS_ALL,
  type AdminContactFilters,
} from "@/types/admin-contact";

interface ContactsFilterFieldsProps {
  filters: AdminContactFilters;
  onFiltersChange: (filters: AdminContactFilters) => void;
}

export function ContactsFilterFields({
  filters,
  onFiltersChange,
}: ContactsFilterFieldsProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();
  const fromId = useId();
  const toId = useId();
  const showCustomDates = filters.dateRange === "custom";

  return (
    <div className="flex flex-col gap-4">
      <ContactsSelect
        id={statusId}
        label={adminContactCopy.statusLabel}
        onChange={(value): void => {
          if (
            value !== ADMIN_CONTACT_STATUS_ALL &&
            !isAdminContactStatus(value)
          ) {
            return;
          }

          onFiltersChange({
            ...filters,
            status: value,
          });
        }}
        options={adminContactStatusFilterOptions}
        value={filters.status}
      />
      <ContactsSelect
        id={dateRangeId}
        label={adminContactCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminContactDateRange(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            createdFrom: value === "custom" ? filters.createdFrom : "",
            createdTo: value === "custom" ? filters.createdTo : "",
            dateRange: value,
          });
        }}
        options={adminContactDateRangeFilterOptions}
        value={filters.dateRange}
      />
      {showCustomDates ? (
        <>
          <ContactsDateField
            id={fromId}
            label={adminContactCopy.dateFromLabel}
            onChange={(createdFrom): void => {
              onFiltersChange({ ...filters, createdFrom });
            }}
            value={filters.createdFrom}
          />
          <ContactsDateField
            id={toId}
            label={adminContactCopy.dateToLabel}
            onChange={(createdTo): void => {
              onFiltersChange({ ...filters, createdTo });
            }}
            value={filters.createdTo}
          />
        </>
      ) : null}
    </div>
  );
}
