"use client";

import { Button, Card } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ContactsIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { ContactStatusBadge } from "@/components/admin/contacts/contact-status-badge";
import { ContactsLoading } from "@/components/admin/contacts/contacts-states";
import { adminContactCopy } from "@/config/admin-contacts";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  formatContactInstant,
  getContactCustomerName,
  getContactIdLabel,
  getContactPhoneLabel,
  getContactSubjectLabel,
} from "@/lib/admin/contacts";
import type {
  AdminContact,
  AdminContactDetailsPresentation,
} from "@/types/admin-contact";

interface AdminContactDetailsProps {
  contactId: string;
  presentation?: AdminContactDetailsPresentation;
}

export function AdminContactDetails({
  contactId,
  presentation,
}: AdminContactDetailsProps): ReactElement {
  return (
    <ContactDetails
      contactId={contactId}
      presentation={presentation ?? { status: "empty" }}
    />
  );
}

interface ContactDetailsProps {
  contactId: string;
  presentation: AdminContactDetailsPresentation;
}

export function ContactDetails({
  contactId,
  presentation,
}: ContactDetailsProps): ReactElement {
  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-contact-details"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <p className="text-caption text-muted-foreground">
              {getContactIdLabel(contactId)}
            </p>
            <h1 className="mt-2 text-h1 text-foreground tracking-tight">
              {adminContactCopy.detailsHeading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminContactCopy.detailsDescription}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href={ADMIN_PATHS.contacts}>
                {adminContactCopy.backToContacts}
              </Link>
            </Button>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ContactDetailsBody presentation={presentation} />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface ContactDetailsBodyProps {
  presentation: AdminContactDetailsPresentation;
}

function ContactDetailsBody({
  presentation,
}: ContactDetailsBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <ContactsLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <AdminRetryState
          actionLabel={adminContactCopy.retryLabel}
          description={adminContactCopy.errorDescription}
          onRetry={presentation.onRetry}
          title={adminContactCopy.errorTitle}
        />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <AdminEmptyState
          description={adminContactCopy.detailsNotFoundDescription}
          icon={ContactsIcon}
          title={adminContactCopy.detailsNotFoundTitle}
        />
      </Card>
    );
  }

  return <ContactDetailsContent contact={presentation.contact} />;
}

interface ContactDetailsContentProps {
  contact: AdminContact;
}

function ContactDetailsContent({
  contact,
}: ContactDetailsContentProps): ReactElement {
  const notes =
    contact.adminNotes === null || contact.adminNotes.trim() === ""
      ? adminContactCopy.notesEmpty
      : contact.adminNotes;
  const showUpdated = contact.updatedAt !== contact.createdAt;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground tracking-tight">
              {getContactSubjectLabel(contact.subject)}
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              {getContactIdLabel(contact.id)}
            </p>
          </div>
          <ContactStatusBadge status={contact.status} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button disabled type="button" variant="outline">
            {adminContactCopy.markReadAction}
          </Button>
          <Button disabled type="button" variant="outline">
            {adminContactCopy.archiveAction}
          </Button>
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {adminContactCopy.markReadUnavailable}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminContactCopy.customerSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminContactCopy.customerNameLabel,
              value: getContactCustomerName(contact.fullName),
            },
            {
              label: adminContactCopy.customerEmailLabel,
              value: contact.email,
            },
            {
              label: adminContactCopy.customerPhoneLabel,
              value: getContactPhoneLabel(contact.phone),
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminContactCopy.messageSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminContactCopy.tableSubject,
              value: getContactSubjectLabel(contact.subject),
            },
            {
              label: adminContactCopy.tableMessage,
              value: contact.message,
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminContactCopy.notesSection}
        </h2>
        <p className="mt-4 text-body-small text-foreground">{notes}</p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminContactCopy.statusSection}
        </h2>
        <div className="mt-4">
          <ContactStatusBadge status={contact.status} />
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminContactCopy.timelineSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminContactCopy.timelineCreated,
              value: formatContactInstant(contact.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            ...(showUpdated
              ? [
                  {
                    label: adminContactCopy.timelineUpdated,
                    value: formatContactInstant(contact.updatedAt, {
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
