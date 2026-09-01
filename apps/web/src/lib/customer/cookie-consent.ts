import { z } from "@neatly/config/zod";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from "@/config/legal";

export const cookieConsentSchema = z.enum(["accepted", "rejected"]);

export type CookieConsentValue = z.infer<typeof cookieConsentSchema>;

function notifyCookieConsentChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGE_EVENT));
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  const parsed = cookieConsentSchema.safeParse(stored);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  notifyCookieConsentChange();
}

export function clearCookieConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  notifyCookieConsentChange();
}
