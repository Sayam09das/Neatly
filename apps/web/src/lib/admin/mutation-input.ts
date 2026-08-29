export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function collectZodFieldErrors(
  issues: readonly { message: string; path: readonly PropertyKey[] }[],
): Record<string, string> {
  const next: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path[0];

    if (typeof key === "string" && next[key] === undefined) {
      next[key] = issue.message;
    }
  }

  return next;
}
