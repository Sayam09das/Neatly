import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { adminHomeCopy } from "@/config/admin-ui";

export const metadata: Metadata = {
  title: adminHomeCopy.title,
};

export default function AdminHomePage(): ReactElement {
  return <AdminDashboard />;
}
