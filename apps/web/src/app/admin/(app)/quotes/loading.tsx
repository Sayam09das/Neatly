import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { QuotesLoading } from "@/components/admin/quotes/quotes-states";
import { adminQuoteCopy } from "@/config/admin-quotes";

export default function AdminQuotesLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminQuoteCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminQuoteCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <QuotesLoading />
      </Card>
    </div>
  );
}
