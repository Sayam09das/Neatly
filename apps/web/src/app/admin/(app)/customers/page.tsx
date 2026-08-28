import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminCustomers } from "@/components/admin/customers/admin-customers";
import { adminCustomerCopy } from "@/config/admin-customers";

export const metadata: Metadata = {
  title: adminCustomerCopy.title,
};

export default function AdminCustomersPage(): ReactElement {
  return <AdminCustomers presentation={{ status: "empty" }} />;
}
