import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import {
  CLEANER_API_PATHS,
  CLEANER_SESSION_REQUEST_TIMEOUT_MS,
} from "@/config/cleaner";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { signOutCustomer } from "@/lib/customer/session";
import type { CleanerProfile } from "@/types/cleaner";

export async function signOutCleaner(): Promise<void> {
  await signOutCustomer();
}

const cleanerProfileSchema = z.object({
  email: z.string().nullable(),
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

const cleanerSessionPayloadSchema = z.object({
  profile: cleanerProfileSchema,
});

const loadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false,
  status: 0,
  unauthorized: false,
};

export type CleanerSessionLoadResult =
  | { ok: true; profile: CleanerProfile }
  | { forbidden: boolean; ok: false; unauthorized: boolean };

export async function loadCleanerSession(
  sessionToken: string | undefined,
): Promise<CleanerSessionLoadResult> {
  const result = await requestCleanerJson(CLEANER_API_PATHS.me, sessionToken);

  if (!result.ok) {
    return {
      forbidden: result.forbidden,
      ok: false,
      unauthorized: result.unauthorized,
    };
  }

  const parsed = cleanerSessionPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { forbidden: false, ok: false, unauthorized: false };
  }

  return { ok: true, profile: parsed.data.profile };
}

async function requestCleanerJson(
  path: string,
  sessionToken: string | undefined,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;

  try {
    const headers = new Headers({ accept: "application/json" });

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const response = await fetch(new URL(path, `${origin}/`), {
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(CLEANER_SESSION_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return loadFailure;
  }
}
