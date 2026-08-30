"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { NewsletterRowActions } from "@/components/admin/newsletter/newsletter-row-actions";
import { NewsletterStatusBadge } from "@/components/admin/newsletter/newsletter-status-badge";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import { formatNewsletterInstant } from "@/lib/admin/newsletter";
import type { AdminNewsletterSubscriber } from "@/types/admin-newsletter";

interface NewsletterDesktopTableProps {
  subscribers: readonly AdminNewsletterSubscriber[];
}

export function NewsletterDesktopTable({
  subscribers,
}: NewsletterDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminNewsletterCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminNewsletterCopy.tableEmail}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminNewsletterCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminNewsletterCopy.tableSubscribed}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminNewsletterCopy.tableUnsubscribed}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminNewsletterCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <NewsletterTableRow key={subscriber.id} subscriber={subscriber} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface NewsletterTableRowProps {
  subscriber: AdminNewsletterSubscriber;
}

function NewsletterTableRow({
  subscriber,
}: NewsletterTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="newsletter-table-row"
      variants={fade}
    >
      <td className="px-4 py-3 text-body-small text-foreground">
        <p className="truncate">{subscriber.email}</p>
      </td>
      <td className="px-4 py-3">
        <NewsletterStatusBadge status={subscriber.status} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatNewsletterInstant(subscriber.subscribedAt, {
          dateStyle: "medium",
        })}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatNewsletterInstant(subscriber.unsubscribedAt, {
          dateStyle: "medium",
        })}
      </td>
      <td className="px-4 py-3">
        <NewsletterRowActions subscriber={subscriber} />
      </td>
    </motion.tr>
  );
}
