import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { ServicesLoading } from "@/components/admin/services/services-states";
import { adminServiceCopy } from "@/config/admin-services";

export default function AdminServicesLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminServiceCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminServiceCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <ServicesLoading />
      </Card>
    </div>
  );
}
