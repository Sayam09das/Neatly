"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import {
  adminReviewCopy,
  adminReviewStatusLabels,
} from "@/config/admin-reviews";
import { getReviewStatus } from "@/lib/admin/reviews";
import type { AdminReviewStatus } from "@/types/admin-review";

const statusBadgeClassName: Record<AdminReviewStatus, string> = {
  active: "border-transparent bg-secondary text-secondary-foreground",
  inactive: "border-border bg-background text-muted-foreground",
};

interface ReviewStatusBadgeProps {
  isActive: boolean | null;
}

export function ReviewStatusBadge({
  isActive,
}: ReviewStatusBadgeProps): ReactElement {
  const status = getReviewStatus(isActive);

  if (status === null) {
    return (
      <span data-slot="review-status-badge">{adminReviewCopy.emptyValue}</span>
    );
  }

  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="review-status-badge"
      variant="outline"
    >
      {adminReviewStatusLabels[status]}
    </Badge>
  );
}
