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

export function customerFirstName(name: string): string {
  const first = name
    .trim()
    .split(/\s+/)
    .find((part) => part !== "");
  return first ?? "";
}
