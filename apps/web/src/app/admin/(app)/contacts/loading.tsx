import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { ContactsLoading } from "@/components/admin/contacts/contacts-states";
import { adminContactCopy } from "@/config/admin-contacts";

export default function AdminContactsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminContactCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminContactCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <ContactsLoading />
      </Card>
    </div>
  );
}
