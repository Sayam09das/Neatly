"use client";

import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminSettingsCopy } from "@/config/admin-settings";

export function SettingsLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="settings-loading"
      role="status"
    >
      <p className="sr-only">{adminSettingsCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface SettingsErrorProps {
  onRetry: () => void;
}

export function SettingsError({ onRetry }: SettingsErrorProps): ReactElement {
  return (
    <div data-slot="settings-error">
      <AdminRetryState
        actionLabel={adminSettingsCopy.retryLabel}
        description={adminSettingsCopy.errorDescription}
        onRetry={onRetry}
        title={adminSettingsCopy.errorTitle}
      />
    </div>
  );
}
