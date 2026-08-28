import { Card, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ActivityIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminDashboardCopy } from "@/config/admin-dashboard";
import { adminShellCopy } from "@/config/admin-ui";

export interface AdminActivityItem {
  description: string;
  id: string;
  timestampLabel?: string;
  title: string;
}

export type AdminActivityPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; onRetry: () => void }
  | { items: readonly AdminActivityItem[]; status: "ready" };

interface AdminActivityListProps {
  presentation: AdminActivityPresentation;
}

export function AdminActivityList({
  presentation,
}: AdminActivityListProps): ReactElement {
  return (
    <Card
      aria-busy={presentation.status === "loading" || undefined}
      className="min-h-48 p-6 shadow-none"
      data-slot="admin-activity-list"
    >
      <AdminActivityBody presentation={presentation} />
    </Card>
  );
}

interface AdminActivityBodyProps {
  presentation: AdminActivityPresentation;
}

function AdminActivityBody({
  presentation,
}: AdminActivityBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <div className="space-y-4" role="status">
        <p className="sr-only">{adminShellCopy.loadingLabel}</p>
        <Skeleton className="h-4 w-40 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 max-w-full" />
      </div>
    );
  }

  if (presentation.status === "error") {
    return (
      <AdminRetryState
        actionLabel={adminDashboardCopy.retryLabel}
        description={adminDashboardCopy.errorDescription}
        onRetry={presentation.onRetry}
        title={adminDashboardCopy.errorTitle}
      />
    );
  }

  if (presentation.status === "empty") {
    return (
      <AdminEmptyState
        description={adminDashboardCopy.activityEmptyDescription}
        icon={ActivityIcon}
        title={adminDashboardCopy.activityEmptyTitle}
      />
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {presentation.items.map((item) => (
        <li
          className="border-b border-border pb-4 last:border-b-0 last:pb-0"
          key={item.id}
        >
          <p className="text-body-small font-medium text-foreground">
            {item.title}
          </p>
          <p className="mt-1 text-body-small text-muted-foreground">
            {item.description}
          </p>
          {item.timestampLabel === undefined ? null : (
            <p className="mt-1 text-caption text-muted-foreground">
              {item.timestampLabel}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
