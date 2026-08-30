"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { ContactRowActions } from "@/components/admin/contacts/contact-row-actions";
import { ContactStatusBadge } from "@/components/admin/contacts/contact-status-badge";
import { CustomerAvatar } from "@/components/admin/customers/customer-avatar";
import { adminContactCopy } from "@/config/admin-contacts";
import {
  formatContactInstant,
  getContactCustomerName,
  getContactIdLabel,
  getContactMessagePreview,
  getContactSubjectLabel,
} from "@/lib/admin/contacts";
import type { AdminContact } from "@/types/admin-contact";

interface ContactsDesktopTableProps {
  contacts: readonly AdminContact[];
}

export function ContactsDesktopTable({
  contacts,
}: ContactsDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminContactCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableCustomer}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableSubject}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableMessage}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableCreated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminContactCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <ContactTableRow contact={contact} key={contact.id} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface ContactTableRowProps {
  contact: AdminContact;
}

function ContactTableRow({ contact }: ContactTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="contact-table-row"
      variants={fade}
    >
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar name={contact.fullName} />
          <div className="min-w-0">
            <p className="truncate text-body-small text-foreground">
              {getContactCustomerName(contact.fullName)}
            </p>
            <p className="truncate text-caption text-muted-foreground">
              {contact.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        <p className="truncate">{getContactSubjectLabel(contact.subject)}</p>
        <p className="truncate text-caption text-muted-foreground">
          {getContactIdLabel(contact.id)}
        </p>
      </td>
      <td className="max-w-xs px-4 py-3 text-body-small text-foreground">
        <p className="truncate">{getContactMessagePreview(contact.message)}</p>
      </td>
      <td className="px-4 py-3">
        <ContactStatusBadge status={contact.status} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatContactInstant(contact.createdAt, { dateStyle: "medium" })}
      </td>
      <td className="px-4 py-3">
        <ContactRowActions contact={contact} />
      </td>
    </motion.tr>
  );
}
