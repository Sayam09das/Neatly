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
