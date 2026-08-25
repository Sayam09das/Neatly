import { APP_NAME } from "@neatly/config";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingFooter, landingNavLinks } from "@/config/landing";

export function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-page gap-grid px-gutter py-section md:grid-cols-3">
        <div>
          <h2 className="text-h4 text-foreground" id={landingFooter.headingId}>
            {APP_NAME}
          </h2>
          <p className="mt-4 text-body-small text-muted-foreground">
            {landingFooter.placeholderContact.address}
          </p>
          <p className="mt-2 text-body-small text-muted-foreground">
            {landingFooter.placeholderContact.phone}
          </p>
          <p className="mt-2 text-body-small text-muted-foreground">
            {landingFooter.placeholderContact.email}
          </p>
          <p className="mt-2 text-body-small text-muted-foreground">
            {landingFooter.placeholderContact.hours}
          </p>
        </div>
        <nav aria-labelledby="footer-nav-heading">
          <h3 className="text-label text-foreground" id="footer-nav-heading">
            Explore
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {landingNavLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-touch items-center text-body-small text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-legal-heading">
          <h3 className="text-label text-foreground" id="footer-legal-heading">
            Legal
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {landingFooter.legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-touch items-center text-body-small text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-page px-gutter pb-8 text-caption text-muted-foreground">
        {landingFooter.copyright}
      </p>
    </footer>
  );
}
