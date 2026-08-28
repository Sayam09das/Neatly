import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminShellCopy } from "@/config/admin-ui";

export default function AdminLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full min-w-0 max-w-page space-y-10"
      role="status"
    >
      <p className="sr-only">{adminShellCopy.loadingLabel}</p>
      <div className="max-w-prose space-y-3">
        <Skeleton className="h-8 w-48 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
