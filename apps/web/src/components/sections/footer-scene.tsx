"use client";

import { APP_NAME } from "@neatly/config";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { BrandMark } from "@/components/layout/navbar/brand-link";
import {
  landingCtas,
  landingFooter,
  landingNavLinks,
  landingServices,
} from "@/config/landing";
import { FooterContact } from "./footer-contact";
import { FooterLink } from "./footer-link";
import { useFooterAnimation } from "./use-footer-animation";

export function FooterScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useFooterAnimation({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-footer-brand>
          <Link
            aria-label={`${APP_NAME} home`}
            className="inline-flex items-center gap-2 rounded-sm text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            href="/"
          >
            <BrandMark />
            <span className="text-h4 tracking-tight">{APP_NAME}</span>
          </Link>
          <h2 className="sr-only" id={landingFooter.headingId}>
            {APP_NAME}
          </h2>
          <p className="mt-5 max-w-sm text-body-small text-secondary-foreground/70">
            {landingFooter.tagline}
          </p>
          <p className="mt-4 max-w-sm text-caption text-secondary-foreground/50">
            {landingFooter.socialPending}
          </p>
          <p className="mt-6 text-body-small text-secondary-foreground/70">
            {landingFooter.quoteHint}
          </p>
          <p className="mt-2">
            <FooterLink href={landingCtas.primary.href}>
              {landingCtas.primary.label}
            </FooterLink>
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
          <nav aria-labelledby="footer-nav-heading" data-footer-column>
            <h3
              className="text-label text-secondary-foreground uppercase"
              id="footer-nav-heading"
            >
              {landingFooter.exploreHeading}
            </h3>
            <ul className="mt-5 flex flex-col gap-1">
              {landingNavLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-services-heading" data-footer-column>
            <h3
              className="text-label text-secondary-foreground uppercase"
              id="footer-services-heading"
            >
              {landingFooter.servicesHeading}
            </h3>
            <ul className="mt-5 flex flex-col gap-1">
              {landingServices.items.map((service) => (
                <li key={service.title}>
                  <FooterLink href={service.href}>{service.title}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <FooterContact />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-16 h-px origin-left bg-secondary-foreground/15"
        data-footer-rule
      />
      <div
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-footer-bar
      >
        <p className="text-caption text-secondary-foreground/50">
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
                  className="inline-flex min-h-touch items-center text-caption text-secondary-foreground/50 transition-colors duration-normal ease-standard hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
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
