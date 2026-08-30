import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { NewsletterLoading } from "@/components/admin/newsletter/newsletter-states";
import { adminNewsletterCopy } from "@/config/admin-newsletter";

export default function AdminNewsletterDetailsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminNewsletterCopy.detailsHeading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminNewsletterCopy.detailsDescription}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <NewsletterLoading />
      </Card>
    </div>
  );
}
