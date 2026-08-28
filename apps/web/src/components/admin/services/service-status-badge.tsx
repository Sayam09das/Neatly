"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import {
  adminServiceCopy,
  adminServiceStatusLabels,
} from "@/config/admin-services";
import { getServiceStatus } from "@/lib/admin/services";
import type { AdminServiceStatus } from "@/types/admin-service";

const statusBadgeClassName: Record<AdminServiceStatus, string> = {
  active: "border-transparent bg-secondary text-secondary-foreground",
  inactive: "border-border bg-background text-muted-foreground",
};

interface ServiceStatusBadgeProps {
  isActive: boolean | null;
}

export function ServiceStatusBadge({
  isActive,
}: ServiceStatusBadgeProps): ReactElement {
  const status = getServiceStatus(isActive);

  if (status === null) {
    return (
      <span data-slot="service-status-badge">
        {adminServiceCopy.emptyValue}
      </span>
    );
  }

  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="service-status-badge"
      variant="outline"
    >
      {adminServiceStatusLabels[status]}
    </Badge>
  );
}
