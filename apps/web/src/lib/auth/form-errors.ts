import { AUTH_FORM_BANNER_COPY } from "@/config/auth-ui";
import type { AuthFormBannerCode } from "@/types/auth-form";

interface SchemaIssueList {
  issues: ReadonlyArray<{
    message: string;
    path: ReadonlyArray<PropertyKey>;
  }>;
}

export function collectFieldErrors<T extends string>(
  error: SchemaIssueList,
  keys: readonly T[],
): Partial<Record<T, string>> {
  const allowed = new Set<string>(keys);
  const next: Partial<Record<T, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key !== "string" || !allowed.has(key)) {
      continue;
    }

    const field = key as T;

    if (next[field] === undefined) {
      next[field] = issue.message;
    }
  }

  return next;
}

export function authFormBannerMessage(code: AuthFormBannerCode): string {
  return AUTH_FORM_BANNER_COPY[code];
}
