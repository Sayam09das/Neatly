import { loadServerEnv } from "@neatly/config/server";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_TESTIMONIALS_REQUEST_TIMEOUT_MS,
} from "@/config/customer";
import {
  type LandingTestimonial,
  type LandingTestimonialCategory,
  landingTestimonialCategoryLabels,
  landingTestimonials,
} from "@/config/landing";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import {
  type PublicReviewPayload,
  publicReviewListSchema,
  publicReviewSchema,
} from "@/lib/validations/public-reviews.schema";

export type PublicReviewsLoadResult =
  | { items: LandingTestimonial[]; ok: true }
  | { items: []; ok: false };

const publicReviewsLoadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: landingTestimonials.errorMessage,
  ok: false,
  status: 0,
  unauthorized: false,
};

export function getPublicReviewRatingLabel(rating: number): string {
  return `${String(rating)} out of 5 stars`;
}

export function getPublicReviewCategoryLabel(
  category: LandingTestimonialCategory | null,
): string | undefined {
  if (category === null) {
    return undefined;
  }

  return landingTestimonialCategoryLabels[category];
}

export function getPublicReviewInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/u)
    .filter((part) => part !== "");

  if (parts.length === 0) {
    return "";
  }

  const first = parts[0];
  const last = parts[parts.length - 1];

  if (first === undefined) {
    return "";
  }

  if (parts.length === 1 || last === undefined || last === first) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
}

export function formatPublicReviewDate(
  isoDateTime: string,
): string | undefined {
  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function mapPublicReview(value: unknown): LandingTestimonial | null {
  const parsed = publicReviewSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return toLandingTestimonial(parsed.data);
}

export function mapPublicReviewList(
  value: unknown,
): LandingTestimonial[] | null {
  const parsed = publicReviewListSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const items: LandingTestimonial[] = [];

  for (const item of parsed.data.items) {
    const review = mapPublicReview(item);

    if (review !== null) {
      items.push(review);
    }
  }

  if (items.length === 0 && parsed.data.items.length > 0) {
    return null;
  }

  return items;
}

export async function loadPublicReviews(): Promise<PublicReviewsLoadResult> {
  const result = await requestPublicReviews();

  if (!result.ok) {
    return { items: [], ok: false };
  }

  const items = mapPublicReviewList(result.data);

  if (items === null) {
    return { items: [], ok: false };
  }

  return { items, ok: true };
}

function toLandingTestimonial(review: PublicReviewPayload): LandingTestimonial {
  const date = formatPublicReviewDate(review.createdAt);
  const role = review.customerRole?.trim() ?? "";
  const service = getPublicReviewCategoryLabel(review.serviceCategory);

  return {
    featured: review.featured,
    id: review.id,
    name: review.customerName,
    quote: review.content,
    rating: review.rating,
    ...(date === undefined ? {} : { date }),
    ...(role === "" ? {} : { location: role }),
    ...(service === undefined ? {} : { service }),
  };
}

async function requestPublicReviews(): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CUSTOMER_API_PATHS.testimonials, `${origin}/`);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(CUSTOMER_TESTIMONIALS_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return publicReviewsLoadFailure;
  }
}
