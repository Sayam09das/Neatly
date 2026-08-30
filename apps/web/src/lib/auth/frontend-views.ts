import type { ResetLinkView, VerifyEmailView } from "@/types/auth-form";

const RESET_LINK_VIEWS: ReadonlySet<string> = new Set(["invalid", "expired"]);
const VERIFY_EMAIL_VIEWS: ReadonlySet<string> = new Set([
  "already-verified",
  "expired",
  "invalid",
  "verified",
]);

export function readSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function parseResetLinkView(
  value: string | undefined,
): ResetLinkView | null {
  if (value === undefined || !RESET_LINK_VIEWS.has(value)) {
    return null;
  }

  return value as ResetLinkView;
}

export function parseVerifyEmailView(
  value: string | undefined,
): Exclude<VerifyEmailView, "idle"> | null {
  if (value === undefined || !VERIFY_EMAIL_VIEWS.has(value)) {
    return null;
  }

  return value as Exclude<VerifyEmailView, "idle">;
}

export function withSearchParams(
  pathname: string,
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    const next = readSearchParam(
      typeof value === "string" ? value : value?.[0],
    );

    if (next !== undefined) {
      params.set(key, next);
    }
  }

  const query = params.toString();
  return query === "" ? pathname : `${pathname}?${query}`;
}
