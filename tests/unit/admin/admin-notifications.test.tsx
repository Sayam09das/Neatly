/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminNotificationsPage from "@/app/admin/(app)/notifications/page";
import { AdminNotifications } from "@/components/admin/notifications/admin-notifications";
import { NotificationItem } from "@/components/admin/notifications/notification-item";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminNotificationCopy } from "@/config/admin-notifications";
import type { AdminNotification } from "@/types/admin-notification";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/notifications",
  useRouter: (): { replace: () => void } => ({
    replace: (): void => undefined,
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/admin/use-admin-list-state", () => ({
  useAdminListState: <T,>({
    defaults,
  }: {
    defaults: T;
  }): {
    filters: T;
    page: number;
    setFilters: (filters: T) => void;
    setPage: (page: number) => void;
  } => ({
    filters: defaults,
    page: 1,
    setFilters: (): void => undefined,
    setPage: (): void => undefined,
  }),
}));

vi.mock("@/lib/admin/notifications", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/admin/notifications")>();

  return {
    ...actual,
    listAdminNotifications: vi.fn().mockResolvedValue({
      data: {
        notifications: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
      },
      ok: true,
      status: 200,
    }),
  };
});

const TEST_NOTIFICATION: AdminNotification = {
  createdAt: null,
  id: "notification_test",
  isRead: false,
  message: null,
  relatedHref: null,
  relatedLabel: null,
  title: null,
};

const FORBIDDEN_FAKE_NOTIFICATION_COPY = [
  "New booking from Jane",
  "Cleaner assigned",
  "99+",
  "You have 5 unread",
  "Quote received from John",
];

describe("Admin notifications page", (): void => {
  it("renders the title, search, filters, and empty state without fake notifications", async (): Promise<void> => {
    render(<AdminNotificationsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminNotificationCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminNotificationCopy.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: adminNotificationCopy.searchLabel,
      }),
    ).toHaveAttribute("placeholder", adminNotificationCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", {
        name: adminNotificationCopy.readStateLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminNotificationCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminNotificationCopy.markAllAction }),
    ).toBeDisabled();
    await waitFor((): void => {
      expect(
        screen.getByText(adminNotificationCopy.emptyTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminNotificationCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminNotificationCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_NOTIFICATION_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminNotifications presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText(adminNotificationCopy.loadingLabel),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminNotifications
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(
      screen.getByText(adminNotificationCopy.errorTitle),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminNotificationCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders notification items with unread text and disabled mark-as-read", (): void => {
    render(
      <AdminNotifications
        presentation={{
          notifications: [TEST_NOTIFICATION],
          status: "ready",
        }}
      />,
    );

    expect(
      document.querySelector('[data-slot="notifications-list"]'),
    ).toBeTruthy();
    expect(
      document.querySelector('[data-slot="notification-item"]'),
    ).toBeTruthy();
    expect(
      screen.getAllByText(adminNotificationCopy.unreadLabel).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", {
        name: adminNotificationCopy.markReadAction,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: adminNotificationCopy.markAllAction }),
    ).toBeEnabled();
  });

  it("opens filters and shows chips when search is active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminNotifications presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminNotificationCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminNotificationCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminNotificationCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("searchbox", {
        name: adminNotificationCopy.searchLabel,
      }),
      "notification_test",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminNotificationCopy.searchLabel}: notification_test`,
      }),
    ).toBeInTheDocument();
  });
});

describe("Notification item", (): void => {
  it("renders unread state with text, not only color", (): void => {
    render(<NotificationItem notification={TEST_NOTIFICATION} />);

    expect(
      screen.getByText(adminNotificationCopy.unreadLabel),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminNotificationCopy.emptyValue).length,
    ).toBeGreaterThan(0);
    expect(ADMIN_PATHS.notifications).toBe("/admin/notifications");
  });
});
