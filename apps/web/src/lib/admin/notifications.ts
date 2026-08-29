import { ADMIN_API_PATHS, ADMIN_LIST_PAGE_SIZE } from "@/config/admin-api";
import { adminNotificationCopy } from "@/config/admin-notifications";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readBoolean,
  readIsoDate,
  readNullableString,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminNotification,
  AdminNotificationFilters,
  AdminNotificationPagination,
  AdminNotificationReadState,
} from "@/types/admin-notification";

export function hasActiveNotificationFilters(
  filters: AdminNotificationFilters,
): boolean {
  return filters.query.trim() !== "" || filters.readState !== "";
}

export function filterNotifications(
  notifications: readonly AdminNotification[],
  filters: AdminNotificationFilters,
): readonly AdminNotification[] {
  const query = filters.query.trim().toLowerCase();

  return notifications.filter((notification): boolean => {
    const readState = getNotificationReadState(notification.isRead);

    if (filters.readState !== "" && readState !== filters.readState) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [notification.title ?? "", notification.message ?? ""]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getNotificationReadState(
  isRead: boolean | null,
): AdminNotificationReadState | null {
  if (isRead === null) {
    return null;
  }

  return isRead ? "read" : "unread";
}

export function getNotificationTitleLabel(title: string | null): string {
  if (title === null || title.trim() === "") {
    return adminNotificationCopy.emptyValue;
  }

  return title;
}

export function getNotificationMessageLabel(message: string | null): string {
  if (message === null || message.trim() === "") {
    return adminNotificationCopy.emptyValue;
  }

  return message;
}

export function formatNotificationTime(isoDateTime: string | null): string {
  if (isoDateTime === null || isoDateTime === "") {
    return adminNotificationCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminNotificationCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export interface AdminNotificationList {
  notifications: readonly AdminNotification[];
  pagination: AdminNotificationPagination;
}

export interface AdminNotificationListQuery extends AdminNotificationFilters {
  page: number;
}

export async function listAdminNotifications(
  query: AdminNotificationListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminNotificationList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.notifications, {
      filters: {
        unreadOnly: query.readState === "unread" ? true : undefined,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
    }),
    init,
  );
  return mapAdminResult(result, mapNotificationList);
}

function mapNotificationList(value: unknown): AdminNotificationList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const notifications: AdminNotification[] = [];

  for (const item of value.items) {
    const notification = mapNotification(item);

    if (notification === null) {
      return null;
    }

    notifications.push(notification);
  }

  return { notifications, pagination };
}

function mapNotification(value: unknown): AdminNotification | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  return {
    createdAt: readIsoDate(value.createdAt),
    id,
    isRead: readBoolean(value.isRead),
    message: readNullableString(value.message),
    relatedHref: readNullableString(value.relatedHref),
    relatedLabel: readNullableString(value.relatedLabel),
    title: readNullableString(value.title),
  };
}

export function shouldRenderNotificationPagination(
  pagination: AdminNotificationPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}
