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

  try {
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGE_EVENT));
  } catch {
    // Ignore event dispatch failures in restricted contexts
  }
}

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = window.localStorage;
    if (typeof storage?.getItem !== "function") {
      return null;
    }

    const stored = storage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    const parsed = cookieConsentSchema.safeParse(stored);

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storage = window.localStorage;
    if (typeof storage?.setItem === "function") {
      storage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    }
  } catch {
    // Storage access may fail if third-party cookies or storage are restricted
  }

  notifyCookieConsentChange();
}

export function clearCookieConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storage = window.localStorage;
    if (typeof storage?.removeItem === "function") {
      storage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    }
  } catch {
    // Storage removal may fail if restricted
  }

  notifyCookieConsentChange();
}
