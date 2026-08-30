import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminDashboardLive } from "@/components/admin/admin-dashboard-live";
import { adminHomeCopy } from "@/config/admin-ui";

export const metadata: Metadata = {
  title: adminHomeCopy.title,
};

export default function AdminDashboardPage(): ReactElement {
  return <AdminDashboardLive />;
}
