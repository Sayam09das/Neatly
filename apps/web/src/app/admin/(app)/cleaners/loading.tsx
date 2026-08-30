import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { CleanersLoading } from "@/components/admin/cleaners/cleaners-states";
import { adminCleanerCopy } from "@/config/admin-cleaners";

export default function AdminCleanersLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminCleanerCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminCleanerCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <CleanersLoading />
      </Card>
    </div>
  );
}
