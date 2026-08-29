import { loadServerEnv } from "@neatly/config/server";
import { z } from "@neatly/config/zod";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import type { CustomerHelpWorkspace } from "@/types/customer";

const helpTopicSchema = z.object({
  faqs: z.array(
    z.object({
      answer: z.string().min(1),
      question: z.string().min(1),
    }),
  ),
  name: z.string().min(1),
  slug: z.string().min(1),
});

const helpPayloadSchema = z.object({
  topics: z.array(helpTopicSchema),
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

export type CustomerHelpLoadResult =
  | { ok: true; workspace: CustomerHelpWorkspace }
  | { ok: false; unauthorized: boolean };

export async function loadCustomerHelp(
  sessionToken: string | undefined,
): Promise<CustomerHelpLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.help,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = helpPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, workspace: { topics: parsed.data.topics } };
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
