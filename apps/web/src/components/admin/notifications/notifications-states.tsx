"use client";

import { Button, Card, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { BellIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminNotificationCopy } from "@/config/admin-notifications";

export function NotificationsEmptyState(): ReactElement {
  return (
    <div data-slot="notifications-empty-state">
      <AdminEmptyState
        description={adminNotificationCopy.emptyDescription}
        icon={BellIcon}
        title={adminNotificationCopy.emptyTitle}
      />
    </div>
  );
}

interface NotificationsNoMatchesStateProps {
  onClearFilters: () => void;
}

export function NotificationsNoMatchesState({
  onClearFilters,
}: NotificationsNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="notifications-no-matches">
      <AdminEmptyState
        description={adminNotificationCopy.noMatchesDescription}
        icon={BellIcon}
        title={adminNotificationCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminNotificationCopy.clearFilters}
      </Button>
    </div>
  );
}

export function NotificationsLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="notifications-loading"
      role="status"
    >
      <p className="sr-only">{adminNotificationCopy.loadingLabel}</p>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-2/3 max-w-full" />
    </div>
  );
}

interface NotificationsErrorProps {
  onRetry: () => void;
}

export function NotificationsError({
  onRetry,
}: NotificationsErrorProps): ReactElement {
  return (
    <div data-slot="notifications-error">
      <AdminRetryState
        actionLabel={adminNotificationCopy.retryLabel}
        description={adminNotificationCopy.errorDescription}
        onRetry={onRetry}
        title={adminNotificationCopy.errorTitle}
      />
    </div>
  );
}

export function NotificationsUnavailableCard({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  return <Card className="p-6 shadow-none">{children}</Card>;
}
