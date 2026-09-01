"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useSyncExternalStore } from "react";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import {
  cookieConsentCopy,
  LEGAL_PATHS,
  shouldOfferCookieConsent,
} from "@/config/legal";
import {
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/customer/cookie-consent";
import {
  subscribeNever,
  subscribeToCookieConsent,
} from "./cookie-consent-store";

export function CookieConsentBanner(): ReactElement | null {
  const pathname = useActivePathname();
  const isClient = useSyncExternalStore(
    subscribeNever,
    (): boolean => true,
    (): boolean => false,
  );
  const consent = useSyncExternalStore(
    subscribeToCookieConsent,
    readCookieConsent,
    (): null => null,
  );

  if (!isClient || !shouldOfferCookieConsent(pathname) || consent !== null) {
    return null;
  }

  return (
    <section
      aria-labelledby={cookieConsentCopy.headingId}
      className="fixed inset-x-0 bottom-0 z-overlay border-t border-border bg-background/95 px-gutter py-4 shadow-md backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-page flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2
            className="text-h4 tracking-tight"
            id={cookieConsentCopy.headingId}
          >
            {cookieConsentCopy.heading}
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            {cookieConsentCopy.description}{" "}
            <Link
              className="text-foreground underline hover:text-muted-foreground"
              href={LEGAL_PATHS.cookies}
            >
              {cookieConsentCopy.policyLabel}
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={(): void => {
              writeCookieConsent("rejected");
            }}
            type="button"
            variant="outline"
          >
            {cookieConsentCopy.rejectLabel}
          </Button>
          <Button
            onClick={(): void => {
              writeCookieConsent("accepted");
            }}
            type="button"
          >
            {cookieConsentCopy.acceptLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
