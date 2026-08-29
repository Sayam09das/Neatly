import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { cleanerJobStatusLabels } from "@/config/cleaner";
import type { CleanerJobStatus } from "@/types/cleaner";

interface CleanerJobStatusBadgeProps {
  status: CleanerJobStatus;
}

export function CleanerJobStatusBadge({
  status,
}: CleanerJobStatusBadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-caption font-medium",
        status === "CANCELLED"
          ? "bg-muted text-muted-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {cleanerJobStatusLabels[status]}
    </span>
  );
}
