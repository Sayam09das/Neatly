export function maskEmail(email: string): string | null {
  const trimmed = email.trim();
  const separator = trimmed.lastIndexOf("@");

  if (separator <= 0 || separator === trimmed.length - 1) {
    return null;
  }

  const local = trimmed.slice(0, separator);
  const domain = trimmed.slice(separator + 1);

  if (local.length === 0 || domain.includes("@") || !domain.includes(".")) {
    return null;
  }

  return `${local.slice(0, 1)}***@${domain}`;
}

export function getRemainingCooldownSeconds(
  nowMs: number,
  untilMs: number,
): number {
  return Math.max(0, Math.ceil((untilMs - nowMs) / 1000));
}
