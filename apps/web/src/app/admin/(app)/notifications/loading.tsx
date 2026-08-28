import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { NotificationsLoading } from "@/components/admin/notifications/notifications-states";
import { adminNotificationCopy } from "@/config/admin-notifications";

export default function AdminNotificationsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminNotificationCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminNotificationCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <NotificationsLoading />
      </Card>
    </div>
  );
}
