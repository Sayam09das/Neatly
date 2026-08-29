import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminCustomers } from "@/components/admin/customers/admin-customers";
import { adminCustomerCopy } from "@/config/admin-customers";

export const metadata: Metadata = {
  title: adminCustomerCopy.title,
};

export default function AdminCustomersPage(): ReactElement {
  return (
    <Suspense
      fallback={<AdminCustomers presentation={{ status: "loading" }} />}
    >
      <AdminCustomers />
    </Suspense>
  );
}
