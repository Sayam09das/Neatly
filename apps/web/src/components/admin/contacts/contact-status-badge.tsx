"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminContactStatusLabels } from "@/config/admin-contacts";
import type { AdminContactStatus } from "@/types/admin-contact";

const statusBadgeClassName: Record<AdminContactStatus, string> = {
  ARCHIVED: "border-border bg-background text-muted-foreground",
  NEW: "border-border bg-background text-foreground",
  READ: "border-border bg-muted text-foreground",
  RESPONDED: "border-transparent bg-secondary text-secondary-foreground",
};

interface ContactStatusBadgeProps {
  status: AdminContactStatus;
}

export function ContactStatusBadge({
  status,
}: ContactStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="contact-status-badge"
      variant="outline"
    >
      {adminContactStatusLabels[status]}
    </Badge>
  );
}
