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

export function customerFirstName(name: string): string {
  const first = name
    .trim()
    .split(/\s+/)
    .find((part) => part !== "");
  return first ?? "";
}
