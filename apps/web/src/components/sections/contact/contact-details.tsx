import Link from "next/link";
import type { ReactElement } from "react";
import { contactDetailLabels, contactPageCopy } from "@/config/contact";
import {
  getPublishedContact,
  hasPublishedContact,
  type PublishedContact,
} from "@/config/landing";

export function ContactDetails(): ReactElement {
  const contact = getPublishedContact();

  return (
    <aside
      aria-labelledby={contactPageCopy.detailsHeadingId}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <h2
        className="text-h3 tracking-tight"
        id={contactPageCopy.detailsHeadingId}
      >
        {contactPageCopy.detailsHeading}
      </h2>
      {hasPublishedContact() ? (
        <ContactDefinitionList contact={contact} />
      ) : (
        <p className="mt-4 text-body-small text-muted-foreground">
          {contactPageCopy.unpublishedDetails}
        </p>
      )}
      <p className="mt-8 text-body-small text-muted-foreground">
        {contactPageCopy.quoteHint}
      </p>
      <p className="mt-2">
        <Link
          className="inline-flex min-h-touch items-center text-body-small font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={contactPageCopy.quoteCta.href}
        >
          {contactPageCopy.quoteCta.label}
        </Link>
      </p>
    </aside>
  );
}

interface ContactDefinitionListProps {
  contact: PublishedContact;
}

function ContactDefinitionList({
  contact,
}: ContactDefinitionListProps): ReactElement {
  return (
    <dl className="mt-6 flex flex-col gap-5">
      {contact.email === null ? null : (
        <div>
          <dt className="text-label text-muted-foreground uppercase">
            {contactDetailLabels.email}
          </dt>
          <dd className="mt-1">
            <a
              className="inline-flex min-h-touch items-center text-body-small underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </dd>
        </div>
      )}
      {contact.phone === null ? null : (
        <div>
          <dt className="text-label text-muted-foreground uppercase">
            {contactDetailLabels.phone}
          </dt>
          <dd className="mt-1">
            <a
              className="inline-flex min-h-touch items-center text-body-small underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={`tel:${contact.phone}`}
            >
              {contact.phone}
            </a>
          </dd>
        </div>
      )}
      {contact.hours === null ? null : (
        <div>
          <dt className="text-label text-muted-foreground uppercase">
            {contactDetailLabels.hours}
          </dt>
          <dd className="mt-1 text-body-small">{contact.hours}</dd>
        </div>
      )}
      {contact.address === null ? null : (
        <div>
          <dt className="text-label text-muted-foreground uppercase">
            {contactDetailLabels.address}
          </dt>
          <dd className="mt-1 max-w-xs text-body-small">{contact.address}</dd>
        </div>
      )}
    </dl>
  );
}
