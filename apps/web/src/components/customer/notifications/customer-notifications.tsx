"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import { useOptionalCustomerRealtime } from "@/components/customer/customer-realtime-provider";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerNotificationsEmptyState } from "@/components/customer/customer-states";
import { customerNotificationsCopy } from "@/config/customer";
import {
  type CustomerNotificationsQuery,
  customerNotificationsHref,
  isCustomerSafeNotificationHref,
  markAllCustomerNotificationsRead,
  markCustomerNotificationRead,
} from "@/lib/customer/notifications";
import { useCustomerRefresh } from "@/lib/customer/refresh";
import { formatCustomerSchedule } from "@/lib/customer/schedule";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import { toast } from "@/lib/toast";
import type {
  CustomerNotification,
  CustomerNotificationList,
} from "@/types/customer";

interface CustomerNotificationsProps {
  list: CustomerNotificationList | null;
  query: CustomerNotificationsQuery;
}

export function CustomerNotifications({
  list,
  query,
}: CustomerNotificationsProps): ReactElement {
  const refresh = useCustomerRefresh();
  const realtime = useOptionalCustomerRealtime();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const unreadOnPage =
    list === null ? 0 : list.items.filter((item) => !item.isRead).length;

  async function handleMarkRead(id: string): Promise<void> {
    if (pendingId !== null || markingAll) {
      return;
    }

    setPendingId(id);
    const result = await markCustomerNotificationRead(id);
    setPendingId(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      toast.error({ title: customerNotificationsCopy.markReadError });
      return;
    }

    toast.success({ title: customerNotificationsCopy.markReadSuccess });
    realtime?.refreshUnread();
    refresh();
  }

  async function handleMarkAll(): Promise<void> {
    if (pendingId !== null || markingAll || unreadOnPage === 0) {
      return;
    }

    setMarkingAll(true);
    const result = await markAllCustomerNotificationsRead();
    setMarkingAll(false);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      toast.error({ title: customerNotificationsCopy.markAllError });
      return;
    }

    toast.success({ title: customerNotificationsCopy.markAllSuccess });
    realtime?.refreshUnread();
    refresh();
  }

  return (
    <div className="w-full min-w-0 max-w-2xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-prose">
          <h1 className="text-h1 text-foreground tracking-tight">
            {customerNotificationsCopy.heading}
          </h1>
          <p className="mt-3 text-body text-muted-foreground">
            {customerNotificationsCopy.description}
          </p>
        </div>
        {list !== null && list.items.length > 0 ? (
          <Button
            disabled={markingAll || pendingId !== null || unreadOnPage === 0}
            onClick={(): void => {
              void handleMarkAll();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {markingAll
              ? customerNotificationsCopy.marking
              : customerNotificationsCopy.markAllAction}
          </Button>
        ) : null}
      </header>
      {list === null ? (
        <div className="mt-8">
          <CustomerRefreshErrorState />
        </div>
      ) : list.items.length === 0 ? (
        <div className="mt-8">
          <CustomerNotificationsEmptyState />
        </div>
      ) : (
        <>
          <ul
            className="mt-8 space-y-3"
            data-slot="customer-notifications-list"
          >
            {list.items.map((notification) => (
              <li key={notification.id}>
                <NotificationRow
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  pending={pendingId === notification.id}
                />
              </li>
            ))}
          </ul>
          <NotificationsPagination
            page={list.pagination.page}
            query={query}
            totalPages={list.pagination.totalPages}
          />
        </>
      )}
    </div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  pending,
}: {
  notification: CustomerNotification;
  onMarkRead: (id: string) => Promise<void>;
  pending: boolean;
}): ReactElement {
  const unread = !notification.isRead;
  const relatedHref = isCustomerSafeNotificationHref(notification.relatedHref)
    ? notification.relatedHref
    : null;
  const createdLabel = formatCustomerSchedule(notification.createdAt);

  return (
    <article
      className={cn(
        "rounded-lg border border-border p-4",
        unread ? "bg-muted/60" : "bg-surface",
      )}
      data-read={unread ? "unread" : "read"}
      data-slot="customer-notification-item"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body-small font-medium text-foreground">
            {notification.title}
          </p>
          {createdLabel === null ? null : (
            <p className="mt-1 text-caption text-muted-foreground">
              {createdLabel}
            </p>
          )}
        </div>
        <span className="shrink-0 text-caption font-medium text-foreground">
          {unread
            ? customerNotificationsCopy.unreadLabel
            : customerNotificationsCopy.readLabel}
        </span>
      </div>
      <p className="mt-2 text-body-small leading-relaxed text-muted-foreground">
        {notification.message}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          disabled={!unread || pending}
          onClick={(): void => {
            void onMarkRead(notification.id);
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          {pending
            ? customerNotificationsCopy.marking
            : customerNotificationsCopy.markReadAction}
        </Button>
        {relatedHref !== null &&
        notification.relatedLabel !== null &&
        notification.relatedLabel !== "" ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={relatedHref}>{notification.relatedLabel}</Link>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function NotificationsPagination({
  page,
  query,
  totalPages,
}: {
  page: number;
  query: CustomerNotificationsQuery;
  totalPages: number;
}): ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={customerNotificationsCopy.paginationLabel}
      className="mt-8 flex flex-wrap items-center gap-3"
    >
      {page > 1 ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerNotificationsHref({ ...query, page: page - 1 })}
        >
          {customerNotificationsCopy.paginationPrevious}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {customerNotificationsCopy.paginationPrevious}
        </span>
      )}
      <p className="text-body-small text-muted-foreground">
        {page} / {totalPages}
      </p>
      {page < totalPages ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerNotificationsHref({ ...query, page: page + 1 })}
        >
          {customerNotificationsCopy.paginationNext}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {customerNotificationsCopy.paginationNext}
        </span>
      )}
    </nav>
  );
}
