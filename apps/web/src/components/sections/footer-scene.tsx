"use client";

import { APP_NAME } from "@neatly/config";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import {
  getPublishedPhone,
  landingFooter,
  landingNavLinks,
  landingServices,
} from "@/config/landing";

export function FooterScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const publishedPhone = getPublishedPhone();

  useSectionReveal({ rootRef });

  return (
    <div ref={rootRef}>
      <div className="mx-auto grid max-w-page gap-grid px-gutter py-section md:grid-cols-2 lg:grid-cols-4">
        <div data-reveal>
          <h2
            className="text-h4 text-foreground tracking-tight"
            id={landingFooter.headingId}
          >
            {APP_NAME}
          </h2>
          <p className="mt-4 max-w-sm text-body-small text-muted-foreground">
            {landingFooter.tagline}
          </p>
        </div>
        <nav aria-labelledby="footer-nav-heading" data-reveal>
          <h3
            className="text-label text-foreground uppercase"
            id="footer-nav-heading"
          >
            {landingFooter.exploreHeading}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {landingNavLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-touch items-center text-body-small text-foreground transition-colors duration-normal ease-standard hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-services-heading" data-reveal>
          <h3
            className="text-label text-foreground uppercase"
            id="footer-services-heading"
          >
            {landingFooter.servicesHeading}
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {landingServices.items.map((service) => (
              <li key={service.title}>
                <Link
                  className="inline-flex min-h-touch items-center text-body-small text-foreground transition-colors duration-normal ease-standard hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={service.href}
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div data-reveal>
          <h3
            className="text-label text-foreground uppercase"
            id="footer-contact-heading"
          >
            {landingFooter.contactHeading}
          </h3>
          <ul
            aria-labelledby="footer-contact-heading"
            className="mt-4 flex flex-col gap-2"
          >
            <li>
              <a
                className="inline-flex min-h-touch items-center text-body-small text-foreground transition-colors duration-normal ease-standard hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                href={`mailto:${landingFooter.placeholderContact.email}`}
              >
                {landingFooter.placeholderContact.email}
              </a>
            </li>
            <li>
              {publishedPhone === null ? (
                <p className="text-body-small text-muted-foreground">
                  {landingFooter.placeholderContact.phone}
                </p>
              ) : (
                <a
                  className="inline-flex min-h-touch items-center text-body-small text-foreground transition-colors duration-normal ease-standard hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`tel:${publishedPhone}`}
                >
                  {publishedPhone}
                </a>
              )}
            </li>
            <li>
              <p className="text-body-small text-muted-foreground">
                {landingFooter.placeholderContact.hours}
              </p>
            </li>
            <li>
              <p className="text-body-small text-muted-foreground">
                {landingFooter.placeholderContact.address}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="mx-auto flex max-w-page flex-col gap-4 px-gutter pb-8 sm:flex-row sm:items-center sm:justify-between"
        data-reveal
      >
        <p className="text-caption text-muted-foreground">
          {landingFooter.copyright}
        </p>
        <nav aria-labelledby="footer-legal-heading">
          <h3 className="sr-only" id="footer-legal-heading">
            {landingFooter.legalHeading}
          </h3>
          <ul className="flex flex-wrap gap-4">
            {landingFooter.legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-touch items-center text-caption text-muted-foreground transition-colors duration-normal ease-standard hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
