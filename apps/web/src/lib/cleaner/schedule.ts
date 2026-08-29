import { cleanerDashboardCopy } from "@/config/cleaner";
import { cleanerFirstName } from "@/lib/cleaner/identity";

export type CleanerGreetingPeriod = "morning" | "afternoon" | "evening";

export function formatCleanerSchedule(iso: string | null): string | null {
  if (iso === null || iso === "") {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function formatCleanerDateHeading(now: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    weekday: "long",
  }).format(now);
}

export function getCleanerGreetingPeriod(now: Date): CleanerGreetingPeriod {
  const hour = now.getUTCHours();

  if (hour < 12) {
    return "morning";
  }

  if (hour < 17) {
    return "afternoon";
  }

  return "evening";
}

export function toUtcDateParam(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function parseUtcDateParam(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function addUtcDays(value: Date, days: number): Date {
  return new Date(value.getTime() + days * 24 * 60 * 60 * 1000);
}

export function formatCleanerTime(iso: string | null): string | null {
  if (iso === null || iso === "") {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function formatCleanerDayHeading(isoDate: string): string {
  const parsed = parseUtcDateParam(isoDate);

  if (parsed === null) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    weekday: "long",
  }).format(parsed);
}

export function isUtcToday(isoDate: string, now: Date = new Date()): boolean {
  return isoDate === toUtcDateParam(now);
}

export function getCleanerGreeting(name: string, now: Date): string {
  const period = getCleanerGreetingPeriod(now);
  const firstName = cleanerFirstName(name);
  const named = {
    afternoon: cleanerDashboardCopy.greetingAfternoonNamed,
    evening: cleanerDashboardCopy.greetingEveningNamed,
    morning: cleanerDashboardCopy.greetingMorningNamed,
  }[period];
  const fallback = {
    afternoon: cleanerDashboardCopy.greetingAfternoon,
    evening: cleanerDashboardCopy.greetingEvening,
    morning: cleanerDashboardCopy.greetingMorning,
  }[period];

  if (firstName === "") {
    return fallback;
  }

  return named.replace("{name}", firstName);
}
