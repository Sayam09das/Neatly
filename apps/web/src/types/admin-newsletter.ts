export const ADMIN_NEWSLETTER_STATUS_ALL = "all" as const;

export const adminNewsletterStatuses = ["SUBSCRIBED", "UNSUBSCRIBED"] as const;

export type AdminNewsletterStatus = (typeof adminNewsletterStatuses)[number];

export type AdminNewsletterStatusFilter =
  | typeof ADMIN_NEWSLETTER_STATUS_ALL
  | AdminNewsletterStatus;

export const ADMIN_NEWSLETTER_DATE_RANGE_ALL = "all" as const;

export const adminNewsletterDateRanges = [
  "all",
  "today",
  "week",
  "month",
  "custom",
] as const;

export type AdminNewsletterDateRange =
  (typeof adminNewsletterDateRanges)[number];

export interface AdminNewsletterSubscriber {
  createdAt: string;
  email: string;
  id: string;
  status: AdminNewsletterStatus;
  subscribedAt: string;
  unsubscribedAt: string | null;
  updatedAt: string;
}

export interface AdminNewsletterFilters {
  dateRange: AdminNewsletterDateRange;
  query: string;
  status: AdminNewsletterStatusFilter;
  subscribedFrom: string;
  subscribedTo: string;
}

export interface AdminNewsletterPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AdminNewsletterPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminNewsletterPagination;
      status: "ready";
      subscribers: readonly AdminNewsletterSubscriber[];
    };

export type AdminNewsletterDetailsPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | { status: "ready"; subscriber: AdminNewsletterSubscriber };
