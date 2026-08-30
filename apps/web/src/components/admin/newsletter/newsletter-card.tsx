"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { NewsletterRowActions } from "@/components/admin/newsletter/newsletter-row-actions";
import { NewsletterStatusBadge } from "@/components/admin/newsletter/newsletter-status-badge";
import {
  adminNewsletterCopy,
  getAdminNewsletterDetailsPath,
} from "@/config/admin-newsletter";
import { formatNewsletterInstant } from "@/lib/admin/newsletter";
import type { AdminNewsletterSubscriber } from "@/types/admin-newsletter";

interface NewsletterCardProps {
  subscriber: AdminNewsletterSubscriber;
}

export function NewsletterCard({
  subscriber,
}: NewsletterCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="newsletter-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {subscriber.email}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <NewsletterStatusBadge status={subscriber.status} />
          <NewsletterRowActions subscriber={subscriber} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <NewsletterCardField
          label={adminNewsletterCopy.tableSubscribed}
          value={formatNewsletterInstant(subscriber.subscribedAt, {
            dateStyle: "medium",
          })}
        />
        <NewsletterCardField
          label={adminNewsletterCopy.tableUnsubscribed}
          value={formatNewsletterInstant(subscriber.unsubscribedAt, {
            dateStyle: "medium",
          })}
        />
      </dl>
      <Button asChild className="mt-4 w-full" variant="outline">
        <Link href={getAdminNewsletterDetailsPath(subscriber.id)}>
          {adminNewsletterCopy.viewAction}
        </Link>
      </Button>
    </motion.article>
  );
}

interface NewsletterCardFieldProps {
  label: string;
  value: string;
}

function NewsletterCardField({
  label,
  value,
}: NewsletterCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface NewsletterCardListProps {
  subscribers: readonly AdminNewsletterSubscriber[];
}

export function NewsletterCardList({
  subscribers,
}: NewsletterCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="newsletter-card-list"
    >
      {subscribers.map((subscriber) => (
        <NewsletterCard key={subscriber.id} subscriber={subscriber} />
      ))}
    </Card>
  );
}
