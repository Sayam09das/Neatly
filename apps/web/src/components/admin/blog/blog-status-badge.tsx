"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminBlogStatusLabels } from "@/config/admin-blog";
import type { AdminBlogStatus } from "@/types/admin-blog";

const statusBadgeClassName: Record<AdminBlogStatus, string> = {
  ARCHIVED: "border-border bg-background text-muted-foreground",
  DRAFT: "border-border bg-muted text-foreground",
  PUBLISHED: "border-transparent bg-secondary text-secondary-foreground",
};

interface BlogStatusBadgeProps {
  status: AdminBlogStatus;
}

export function BlogStatusBadge({
  status,
}: BlogStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="blog-status-badge"
      variant="outline"
    >
      {adminBlogStatusLabels[status]}
    </Badge>
  );
}
