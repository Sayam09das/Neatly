import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  adminNewsletterCopy,
  adminNewsletterDateRangeLabels,
  adminNewsletterStatusLabels,
} from "@/config/admin-newsletter";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readIsoDate,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import {
  ADMIN_NEWSLETTER_DATE_RANGE_ALL,
  ADMIN_NEWSLETTER_STATUS_ALL,
  type AdminNewsletterDateRange,
  type AdminNewsletterFilters,
  type AdminNewsletterPagination,
  type AdminNewsletterStatus,
  type AdminNewsletterStatusFilter,
  type AdminNewsletterSubscriber,
  adminNewsletterDateRanges,
  adminNewsletterStatuses,
} from "@/types/admin-newsletter";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

export interface AdminNewsletterDateBounds {
  end: Date;
  start: Date;
}

export interface AdminNewsletterMetricCounts {
  subscribed: number;
  total: number;
  unsubscribed: number;
}

export function hasActiveNewsletterFilters(
  filters: AdminNewsletterFilters,
): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_NEWSLETTER_STATUS_ALL ||
    filters.dateRange !== ADMIN_NEWSLETTER_DATE_RANGE_ALL ||
    filters.subscribedFrom !== "" ||
    filters.subscribedTo !== ""
  );
}

export function filterNewsletterSubscribers(
  subscribers: readonly AdminNewsletterSubscriber[],
  filters: AdminNewsletterFilters,
  now: Date = new Date(),
): readonly AdminNewsletterSubscriber[] {
  const query = filters.query.trim().toLowerCase();
  const range = resolveNewsletterDateBounds(filters, now);

  return subscribers.filter((subscriber): boolean => {
    if (
      filters.status !== ADMIN_NEWSLETTER_STATUS_ALL &&
      subscriber.status !== filters.status
    ) {
      return false;
    }

    if (!matchesSubscribedRange(subscriber.subscribedAt, range)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [subscriber.id, subscriber.email].join(" ").toLowerCase();

    return haystack.includes(query);
  });
}

export function countNewsletterMetrics(
  subscribers: readonly AdminNewsletterSubscriber[],
): AdminNewsletterMetricCounts {
  return {
    subscribed: countSubscribersByStatus(subscribers, "SUBSCRIBED"),
    total: subscribers.length,
    unsubscribed: countSubscribersByStatus(subscribers, "UNSUBSCRIBED"),
  };
}

export function resolveNewsletterDateBounds(
  filters: AdminNewsletterFilters,
  now: Date = new Date(),
): AdminNewsletterDateBounds | null {
  if (filters.dateRange === "custom") {
    return resolveCustomDateBounds(
      filters.subscribedFrom,
      filters.subscribedTo,
    );
  }

  if (filters.dateRange === "today") {
    return { end: endOfLocalDay(now), start: startOfLocalDay(now) };
  }

  if (filters.dateRange === "week") {
    const start = startOfLocalDay(now);
    start.setTime(start.getTime() - (DAYS_IN_WEEK - 1) * MS_PER_DAY);
    return { end: endOfLocalDay(now), start };
  }

  if (filters.dateRange === "month") {
    return { end: endOfLocalDay(now), start: startOfLocalMonth(now) };
  }

  return null;
}

export function formatNewsletterDateFilterChip(
  filters: AdminNewsletterFilters,
): string | null {
  if (
    filters.dateRange === ADMIN_NEWSLETTER_DATE_RANGE_ALL &&
    filters.subscribedFrom === "" &&
    filters.subscribedTo === ""
  ) {
    return null;
  }

  if (filters.dateRange !== "custom" && filters.dateRange !== "all") {
    return adminNewsletterDateRangeLabels[filters.dateRange];
  }

  if (filters.subscribedFrom === "" && filters.subscribedTo === "") {
    return null;
  }

  if (filters.subscribedFrom !== "" && filters.subscribedTo !== "") {
    return `${formatDateInput(filters.subscribedFrom)} – ${formatDateInput(filters.subscribedTo)}`;
  }

  return formatDateInput(
    filters.subscribedFrom !== ""
      ? filters.subscribedFrom
      : filters.subscribedTo,
  );
}

export function formatNewsletterInstant(
  isoDateTime: string | null,
  options: Intl.DateTimeFormatOptions,
): string {
  if (isoDateTime === null || isoDateTime.trim() === "") {
    return adminNewsletterCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminNewsletterCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

export function getNewsletterStatusLabel(
  status: AdminNewsletterStatusFilter,
): string {
  if (status === ADMIN_NEWSLETTER_STATUS_ALL) {
    return adminNewsletterCopy.statusAll;
  }

  return adminNewsletterStatusLabels[status];
}

export function shouldRenderNewsletterPagination(
  pagination: AdminNewsletterPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export function paginateNewsletterSubscribers(
  subscribers: readonly AdminNewsletterSubscriber[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): {
  pagination: AdminNewsletterPagination;
  subscribers: readonly AdminNewsletterSubscriber[];
} {
  const total = subscribers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    },
    subscribers: subscribers.slice(start, start + pageSize),
  };
}

export interface AdminNewsletterList {
  pagination: AdminNewsletterPagination;
  subscribers: readonly AdminNewsletterSubscriber[];
}

export interface AdminNewsletterListQuery extends AdminNewsletterFilters {
  page: number;
}

export async function listAdminNewsletterSubscribers(
  query: AdminNewsletterListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminNewsletterList>> {
  const bounds = resolveNewsletterDateBounds(query);

  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.newsletter, {
      filters: {
        status:
          query.status === ADMIN_NEWSLETTER_STATUS_ALL
            ? undefined
            : query.status,
        subscribedFrom: bounds?.start.toISOString(),
        subscribedTo: bounds?.end.toISOString(),
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapNewsletterList);
}

export async function getAdminNewsletterSubscriber(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminNewsletterSubscriber>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.newsletterSubscriber, id),
    init,
  );
  return mapAdminResult(result, mapNewsletterPayload);
}

function mapNewsletterPayload(
  value: unknown,
): AdminNewsletterSubscriber | null {
  if (!isRecord(value)) {
    return null;
  }

  return mapNewsletterSubscriber(value.subscriber ?? value);
}

function mapNewsletterList(value: unknown): AdminNewsletterList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const subscribers: AdminNewsletterSubscriber[] = [];

  for (const item of value.items) {
    const subscriber = mapNewsletterSubscriber(item);

    if (subscriber === null) {
      return null;
    }

    subscribers.push(subscriber);
  }

  return { pagination, subscribers };
}

function mapNewsletterSubscriber(
  value: unknown,
): AdminNewsletterSubscriber | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const email = readString(value.email);
  const status = readString(value.status);
  const createdAt = readIsoDate(value.createdAt);
  const subscribedAt = readIsoDate(value.subscribedAt);
  const updatedAt = readIsoDate(value.updatedAt);

  if (
    id === null ||
    email === null ||
    status === null ||
    createdAt === null ||
    subscribedAt === null ||
    updatedAt === null ||
    !isAdminNewsletterStatus(status)
  ) {
    return null;
  }

  return {
    createdAt,
    email,
    id,
    status,
    subscribedAt,
    unsubscribedAt: readIsoDate(value.unsubscribedAt),
    updatedAt,
  };
}

export function isAdminNewsletterStatus(
  value: string,
): value is AdminNewsletterStatus {
  return adminNewsletterStatuses.some((status) => status === value);
}

export function isAdminNewsletterDateRange(
  value: string,
): value is AdminNewsletterDateRange {
  return adminNewsletterDateRanges.some((range) => range === value);
}

function countSubscribersByStatus(
  subscribers: readonly AdminNewsletterSubscriber[],
  status: AdminNewsletterStatus,
): number {
  return subscribers.filter((subscriber) => subscriber.status === status)
    .length;
}

function matchesSubscribedRange(
  subscribedAt: string,
  range: AdminNewsletterDateBounds | null,
): boolean {
  if (range === null) {
    return true;
  }

  const date = new Date(subscribedAt);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getTime() >= range.start.getTime() &&
    date.getTime() <= range.end.getTime()
  );
}

function resolveCustomDateBounds(
  from: string,
  to: string,
): AdminNewsletterDateBounds | null {
  if (from === "" && to === "") {
    return null;
  }

  const start =
    from === "" ? null : startOfLocalDay(new Date(`${from}T00:00:00`));
  const end = to === "" ? null : endOfLocalDay(new Date(`${to}T00:00:00`));

  if (start !== null && Number.isNaN(start.getTime())) {
    return null;
  }

  if (end !== null && Number.isNaN(end.getTime())) {
    return null;
  }

  if (start === null && end === null) {
    return null;
  }

  return {
    end: end ?? endOfLocalDay(start ?? new Date()),
    start: start ?? startOfLocalDay(end ?? new Date()),
  };
}

function formatDateInput(isoDate: string): string {
  if (isoDate === "") {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
