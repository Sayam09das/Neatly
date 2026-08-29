"use client";

import { Button, Card } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { BellIcon } from "@/components/admin/admin-icons";
import { adminNotificationCopy } from "@/config/admin-notifications";
import {
  formatNotificationTime,
  getNotificationMessageLabel,
  getNotificationReadState,
  getNotificationTitleLabel,
  markAdminNotificationRead,
} from "@/lib/admin/notifications";
import { toast } from "@/lib/toast";
import type { AdminNotification } from "@/types/admin-notification";

interface NotificationItemProps {
  notification: AdminNotification;
  onMutated?: () => void;
}

export function NotificationItem({
  notification,
  onMutated,
}: NotificationItemProps): ReactElement {
  const readState = getNotificationReadState(notification.isRead);
  const isUnread = readState === "unread";
  const relatedHref = notification.relatedHref;
  const relatedLabel = notification.relatedLabel;
  const [submitting, setSubmitting] = useState(false);
  const canMarkRead = onMutated !== undefined && isUnread;

  async function handleMarkRead(): Promise<void> {
    if (!canMarkRead) {
      return;
    }

    setSubmitting(true);
    const result = await markAdminNotificationRead(notification.id);
    setSubmitting(false);

    if (!result.ok) {
      toast.error({ title: adminNotificationCopy.markReadError });
      return;
    }

    onMutated();
    toast.success({ title: adminNotificationCopy.markReadSuccess });
  }

  return (
    <motion.article
      className={cn(
        "flex gap-3 rounded-lg border border-border p-4",
        isUnread ? "bg-muted/60" : "bg-surface",
      )}
      data-read={readState ?? "unknown"}
      data-slot="notification-item"
      variants={fadeUp}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground"
      >
        <BellIcon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-body-small font-medium text-foreground">
              {getNotificationTitleLabel(notification.title)}
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              {formatNotificationTime(notification.createdAt)}
            </p>
          </div>
          <span className="shrink-0 text-caption font-medium text-foreground">
            {isUnread
              ? adminNotificationCopy.unreadLabel
              : readState === "read"
                ? adminNotificationCopy.readLabel
                : adminNotificationCopy.emptyValue}
          </span>
        </div>
        <p className="mt-2 text-body-small leading-relaxed text-muted-foreground">
          {getNotificationMessageLabel(notification.message)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            disabled={!canMarkRead || submitting}
            onClick={(): void => {
              void handleMarkRead();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {adminNotificationCopy.markReadAction}
          </Button>
          {relatedHref !== null &&
          relatedHref !== "" &&
          relatedLabel !== null &&
          relatedLabel !== "" ? (
            <Button asChild size="sm" variant="ghost">
              <Link href={relatedHref}>{relatedLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

interface NotificationsListProps {
  notifications: readonly AdminNotification[];
  onMutated?: () => void;
}

export function NotificationsList({
  notifications,
  onMutated,
}: NotificationsListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none"
      data-slot="notifications-list"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMutated={onMutated}
        />
      ))}
    </Card>
  );
}
