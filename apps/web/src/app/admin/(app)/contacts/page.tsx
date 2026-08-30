import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminContacts } from "@/components/admin/contacts/admin-contacts";
import { adminContactCopy } from "@/config/admin-contacts";

export const metadata: Metadata = {
  title: adminContactCopy.title,
};

export default function AdminContactsPage(): ReactElement {
  return (
    <Suspense fallback={<AdminContacts presentation={{ status: "loading" }} />}>
      <AdminContacts />
    </Suspense>
  );
}
