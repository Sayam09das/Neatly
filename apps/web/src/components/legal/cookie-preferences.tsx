"use client";

import { Button } from "@neatly/ui";
import { type ReactElement, useSyncExternalStore } from "react";
import { cookiePreferencesCopy } from "@/config/legal";
import {
  clearCookieConsent,
  readCookieConsent,
} from "@/lib/customer/cookie-consent";
import {
  subscribeNever,
  subscribeToCookieConsent,
} from "./cookie-consent-store";

export function CookiePreferences(): ReactElement | null {
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

  if (!isClient) {
    return null;
  }

  const statusCopy =
    consent === "accepted"
      ? cookiePreferencesCopy.accepted
      : consent === "rejected"
        ? cookiePreferencesCopy.rejected
        : cookiePreferencesCopy.unset;

  return (
    <section
      aria-labelledby={cookiePreferencesCopy.headingId}
      className="mt-12 max-w-content rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <h2
        className="text-h3 tracking-tight"
        id={cookiePreferencesCopy.headingId}
      >
        {cookiePreferencesCopy.heading}
      </h2>
      <p className="mt-3 text-body text-muted-foreground">{statusCopy}</p>
      <div className="mt-6">
        <Button onClick={clearCookieConsent} type="button" variant="outline">
          {cookiePreferencesCopy.changeLabel}
        </Button>
      </div>
    </section>
  );
}
