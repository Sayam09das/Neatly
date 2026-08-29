export interface CleanerNavbarIdentity {
  email: string | null;
  name: string;
}

export function cleanerFirstName(name: string): string {
  const first = name
    .trim()
    .split(/\s+/)
    .find((part) => part !== "");
  return first ?? "";
}

export function getCleanerInitials(identity: CleanerNavbarIdentity): string {
  const parts = identity.name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];

    if (first !== undefined && last !== undefined) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
  }

  if (parts[0] !== undefined && parts[0] !== "") {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const emailPrefix = identity.email?.trim().charAt(0);

  if (emailPrefix !== undefined && emailPrefix !== "") {
    return emailPrefix.toUpperCase();
  }

  return "N";
}
