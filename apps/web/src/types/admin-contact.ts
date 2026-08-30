export const ADMIN_CONTACT_STATUS_ALL = "all" as const;

export const adminContactStatuses = [
  "NEW",
  "READ",
  "RESPONDED",
  "ARCHIVED",
] as const;

export type AdminContactStatus = (typeof adminContactStatuses)[number];

export type AdminContactStatusFilter =
  | typeof ADMIN_CONTACT_STATUS_ALL
  | AdminContactStatus;

export const ADMIN_CONTACT_DATE_RANGE_ALL = "all" as const;

export const adminContactDateRanges = [
  "all",
  "today",
  "week",
  "month",
  "custom",
] as const;

export type AdminContactDateRange = (typeof adminContactDateRanges)[number];

export interface AdminContact {
  adminNotes: string | null;
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  message: string;
  phone: string | null;
  status: AdminContactStatus;
  subject: string;
  updatedAt: string;
}

export interface AdminContactFilters {
  createdFrom: string;
  createdTo: string;
  dateRange: AdminContactDateRange;
  query: string;
  status: AdminContactStatusFilter;
}

export interface AdminContactPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AdminContactPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      contacts: readonly AdminContact[];
      pagination?: AdminContactPagination;
      status: "ready";
    };

export type AdminContactDetailsPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | { contact: AdminContact; status: "ready" };
