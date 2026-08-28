import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminShellCopy } from "@/config/admin-ui";

export default function AdminLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="max-w-prose space-y-4"
      role="status"
    >
      <p className="sr-only">{adminShellCopy.loadingLabel}</p>
      <Skeleton className="h-8 w-48 max-w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
