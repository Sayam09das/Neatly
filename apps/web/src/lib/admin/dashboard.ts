import type { AdminActivityItem } from "@/components/admin/admin-activity-list";
import type { AdminMetricPresentation } from "@/components/admin/admin-metric-card";
import { ADMIN_API_PATHS } from "@/config/admin-api";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  readIsoDate,
  readNullableString,
  readNumber,
  readString,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";

export interface AdminDashboardCounts {
  active: number;
  total: number;
}

export interface AdminDashboardBookingCounts {
  assigned: number;
  cancelled: number;
  completed: number;
  confirmed: number;
  inProgress: number;
  pending: number;
  total: number;
}

export interface AdminDashboardRecentBooking {
  customerName: string | null;
  id: string;
  scheduledAt: string | null;
  serviceName: string | null;
  status: string;
}

export interface AdminDashboardRecentCustomer {
  id: string;
  joinedAt: string | null;
  name: string | null;
}

export interface AdminDashboardData {
  bookings: AdminDashboardBookingCounts;
  cleaners: AdminDashboardCounts;
  customers: AdminDashboardCounts;
  recentBookings: readonly AdminDashboardRecentBooking[];
  recentCustomers: readonly AdminDashboardRecentCustomer[];
  reviews: AdminDashboardCounts;
  services: AdminDashboardCounts;
}

export interface AdminDashboardViewModel {
  activityItems: readonly AdminActivityItem[];
  metrics: {
    bookings: AdminMetricPresentation;
    cleaners: AdminMetricPresentation;
    customers: AdminMetricPresentation;
    services: AdminMetricPresentation;
  };
  operationItems: readonly AdminActivityItem[];
}

export async function getAdminDashboard(
  init: RequestInit = {},
): Promise<AdminApiResult<AdminDashboardData>> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.dashboard, init);
  return mapAdminResult(result, mapDashboardData);
}

export function toAdminDashboardViewModel(
  data: AdminDashboardData,
): AdminDashboardViewModel {
  return {
    activityItems: [
      ...data.recentBookings.map((booking) => ({
        description: [booking.customerName, booking.serviceName]
          .filter((value): value is string => value !== null && value !== "")
          .join(" · "),
        id: `booking-${booking.id}`,
        timestampLabel: formatDashboardTime(booking.scheduledAt),
        title: `Booking ${booking.status.toLowerCase().replaceAll("_", " ")}`,
      })),
      ...data.recentCustomers.map((customer) => ({
        description: customer.name ?? "New customer",
        id: `customer-${customer.id}`,
        timestampLabel: formatDashboardTime(customer.joinedAt),
        title: "Customer added",
      })),
    ],
    metrics: {
      bookings: successMetric(
        data.bookings.total,
        `${String(data.bookings.pending)} pending`,
      ),
      cleaners: successMetric(
        data.cleaners.total,
        `${String(data.cleaners.active)} active`,
      ),
      customers: successMetric(
        data.customers.total,
        `${String(data.customers.active)} active`,
      ),
      services: successMetric(
        data.services.active,
        `${String(data.services.total)} in catalog`,
      ),
    },
    operationItems: data.recentBookings.map((booking) => ({
      description: [booking.customerName, booking.serviceName]
        .filter((value): value is string => value !== null && value !== "")
        .join(" · "),
      id: booking.id,
      timestampLabel: formatDashboardTime(booking.scheduledAt),
      title: booking.status.replaceAll("_", " "),
    })),
  };
}

function successMetric(
  value: number,
  supportingText: string,
): AdminMetricPresentation {
  return {
    status: "success",
    supportingText,
    value: String(value),
  };
}

function formatDashboardTime(isoDateTime: string | null): string | undefined {
  if (isoDateTime === null) {
    return undefined;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function mapDashboardData(value: unknown): AdminDashboardData | null {
  if (!isRecord(value)) {
    return null;
  }

  const bookings = mapBookingCounts(value.bookings);
  const cleaners = mapCounts(value.cleaners);
  const customers = mapCounts(value.customers);
  const reviews = mapCounts(value.reviews);
  const services = mapCounts(value.services);
  const recentBookings = mapRecentBookings(value.recentBookings);
  const recentCustomers = mapRecentCustomers(value.recentCustomers);

  if (
    bookings === null ||
    cleaners === null ||
    customers === null ||
    reviews === null ||
    services === null ||
    recentBookings === null ||
    recentCustomers === null
  ) {
    return null;
  }

  return {
    bookings,
    cleaners,
    customers,
    recentBookings,
    recentCustomers,
    reviews,
    services,
  };
}

function mapCounts(value: unknown): AdminDashboardCounts | null {
  if (!isRecord(value)) {
    return null;
  }

  const active = readNumber(value.active);
  const total = readNumber(value.total);

  if (active === null || total === null) {
    return null;
  }

  return { active, total };
}

function mapBookingCounts(value: unknown): AdminDashboardBookingCounts | null {
  if (!isRecord(value)) {
    return null;
  }

  const assigned = readNumber(value.assigned);
  const cancelled = readNumber(value.cancelled);
  const completed = readNumber(value.completed);
  const confirmed = readNumber(value.confirmed);
  const inProgress = readNumber(value.inProgress);
  const pending = readNumber(value.pending);
  const total = readNumber(value.total);

  if (
    assigned === null ||
    cancelled === null ||
    completed === null ||
    confirmed === null ||
    inProgress === null ||
    pending === null ||
    total === null
  ) {
    return null;
  }

  return {
    assigned,
    cancelled,
    completed,
    confirmed,
    inProgress,
    pending,
    total,
  };
}

function mapRecentBookings(
  value: unknown,
): AdminDashboardRecentBooking[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items: AdminDashboardRecentBooking[] = [];

  for (const row of value) {
    if (!isRecord(row)) {
      return null;
    }

    const id = readString(row.id);
    const status = readString(row.status);

    if (id === null || status === null) {
      return null;
    }

    items.push({
      customerName: readPartyName(row.customer),
      id,
      scheduledAt: readIsoDate(row.scheduledAt),
      serviceName: readPartyName(row.service),
      status,
    });
  }

  return items;
}

function mapRecentCustomers(
  value: unknown,
): AdminDashboardRecentCustomer[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items: AdminDashboardRecentCustomer[] = [];

  for (const row of value) {
    if (!isRecord(row)) {
      return null;
    }

    const id = readString(row.id);

    if (id === null) {
      return null;
    }

    items.push({
      id,
      joinedAt: readIsoDate(row.createdAt),
      name: readNullableString(row.name),
    });
  }

  return items;
}

function readPartyName(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  return readNullableString(value.name);
}
