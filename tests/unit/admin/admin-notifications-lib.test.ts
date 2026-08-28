import { describe, expect, it } from "vitest";
import {
  adminNotificationCopy,
  defaultAdminNotificationFilters,
} from "@/config/admin-notifications";
import {
  filterNotifications,
  formatNotificationTime,
  getNotificationReadState,
  getNotificationTitleLabel,
  hasActiveNotificationFilters,
  shouldRenderNotificationPagination,
} from "@/lib/admin/notifications";
import type { AdminNotification } from "@/types/admin-notification";

const NOTIFICATION: AdminNotification = {
  createdAt: "2026-03-12T10:00:00.000Z",
  id: "notification_alpha",
  isRead: false,
  message: "supplied notification message",
  relatedHref: null,
  relatedLabel: null,
  title: "supplied notification title",
};

describe("filterNotifications", (): void => {
  it("filters supplied notifications only and never invents rows", (): void => {
    expect(filterNotifications([], defaultAdminNotificationFilters)).toEqual(
      [],
    );
    expect(
      filterNotifications([NOTIFICATION], {
        ...defaultAdminNotificationFilters,
        query: "missing",
      }),
    ).toEqual([]);
    expect(
      filterNotifications([NOTIFICATION], {
        ...defaultAdminNotificationFilters,
        query: "supplied notification",
      }),
    ).toEqual([NOTIFICATION]);
    expect(
      filterNotifications([NOTIFICATION], {
        ...defaultAdminNotificationFilters,
        readState: "unread",
      }),
    ).toEqual([NOTIFICATION]);
    expect(
      filterNotifications([NOTIFICATION], {
        ...defaultAdminNotificationFilters,
        readState: "read",
      }),
    ).toEqual([]);
  });
});

describe("notification presentation helpers", (): void => {
  it("formats supplied timestamps and keeps empty values neutral", (): void => {
    expect(formatNotificationTime(null)).toBe(adminNotificationCopy.emptyValue);
    expect(formatNotificationTime("not-a-date")).toBe(
      adminNotificationCopy.emptyValue,
    );
    expect(formatNotificationTime(NOTIFICATION.createdAt)).not.toBe(
      adminNotificationCopy.emptyValue,
    );
    expect(getNotificationTitleLabel(null)).toBe(
      adminNotificationCopy.emptyValue,
    );
    expect(getNotificationReadState(null)).toBeNull();
    expect(getNotificationReadState(false)).toBe("unread");
    expect(getNotificationReadState(true)).toBe("read");
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveNotificationFilters(defaultAdminNotificationFilters)).toBe(
      false,
    );
    expect(
      hasActiveNotificationFilters({
        ...defaultAdminNotificationFilters,
        query: "supplied",
      }),
    ).toBe(true);
    expect(shouldRenderNotificationPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderNotificationPagination(
        {
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        },
        10,
      ),
    ).toBe(true);
  });
});
