"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { ContactRowActions } from "@/components/admin/contacts/contact-row-actions";
import { ContactStatusBadge } from "@/components/admin/contacts/contact-status-badge";
import { CustomerAvatar } from "@/components/admin/customers/customer-avatar";
import {
  adminContactCopy,
  getAdminContactDetailsPath,
} from "@/config/admin-contacts";
import {
  formatContactInstant,
  getContactCustomerName,
  getContactSubjectLabel,
} from "@/lib/admin/contacts";
import type { AdminContact } from "@/types/admin-contact";

interface ContactCardProps {
  contact: AdminContact;
}

export function ContactCard({ contact }: ContactCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="contact-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CustomerAvatar name={contact.fullName} />
          <div className="min-w-0">
            <p className="truncate text-body-small font-medium text-foreground">
              {getContactCustomerName(contact.fullName)}
            </p>
            <p className="mt-1 truncate text-caption text-muted-foreground">
              {contact.email}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ContactStatusBadge status={contact.status} />
          <ContactRowActions contact={contact} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <ContactCardField
          label={adminContactCopy.tableSubject}
          value={getContactSubjectLabel(contact.subject)}
        />
        <ContactCardField
          label={adminContactCopy.tableCreated}
          value={formatContactInstant(contact.createdAt, {
            dateStyle: "medium",
          })}
        />
      </dl>
      <Button asChild className="mt-4 w-full" variant="outline">
        <Link href={getAdminContactDetailsPath(contact.id)}>
          {adminContactCopy.viewAction}
        </Link>
      </Button>
    </motion.article>
  );
}

interface ContactCardFieldProps {
  label: string;
  value: string;
}

function ContactCardField({
  label,
  value,
}: ContactCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface ContactCardListProps {
  contacts: readonly AdminContact[];
}

export function ContactCardList({
  contacts,
}: ContactCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="contact-card-list"
    >
      {contacts.map((contact) => (
        <ContactCard contact={contact} key={contact.id} />
      ))}
    </Card>
  );
}
