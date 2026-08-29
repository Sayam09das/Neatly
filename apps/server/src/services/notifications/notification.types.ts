import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const NOTIFICATION_SORT_FIELDS = ["createdAt"] as const;

export interface NotificationRecord {
  createdAt: Date;
  id: string;
  isRead: boolean;
  message: string;
  readAt: Date | null;
  recipientId: string;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}

export interface CreateNotificationInput {
  message: string;
  recipientId: string;
  relatedHref?: string | null;
  relatedLabel?: string | null;
  title: string;
}

export interface NotificationListQuery {
  pagination?: PaginationQuery;
  recipientId: string;
  sort?: SortQuery;
  unreadOnly?: boolean;
}

export interface CustomerNotificationListQuery {
  pagination?: PaginationQuery;
  unreadOnly?: boolean;
}

export interface CustomerNotificationView {
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string;
  readAt: string | null;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}

export function toCustomerNotificationView(
  record: NotificationRecord,
): CustomerNotificationView {
  return {
    createdAt: record.createdAt.toISOString(),
    id: record.id,
    isRead: record.isRead,
    message: record.message,
    readAt: record.readAt === null ? null : record.readAt.toISOString(),
    relatedHref: toCustomerSafeHref(record.relatedHref),
    relatedLabel: record.relatedLabel,
    title: record.title,
  };
}

function toCustomerSafeHref(href: string | null): string | null {
  if (href === null || href === "") {
    return null;
  }

  if (!href.startsWith("/dashboard")) {
    return null;
  }

  if (
    href.includes("://") ||
    href.includes("\\") ||
    href.includes("..") ||
    href.includes("//", 1)
  ) {
    return null;
  }

  return href;
}
