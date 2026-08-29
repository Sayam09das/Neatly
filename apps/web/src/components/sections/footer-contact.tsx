import type { ReactElement } from "react";
import { getPublishedContact, landingFooter } from "@/config/landing";
import { FooterLink } from "./footer-link";

export function FooterContact(): ReactElement | null {
  const contact = getPublishedContact();

  if (
    contact.address === null &&
    contact.email === null &&
    contact.hours === null &&
    contact.phone === null
  ) {
    return null;
  }

  return (
    <div data-footer-column>
      <h3
        className="text-label text-secondary-foreground uppercase"
        id="footer-contact-heading"
      >
        {landingFooter.contactHeading}
      </h3>
      <dl className="mt-5 flex flex-col gap-5">
        {contact.email === null ? null : (
          <div>
            <dt className="text-caption text-secondary-foreground/50 uppercase">
              {landingFooter.emailLabel}
            </dt>
            <dd className="mt-1">
              <FooterLink href={`mailto:${contact.email}`}>
                {contact.email}
              </FooterLink>
            </dd>
          </div>
        )}
        {contact.phone === null ? null : (
          <div>
            <dt className="text-caption text-secondary-foreground/50 uppercase">
              {landingFooter.phoneLabel}
            </dt>
            <dd className="mt-1">
              <FooterLink href={`tel:${contact.phone}`}>
                {contact.phone}
              </FooterLink>
            </dd>
          </div>
        )}
        {contact.hours === null ? null : (
          <div>
            <dt className="text-caption text-secondary-foreground/50 uppercase">
              {landingFooter.hoursLabel}
            </dt>
            <dd className="mt-1 text-body-small text-secondary-foreground/80">
              {contact.hours}
            </dd>
          </div>
        )}
        {contact.address === null ? null : (
          <div>
            <dt className="text-caption text-secondary-foreground/50 uppercase">
              {landingFooter.addressLabel}
            </dt>
            <dd className="mt-1 max-w-xs text-body-small text-secondary-foreground/80">
              {contact.address}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
