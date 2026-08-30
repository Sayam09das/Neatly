"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ContactsIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminContactCopy } from "@/config/admin-contacts";

interface ContactsNoMatchesStateProps {
  onClearFilters: () => void;
}

export function ContactsEmptyState(): ReactElement {
  return (
    <div data-slot="contacts-empty-state">
      <AdminEmptyState
        description={adminContactCopy.emptyDescription}
        icon={ContactsIcon}
        title={adminContactCopy.emptyTitle}
      />
    </div>
  );
}

export function ContactsNoMatchesState({
  onClearFilters,
}: ContactsNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="contacts-no-matches">
      <AdminEmptyState
        description={adminContactCopy.noMatchesDescription}
        icon={ContactsIcon}
        title={adminContactCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminContactCopy.clearFilters}
      </Button>
    </div>
  );
}

export function ContactsLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="contacts-loading"
      role="status"
    >
      <p className="sr-only">{adminContactCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface ContactsErrorProps {
  onRetry: () => void;
}

export function ContactsError({ onRetry }: ContactsErrorProps): ReactElement {
  return (
    <div data-slot="contacts-error">
      <AdminRetryState
        actionLabel={adminContactCopy.retryLabel}
        description={adminContactCopy.errorDescription}
        onRetry={onRetry}
        title={adminContactCopy.errorTitle}
      />
    </div>
  );
}
