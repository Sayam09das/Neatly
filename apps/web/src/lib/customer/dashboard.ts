import { loadCustomerAccount } from "@/lib/customer/account";
import { loadCustomerOverview } from "@/lib/customer/booking";
import {
  loadCustomerNotifications,
  loadCustomerUnreadCount,
} from "@/lib/customer/notifications";
import { loadCustomerQuotes } from "@/lib/customer/quotes";
import type {
  CustomerNotification,
  CustomerOverview,
  CustomerQuoteList,
  CustomerQuoteStatus,
  CustomerQuoteView,
} from "@/types/customer";

export const CUSTOMER_DASHBOARD_QUOTE_PREVIEW_LIMIT = 3;
export const CUSTOMER_DASHBOARD_NOTIFICATION_PREVIEW_LIMIT = 3;

export const CUSTOMER_ACTIVE_QUOTE_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUOTED",
  "ACCEPTED",
] as const satisfies readonly CustomerQuoteStatus[];

export type CustomerDashboardSection<T> =
  | { data: T; status: "ready" }
  | { status: "error" };

export interface CustomerDashboardWorkspace {
  accountVerified: boolean | null;
  notifications: CustomerDashboardSection<{
    items: readonly CustomerNotification[];
    unreadCount: number;
  }>;
  overview: CustomerOverview | null;
  quotes: CustomerDashboardSection<CustomerQuoteList>;
  unauthorized: boolean;
}

export function countActiveQuotes(
  quotes: readonly CustomerQuoteView[],
): number {
  return quotes.filter((quote) =>
    (CUSTOMER_ACTIVE_QUOTE_STATUSES as readonly CustomerQuoteStatus[]).includes(
      quote.status,
    ),
  ).length;
}

export function previewQuotes(
  quotes: readonly CustomerQuoteView[],
): readonly CustomerQuoteView[] {
  return quotes.slice(0, CUSTOMER_DASHBOARD_QUOTE_PREVIEW_LIMIT);
}

export function previewNotifications(
  items: readonly CustomerNotification[],
): readonly CustomerNotification[] {
  const unread = items.filter((item) => !item.isRead);
  const source = unread.length > 0 ? unread : items;
  return source.slice(0, CUSTOMER_DASHBOARD_NOTIFICATION_PREVIEW_LIMIT);
}

export function isCustomerDashboardEmpty(
  overview: CustomerOverview,
  quotes: readonly CustomerQuoteView[],
  unreadCount: number,
): boolean {
  return (
    overview.summary.total === 0 && quotes.length === 0 && unreadCount === 0
  );
}

export async function loadCustomerDashboardWorkspace(
  sessionToken: string | undefined,
): Promise<CustomerDashboardWorkspace> {
  const [
    overviewResult,
    quotesResult,
    notificationsResult,
    unreadResult,
    accountResult,
  ] = await Promise.all([
    loadCustomerOverview(sessionToken),
    loadCustomerQuotes(sessionToken),
    loadCustomerNotifications({ page: 1 }, sessionToken),
    loadCustomerUnreadCount(sessionToken),
    loadCustomerAccount(sessionToken),
  ]);

  if (
    (!overviewResult.ok && overviewResult.unauthorized) ||
    (!quotesResult.ok && quotesResult.unauthorized) ||
    (!notificationsResult.ok && notificationsResult.unauthorized) ||
    (!unreadResult.ok && unreadResult.unauthorized) ||
    (!accountResult.ok && accountResult.unauthorized)
  ) {
    return {
      accountVerified: null,
      notifications: { status: "error" },
      overview: null,
      quotes: { status: "error" },
      unauthorized: true,
    };
  }

  return {
    accountVerified: accountResult.ok
      ? accountResult.account.emailVerified
      : null,
    notifications:
      notificationsResult.ok && unreadResult.ok
        ? {
            data: {
              items: notificationsResult.list.items,
              unreadCount: unreadResult.count,
            },
            status: "ready",
          }
        : { status: "error" },
    overview: overviewResult.ok ? overviewResult.overview : null,
    quotes: quotesResult.ok
      ? { data: quotesResult.list, status: "ready" }
      : { status: "error" },
    unauthorized: false,
  };
}
