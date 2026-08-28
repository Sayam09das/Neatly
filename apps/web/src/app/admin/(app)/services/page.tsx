import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminServices } from "@/components/admin/services/admin-services";
import { adminServiceCopy } from "@/config/admin-services";

export const metadata: Metadata = {
  title: adminServiceCopy.title,
};

export default function AdminServicesPage(): ReactElement {
  return <AdminServices presentation={{ status: "empty" }} />;
}
