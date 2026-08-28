import {
  adminBookingCopy,
  adminBookingStatusLabels,
} from "@/config/admin-bookings";
import type {
  AdminBooking,
  AdminBookingFilters,
  AdminBookingPagination,
  AdminBookingStatusFilter,
} from "@/types/admin-booking";
import { ADMIN_BOOKING_STATUS_ALL } from "@/types/admin-booking";

const DATE_ONLY_PATTERN = /^(\d{4}-\d{2}-\d{2})/;

export function hasActiveBookingFilters(filters: AdminBookingFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_BOOKING_STATUS_ALL ||
    filters.scheduledFrom !== "" ||
    filters.scheduledTo !== "" ||
    filters.cleanerId !== "" ||
    filters.customerId !== "" ||
    filters.serviceId !== ""
  );
}

export function filterBookings(
  bookings: readonly AdminBooking[],
  filters: AdminBookingFilters,
): readonly AdminBooking[] {
  const query = filters.query.trim().toLowerCase();

  return bookings.filter((booking): boolean => {
    if (
      filters.status !== ADMIN_BOOKING_STATUS_ALL &&
      booking.status !== filters.status
    ) {
      return false;
    }

    if (filters.cleanerId !== "" && booking.cleanerId !== filters.cleanerId) {
      return false;
    }

    if (
      filters.customerId !== "" &&
      booking.customerId !== filters.customerId
    ) {
      return false;
    }

    if (filters.serviceId !== "" && booking.serviceId !== filters.serviceId) {
      return false;
    }

    if (!matchesScheduledRange(booking.scheduledAt, filters)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      booking.id,
      booking.customerName ?? "",
      booking.serviceName ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function formatBookingSchedule(isoDateTime: string | null): string {
  if (isoDateTime === null || isoDateTime === "") {
    return adminBookingCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminBookingCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatBookingDateInput(isoDate: string): string {
  if (isoDate === "") {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function formatBookingDateFilterChip(
  filters: AdminBookingFilters,
): string | null {
  if (filters.scheduledFrom === "" && filters.scheduledTo === "") {
    return null;
  }

  if (filters.scheduledFrom !== "" && filters.scheduledTo !== "") {
    return `${formatBookingDateInput(filters.scheduledFrom)} – ${formatBookingDateInput(filters.scheduledTo)}`;
  }

  if (filters.scheduledFrom !== "") {
    return formatBookingDateInput(filters.scheduledFrom);
  }

  return formatBookingDateInput(filters.scheduledTo);
}

export function getBookingStatusLabel(
  status: AdminBookingStatusFilter,
): string {
  if (status === ADMIN_BOOKING_STATUS_ALL) {
    return adminBookingCopy.statusAll;
  }

  return adminBookingStatusLabels[status];
}

export function getBookingIdLabel(bookingId: string): string {
  if (bookingId.trim() === "") {
    return adminBookingCopy.emptyValue;
  }

  return bookingId;
}

export function getBookingCustomerLabel(customerName: string | null): string {
  if (customerName === null || customerName.trim() === "") {
    return adminBookingCopy.customerEmpty;
  }

  return customerName;
}

export function getBookingServiceLabel(serviceName: string | null): string {
  if (serviceName === null || serviceName.trim() === "") {
    return adminBookingCopy.emptyValue;
  }

  return serviceName;
}

export function getBookingCleanerLabel(cleanerName: string | null): string {
  if (cleanerName === null || cleanerName.trim() === "") {
    return adminBookingCopy.unassignedCleaner;
  }

  return cleanerName;
}

export function shouldRenderBookingPagination(
  pagination: AdminBookingPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

function matchesScheduledRange(
  scheduledAt: string | null,
  filters: AdminBookingFilters,
): boolean {
  if (filters.scheduledFrom === "" && filters.scheduledTo === "") {
    return true;
  }

  if (scheduledAt === null) {
    return false;
  }

  const bookingDate = extractDateOnly(scheduledAt);

  if (bookingDate === null) {
    return false;
  }

  if (filters.scheduledFrom !== "" && bookingDate < filters.scheduledFrom) {
    return false;
  }

  if (filters.scheduledTo !== "" && bookingDate > filters.scheduledTo) {
    return false;
  }

  return true;
}

function extractDateOnly(value: string): string | null {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (match === null) {
    return null;
  }

  const date = match[1];

  return date === undefined ? null : date;
}
