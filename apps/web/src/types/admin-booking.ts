export const ADMIN_BOOKING_STATUS_ALL = "all" as const;

export const adminBookingStatuses = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type AdminBookingStatus = (typeof adminBookingStatuses)[number];

export type AdminBookingStatusFilter =
  | typeof ADMIN_BOOKING_STATUS_ALL
  | AdminBookingStatus;

export interface AdminBooking {
  cleanerId: string | null;
  cleanerName: string | null;
  customerId: string | null;
  customerName: string | null;
  id: string;
  scheduledAt: string | null;
  serviceId: string | null;
  serviceName: string | null;
  status: AdminBookingStatus;
}

export interface AdminBookingFilters {
  cleanerId: string;
  customerId: string;
  query: string;
  scheduledFrom: string;
  scheduledTo: string;
  serviceId: string;
  status: AdminBookingStatusFilter;
}

export interface AdminBookingPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminBookingFilterOption {
  id: string;
  label: string;
}

export interface AdminBookingFilterCatalog {
  cleaners: readonly AdminBookingFilterOption[];
  customers: readonly AdminBookingFilterOption[];
  services: readonly AdminBookingFilterOption[];
}

export type AdminBookingPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      bookings: readonly AdminBooking[];
      pagination?: AdminBookingPagination;
      status: "ready";
    };
