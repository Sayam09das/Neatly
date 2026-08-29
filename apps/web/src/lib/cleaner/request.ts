import {
  CLEANER_API_PREFIX,
  FORBIDDEN_CLEANER_AUTH_QUERY_KEYS,
} from "@/config/cleaner";
import type { JsonApiResult } from "@/lib/api/envelope";
import { sameOriginJsonRequest } from "@/lib/api/envelope";

export type CleanerApiResult<T> = JsonApiResult<T>;

export class CleanerRequestError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CleanerRequestError";
  }
}

export function assertCleanerRequestPath(path: string): void {
  const url = new URL(path, "https://neatly.invalid");

  if (!url.pathname.startsWith(CLEANER_API_PREFIX)) {
    throw new CleanerRequestError(
      "Cleaner requests must use the cleaner API prefix.",
    );
  }

  if (url.pathname.includes("/admin") || url.pathname.includes("/customer")) {
    throw new CleanerRequestError(
      "Cleaner requests must not use admin or customer APIs.",
    );
  }

  for (const key of FORBIDDEN_CLEANER_AUTH_QUERY_KEYS) {
    if (url.searchParams.has(key)) {
      throw new CleanerRequestError(
        "Cleaner identity must come from the session, not the request URL.",
      );
    }
  }
}

export async function cleanerRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<CleanerApiResult<T>> {
  assertCleanerRequestPath(path);
  return sameOriginJsonRequest<T>(path, init);
}
