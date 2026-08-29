import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { customerRequest } from "@/lib/customer/request";
import type { CustomerProfile } from "@/types/customer";

const profileSchema = z.object({
  address: z.string().nullable(),
  email: z.string().min(1),
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

const profilePayloadSchema = z.object({
  profile: profileSchema,
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

export type CustomerProfileLoadResult =
  | { ok: true; profile: CustomerProfile }
  | { ok: false; unauthorized: boolean };

export async function loadCustomerProfile(
  sessionToken: string | undefined,
): Promise<CustomerProfileLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.profile,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = profilePayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, profile: parsed.data.profile };
}

export async function updateCustomerProfile(
  payload: Record<string, unknown>,
): Promise<JsonApiResult<CustomerProfile>> {
  const result = await customerRequest<unknown>(CUSTOMER_API_PATHS.profile, {
    body: JSON.stringify(payload),
    method: "PATCH",
  });

  if (!result.ok) {
    return result;
  }

  const parsed = profilePayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return loadFailure;
  }

  return {
    data: parsed.data.profile,
    ok: true,
    status: result.status,
  };
}

async function requestCustomerJson(
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
      signal: AbortSignal.timeout(8_000),
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
