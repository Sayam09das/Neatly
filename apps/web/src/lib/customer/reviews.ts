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
import type { CustomerReview, CustomerReviewWorkspace } from "@/types/customer";

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.string(),
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  serviceName: z.string().nullable(),
  status: z.enum(["pending", "published"]),
});

const workspaceSchema = z.object({
  eligibleBookings: z.array(
    z.object({
      id: z.string().min(1),
      scheduledAt: z.string().nullable(),
      service: z
        .object({
          id: z.string().min(1),
          name: z.string().min(1),
        })
        .nullable(),
      status: z.literal("COMPLETED"),
    }),
  ),
  reviews: z.array(reviewSchema),
});

const reviewPayloadSchema = z.object({
  review: reviewSchema,
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

export type CustomerReviewsLoadResult =
  | { ok: true; workspace: CustomerReviewWorkspace }
  | { ok: false; unauthorized: boolean };

export async function loadCustomerReviews(
  sessionToken: string | undefined,
): Promise<CustomerReviewsLoadResult> {
  const result = await requestCustomerJson(
    CUSTOMER_API_PATHS.reviews,
    sessionToken,
  );

  if (!result.ok) {
    return { ok: false, unauthorized: result.unauthorized };
  }

  const parsed = workspaceSchema.safeParse(result.data);

  if (!parsed.success) {
    return { ok: false, unauthorized: false };
  }

  return { ok: true, workspace: parsed.data };
}

export async function createCustomerReview(payload: {
  bookingId: string;
  content: string;
  rating: number;
}): Promise<JsonApiResult<CustomerReview>> {
  const result = await customerRequest<unknown>(CUSTOMER_API_PATHS.reviews, {
    body: JSON.stringify(payload),
    method: "POST",
  });

  return parseReviewResult(result);
}

export async function updateCustomerReview(
  id: string,
  payload: { content?: string; rating?: number },
): Promise<JsonApiResult<CustomerReview>> {
  const result = await customerRequest<unknown>(
    withCustomerApiId(CUSTOMER_API_PATHS.review, id),
    {
      body: JSON.stringify(payload),
      method: "PATCH",
    },
  );

  return parseReviewResult(result);
}

export async function deleteCustomerReview(
  id: string,
): Promise<JsonApiResult<CustomerReview>> {
  const result = await customerRequest<unknown>(
    withCustomerApiId(CUSTOMER_API_PATHS.reviewDelete, id),
    { method: "POST" },
  );

  return parseReviewResult(result);
}

function parseReviewResult(
  result: JsonApiResult<unknown>,
): JsonApiResult<CustomerReview> {
  if (!result.ok) {
    return result;
  }

  const parsed = reviewPayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return loadFailure;
  }

  return {
    data: parsed.data.review,
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
