import { adminNotificationCopy } from "@/config/admin-notifications";
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
