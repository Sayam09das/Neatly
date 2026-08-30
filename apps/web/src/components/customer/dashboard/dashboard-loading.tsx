import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { customerShellCopy } from "@/config/customer";

export function DashboardLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex w-full min-w-0 flex-col gap-10"
      role="status"
    >
      <p className="sr-only">{customerShellCopy.loadingLabel}</p>
      <div className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-10 w-64 max-w-full" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-11 w-40 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
