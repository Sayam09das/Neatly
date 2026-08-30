import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardSectionError } from "@/components/customer/dashboard/dashboard-section-error";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";
import type { CustomerDashboardSection } from "@/lib/customer/dashboard";
import { previewNotifications } from "@/lib/customer/dashboard";
import { formatCustomerRelativeTime } from "@/lib/customer/schedule";
import type { CustomerNotification } from "@/types/customer";

interface DashboardNotificationPreviewProps {
  notifications: CustomerDashboardSection<{
    items: readonly CustomerNotification[];
    unreadCount: number;
  }>;
}

export function DashboardNotificationPreview({
  notifications,
}: DashboardNotificationPreviewProps): ReactElement | null {
  if (notifications.status === "error") {
    return (
      <section className="min-w-0">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerDashboardCopy.notificationsHeading}
        </h2>
        <div className="mt-4">
          <DashboardSectionError
            message={customerDashboardCopy.notificationsError}
          />
        </div>
      </section>
    );
  }

  const items = previewNotifications(notifications.data.items);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerDashboardCopy.notificationsHeading}
        </h2>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.notifications}
        >
          {customerDashboardCopy.notificationsViewAll}
        </Link>
      </div>
      <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
        {items.map((item) => (
          <li className="p-4" key={item.id}>
            <p className="font-medium text-body text-foreground">
              {item.title}
            </p>
            <p className="mt-1 text-body-small text-muted-foreground">
              {formatCustomerRelativeTime(item.createdAt) ?? item.message}
            </p>
            {item.isRead ? null : (
              <p className="mt-2 text-caption text-foreground">
                {customerDashboardCopy.notificationsUnreadHint}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
