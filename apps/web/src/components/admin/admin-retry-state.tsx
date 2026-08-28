"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";

interface AdminRetryStateProps {
  actionLabel: string;
  description: string;
  onRetry: () => void;
  title: string;
}

export function AdminRetryState({
  actionLabel,
  description,
  onRetry,
  title,
}: AdminRetryStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-3"
      data-slot="admin-retry-state"
      role="alert"
    >
      <div className="max-w-prose">
        <p className="text-body-small font-medium text-foreground">{title}</p>
        <p className="mt-1 text-body-small text-muted-foreground">
          {description}
        </p>
      </div>
      <Button onClick={onRetry} type="button" variant="outline">
        {actionLabel}
      </Button>
    </div>
  );
}
