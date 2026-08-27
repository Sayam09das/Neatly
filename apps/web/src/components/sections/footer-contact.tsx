"use client";

import type { ReactElement } from "react";
import { getPublishedPhone, landingFooter } from "@/config/landing";
import { FooterLink } from "./footer-link";

export function FooterContact(): ReactElement {
  const publishedPhone = getPublishedPhone();
  const contact = landingFooter.placeholderContact;

  return (
    <div data-footer-column>
      <h3
        className="text-label text-secondary-foreground uppercase"
        id="footer-contact-heading"
      >
        {landingFooter.contactHeading}
      </h3>
      <dl className="mt-5 flex flex-col gap-5">
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
        <div>
          <dt className="text-caption text-secondary-foreground/50 uppercase">
            {landingFooter.phoneLabel}
          </dt>
          <dd className="mt-1">
            {publishedPhone === null ? (
              <p className="text-body-small text-secondary-foreground/60">
                {contact.phone}
              </p>
            ) : (
              <FooterLink href={`tel:${publishedPhone}`}>
                {publishedPhone}
              </FooterLink>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-secondary-foreground/50 uppercase">
            {landingFooter.hoursLabel}
          </dt>
          <dd className="mt-1 text-body-small text-secondary-foreground/80">
            {contact.hours}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-secondary-foreground/50 uppercase">
            {landingFooter.addressLabel}
          </dt>
          <dd className="mt-1 max-w-xs text-body-small text-secondary-foreground/80">
            {contact.address}
          </dd>
        </div>
      </dl>
    </div>
  );
}
