import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminNotifications } from "@/components/admin/notifications/admin-notifications";
import { adminNotificationCopy } from "@/config/admin-notifications";

export const metadata: Metadata = {
  title: adminNotificationCopy.title,
};

export default function AdminNotificationsPage(): ReactElement {
  return <AdminNotifications presentation={{ status: "empty" }} />;
}
