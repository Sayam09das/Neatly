import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import { CUSTOMER_API_PATHS, withCustomerApiId } from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { customerRequest } from "@/lib/customer/request";
import type { CustomerAccount } from "@/types/customer";

const accountSchema = z.object({
  email: z.string().min(1),
  emailVerified: z.boolean(),
  sessions: z.array(
    z.object({
      createdAt: z.string(),
      current: z.boolean(),
      expiresAt: z.string(),
      id: z.string().min(1),
    }),
  ),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

const accountPayloadSchema = z.object({
  account: accountSchema,
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

export type CustomerAccountLoadResult =
  | { account: CustomerAccount; ok: true }
  | { ok: false; unauthorized: boolean };

export async function loadCustomerAccount(
  sessionToken: string | undefined,
): Promise<CustomerAccountLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.account,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = accountPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { account: parsed.data.account, ok: true };
}

export async function changeCustomerPassword(payload: {
  currentPassword: string;
  password: string;
}): Promise<JsonApiResult<{ updated: boolean }>> {
  return customerRequest<{ updated: boolean }>(
    CUSTOMER_API_PATHS.accountPassword,
    {
      body: JSON.stringify(payload),
      method: "POST",
    },
  );
}

export async function resendCustomerVerification(): Promise<
  JsonApiResult<{ message: string }>
> {
  return customerRequest<{ message: string }>(
    CUSTOMER_API_PATHS.accountVerifyEmail,
    { method: "POST" },
  );
}

export async function revokeCustomerSession(
  id: string,
): Promise<JsonApiResult<{ revoked: boolean }>> {
  return customerRequest<{ revoked: boolean }>(
    withCustomerApiId(CUSTOMER_API_PATHS.accountSession, id),
    { method: "POST" },
  );
}

export async function logoutAllCustomerSessions(): Promise<
  JsonApiResult<{ signedOut: boolean }>
> {
  return customerRequest<{ signedOut: boolean }>(
    CUSTOMER_API_PATHS.accountLogoutAll,
    { method: "POST" },
  );
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
