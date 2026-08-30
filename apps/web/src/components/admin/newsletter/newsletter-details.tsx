"use client";

import { Button, Card } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { NewsletterIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { NewsletterLoading } from "@/components/admin/newsletter/newsletter-states";
import { NewsletterStatusBadge } from "@/components/admin/newsletter/newsletter-status-badge";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import { formatNewsletterInstant } from "@/lib/admin/newsletter";
import type {
  AdminNewsletterDetailsPresentation,
  AdminNewsletterSubscriber,
} from "@/types/admin-newsletter";

interface AdminNewsletterDetailsProps {
  presentation?: AdminNewsletterDetailsPresentation;
  subscriberId: string;
}

export function AdminNewsletterDetails({
  presentation,
  subscriberId,
}: AdminNewsletterDetailsProps): ReactElement {
  return (
    <NewsletterDetails
      presentation={presentation ?? { status: "empty" }}
      subscriberId={subscriberId}
    />
  );
}

interface NewsletterDetailsProps {
  presentation: AdminNewsletterDetailsPresentation;
  subscriberId: string;
}

export function NewsletterDetails({
  presentation,
  subscriberId,
}: NewsletterDetailsProps): ReactElement {
  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-newsletter-details"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <p className="text-caption text-muted-foreground">{subscriberId}</p>
            <h1 className="mt-2 text-h1 text-foreground tracking-tight">
              {adminNewsletterCopy.detailsHeading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminNewsletterCopy.detailsDescription}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href={ADMIN_PATHS.newsletter}>
                {adminNewsletterCopy.backToNewsletter}
              </Link>
            </Button>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <NewsletterDetailsBody presentation={presentation} />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface NewsletterDetailsBodyProps {
  presentation: AdminNewsletterDetailsPresentation;
}

function NewsletterDetailsBody({
  presentation,
}: NewsletterDetailsBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <NewsletterLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <AdminRetryState
          actionLabel={adminNewsletterCopy.retryLabel}
          description={adminNewsletterCopy.errorDescription}
          onRetry={presentation.onRetry}
          title={adminNewsletterCopy.errorTitle}
        />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <AdminEmptyState
          description={adminNewsletterCopy.detailsNotFoundDescription}
          icon={NewsletterIcon}
          title={adminNewsletterCopy.detailsNotFoundTitle}
        />
      </Card>
    );
  }

  return <NewsletterDetailsContent subscriber={presentation.subscriber} />;
}

interface NewsletterDetailsContentProps {
  subscriber: AdminNewsletterSubscriber;
}

function NewsletterDetailsContent({
  subscriber,
}: NewsletterDetailsContentProps): ReactElement {
  const showUpdated = subscriber.updatedAt !== subscriber.createdAt;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground tracking-tight">
              {subscriber.email}
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              {subscriber.id}
            </p>
          </div>
          <NewsletterStatusBadge status={subscriber.status} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button disabled type="button" variant="outline">
            {adminNewsletterCopy.exportAction}
          </Button>
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {adminNewsletterCopy.exportUnavailable}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminNewsletterCopy.subscriberSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminNewsletterCopy.tableEmail,
              value: subscriber.email,
            },
            {
              label: adminNewsletterCopy.tableSubscribed,
              value: formatNewsletterInstant(subscriber.subscribedAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            {
              label: adminNewsletterCopy.tableUnsubscribed,
              value: formatNewsletterInstant(subscriber.unsubscribedAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminNewsletterCopy.statusSection}
        </h2>
        <div className="mt-4">
          <NewsletterStatusBadge status={subscriber.status} />
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminNewsletterCopy.timelineSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminNewsletterCopy.timelineCreated,
              value: formatNewsletterInstant(subscriber.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            ...(showUpdated
              ? [
                  {
                    label: adminNewsletterCopy.timelineUpdated,
                    value: formatNewsletterInstant(subscriber.updatedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}

interface DetailListProps {
  items: readonly { label: string; value: string }[];
}

function DetailList({ items }: DetailListProps): ReactElement {
  return (
    <dl className="mt-4 grid gap-3">
      {items.map((item) => (
        <div
          className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
          key={item.label}
        >
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="whitespace-pre-wrap text-body-small text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
