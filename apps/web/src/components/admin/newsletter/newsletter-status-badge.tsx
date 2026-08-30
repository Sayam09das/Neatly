"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminNewsletterStatusLabels } from "@/config/admin-newsletter";
import type { AdminNewsletterStatus } from "@/types/admin-newsletter";

const statusBadgeClassName: Record<AdminNewsletterStatus, string> = {
  SUBSCRIBED: "border-transparent bg-secondary text-secondary-foreground",
  UNSUBSCRIBED: "border-border bg-background text-muted-foreground",
};

interface NewsletterStatusBadgeProps {
  status: AdminNewsletterStatus;
}

export function NewsletterStatusBadge({
  status,
}: NewsletterStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="newsletter-status-badge"
      variant="outline"
    >
      {adminNewsletterStatusLabels[status]}
    </Badge>
  );
}
