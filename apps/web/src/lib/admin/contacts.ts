import { ADMIN_LIST_PAGE_SIZE } from "@/config/admin-api";
import {
  ADMIN_CONTACT_MESSAGE_PREVIEW_LENGTH,
  adminContactCopy,
  adminContactDateRangeLabels,
  adminContactStatusLabels,
} from "@/config/admin-contacts";
import {
  ADMIN_CONTACT_DATE_RANGE_ALL,
  ADMIN_CONTACT_STATUS_ALL,
  type AdminContact,
  type AdminContactDateRange,
  type AdminContactFilters,
  type AdminContactPagination,
  type AdminContactStatus,
  type AdminContactStatusFilter,
  adminContactDateRanges,
  adminContactStatuses,
} from "@/types/admin-contact";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

export interface AdminContactDateBounds {
  end: Date;
  start: Date;
}

export interface AdminContactMetricCounts {
  archived: number;
  new: number;
  read: number;
  responded: number;
  total: number;
}

export function hasActiveContactFilters(filters: AdminContactFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_CONTACT_STATUS_ALL ||
    filters.dateRange !== ADMIN_CONTACT_DATE_RANGE_ALL ||
    filters.createdFrom !== "" ||
    filters.createdTo !== ""
  );
}

export function filterContacts(
  contacts: readonly AdminContact[],
  filters: AdminContactFilters,
  now: Date = new Date(),
): readonly AdminContact[] {
  const query = filters.query.trim().toLowerCase();
  const range = resolveContactDateBounds(filters, now);

  return contacts.filter((contact): boolean => {
    if (
      filters.status !== ADMIN_CONTACT_STATUS_ALL &&
      contact.status !== filters.status
    ) {
      return false;
    }

    if (!matchesCreatedRange(contact.createdAt, range)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      contact.id,
      contact.fullName,
      contact.email,
      contact.subject,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function countContactMetrics(
  contacts: readonly AdminContact[],
): AdminContactMetricCounts {
  return {
    archived: countContactsByStatus(contacts, "ARCHIVED"),
    new: countContactsByStatus(contacts, "NEW"),
    read: countContactsByStatus(contacts, "READ"),
    responded: countContactsByStatus(contacts, "RESPONDED"),
    total: contacts.length,
  };
}

export function resolveContactDateBounds(
  filters: AdminContactFilters,
  now: Date = new Date(),
): AdminContactDateBounds | null {
  if (filters.dateRange === "custom") {
    return resolveCustomDateBounds(filters.createdFrom, filters.createdTo);
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
    return {
      end: endOfLocalDay(now),
      start: startOfLocalMonth(now),
    };
  }

  return null;
}

export function formatContactDateFilterChip(
  filters: AdminContactFilters,
): string | null {
  if (filters.dateRange === ADMIN_CONTACT_DATE_RANGE_ALL) {
    if (filters.createdFrom === "" && filters.createdTo === "") {
      return null;
    }
  }

  if (filters.dateRange !== "custom" && filters.dateRange !== "all") {
    return adminContactDateRangeLabels[filters.dateRange];
  }

  if (filters.createdFrom === "" && filters.createdTo === "") {
    return null;
  }

  if (filters.createdFrom !== "" && filters.createdTo !== "") {
    return `${formatContactDateInput(filters.createdFrom)} – ${formatContactDateInput(filters.createdTo)}`;
  }

  if (filters.createdFrom !== "") {
    return formatContactDateInput(filters.createdFrom);
  }

  return formatContactDateInput(filters.createdTo);
}

export function formatContactDateInput(isoDate: string): string {
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

export function formatContactInstant(
  isoDateTime: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (isoDateTime.trim() === "") {
    return adminContactCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminContactCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

export function getContactStatusLabel(
  status: AdminContactStatusFilter,
): string {
  if (status === ADMIN_CONTACT_STATUS_ALL) {
    return adminContactCopy.statusAll;
  }

  return adminContactStatusLabels[status];
}

export function getContactIdLabel(contactId: string): string {
  if (contactId.trim() === "") {
    return adminContactCopy.emptyValue;
  }

  return contactId;
}

export function getContactCustomerName(name: string): string {
  if (name.trim() === "") {
    return adminContactCopy.emptyValue;
  }

  return name;
}

export function getContactPhoneLabel(phone: string | null): string {
  if (phone === null || phone.trim() === "") {
    return adminContactCopy.emptyValue;
  }

  return phone;
}

export function getContactSubjectLabel(subject: string): string {
  if (subject.trim() === "") {
    return adminContactCopy.emptyValue;
  }

  return subject;
}

export function getContactMessagePreview(message: string): string {
  const trimmed = message.trim();

  if (trimmed === "") {
    return adminContactCopy.emptyValue;
  }

  if (trimmed.length <= ADMIN_CONTACT_MESSAGE_PREVIEW_LENGTH) {
    return trimmed;
  }

  return `${trimmed.slice(0, ADMIN_CONTACT_MESSAGE_PREVIEW_LENGTH).trimEnd()}…`;
}

export function shouldRenderContactPagination(
  pagination: AdminContactPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export function paginateContacts(
  contacts: readonly AdminContact[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): {
  contacts: readonly AdminContact[];
  pagination: AdminContactPagination;
} {
  const total = contacts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    contacts: contacts.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    },
  };
}

export function isAdminContactStatus(
  value: string,
): value is AdminContactStatus {
  return adminContactStatuses.some((status) => status === value);
}

export function isAdminContactDateRange(
  value: string,
): value is AdminContactDateRange {
  return adminContactDateRanges.some((range) => range === value);
}

function countContactsByStatus(
  contacts: readonly AdminContact[],
  status: AdminContactStatus,
): number {
  return contacts.filter((contact) => contact.status === status).length;
}

function matchesCreatedRange(
  createdAt: string,
  range: AdminContactDateBounds | null,
): boolean {
  if (range === null) {
    return true;
  }

  const date = new Date(createdAt);

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
): AdminContactDateBounds | null {
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
