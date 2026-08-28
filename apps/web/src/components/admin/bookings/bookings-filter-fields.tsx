"use client";

import { type ReactElement, useId } from "react";
import {
  BookingsDateField,
  BookingsSelect,
} from "@/components/admin/bookings/bookings-filter-controls";
import {
  adminBookingCopy,
  adminBookingStatusFilterOptions,
} from "@/config/admin-bookings";
import type {
  AdminBookingFilterCatalog,
  AdminBookingFilters,
  AdminBookingStatusFilter,
} from "@/types/admin-booking";

interface BookingsFilterFieldsProps {
  catalog: AdminBookingFilterCatalog;
  filters: AdminBookingFilters;
  onFiltersChange: (filters: AdminBookingFilters) => void;
}

export function BookingsFilterFields({
  catalog,
  filters,
  onFiltersChange,
}: BookingsFilterFieldsProps): ReactElement {
  const statusId = useId();
  const fromId = useId();
  const toId = useId();
  const cleanerId = useId();
  const serviceId = useId();
  const customerId = useId();

  return (
    <div className="flex flex-col gap-4">
      <BookingsSelect
        id={statusId}
        label={adminBookingCopy.statusLabel}
        onChange={(value): void => {
          onFiltersChange({
            ...filters,
            status: value as AdminBookingStatusFilter,
          });
        }}
        options={adminBookingStatusFilterOptions}
        value={filters.status}
      />
      <BookingsDateField
        id={fromId}
        label={adminBookingCopy.dateFromLabel}
        onChange={(scheduledFrom): void => {
          onFiltersChange({ ...filters, scheduledFrom });
        }}
        value={filters.scheduledFrom}
      />
      <BookingsDateField
        id={toId}
        label={adminBookingCopy.dateToLabel}
        onChange={(scheduledTo): void => {
          onFiltersChange({ ...filters, scheduledTo });
        }}
        value={filters.scheduledTo}
      />
      <BookingsSelect
        emptyLabel={adminBookingCopy.filterServiceEmpty}
        id={serviceId}
        label={adminBookingCopy.filterServiceLabel}
        onChange={(serviceIdValue): void => {
          onFiltersChange({ ...filters, serviceId: serviceIdValue });
        }}
        options={catalog.services.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.serviceId}
      />
      <BookingsSelect
        emptyLabel={adminBookingCopy.filterCleanerEmpty}
        id={cleanerId}
        label={adminBookingCopy.filterCleanerLabel}
        onChange={(cleanerIdValue): void => {
          onFiltersChange({ ...filters, cleanerId: cleanerIdValue });
        }}
        options={catalog.cleaners.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.cleanerId}
      />
      <BookingsSelect
        emptyLabel={adminBookingCopy.filterCustomerEmpty}
        id={customerId}
        label={adminBookingCopy.filterCustomerLabel}
        onChange={(customerIdValue): void => {
          onFiltersChange({ ...filters, customerId: customerIdValue });
        }}
        options={catalog.customers.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.customerId}
      />
    </div>
  );
}
