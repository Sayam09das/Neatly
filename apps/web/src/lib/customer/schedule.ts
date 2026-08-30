export function formatCustomerSchedule(iso: string | null): string | null {
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

export function splitUtcSchedule(iso: string | null): {
  scheduledDate: string;
  scheduledTime: string;
} {
  if (iso === null || iso === "") {
    return { scheduledDate: "", scheduledTime: "" };
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return { scheduledDate: "", scheduledTime: "" };
  }

  const stamp = date.toISOString();
  return {
    scheduledDate: stamp.slice(0, 10),
    scheduledTime: stamp.slice(11, 16),
  };
}

export function formatCustomerRelativeTime(iso: string): string | null {
  if (iso === "") {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diffMinutes = Math.round((date.getTime() - Date.now()) / 60_000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffDays) < 7) {
    return formatter.format(diffDays, "day");
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

export function customerFirstName(name: string): string {
  const first = name
    .trim()
    .split(/\s+/)
    .find((part) => part !== "");
  return first ?? "";
}
