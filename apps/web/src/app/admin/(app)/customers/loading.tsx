import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { CustomersLoading } from "@/components/admin/customers/customers-states";
import { adminCustomerCopy } from "@/config/admin-customers";

export default function AdminCustomersLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminCustomerCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminCustomerCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <CustomersLoading />
      </Card>
    </div>
  );
}
