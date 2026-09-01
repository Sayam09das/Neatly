import { loadServerEnv } from "@neatly/config/server";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_BLOG_REQUEST_TIMEOUT_MS,
  customerPublicBlogApiPath,
} from "@/config/customer";
import { blogPostPath, landingBlogHighlights } from "@/config/landing";
import {
  type JsonApiFailure,
  type JsonApiResult,
  parseJsonApiResponse,
} from "@/lib/api/envelope";
import { isUsableCustomerServiceImage } from "@/lib/customer/catalog";
import {
  type PublicBlogPostDetailPayload,
  type PublicBlogPostPayload,
  publicBlogDetailPayloadSchema,
  publicBlogListSchema,
  publicBlogPostSchema,
} from "@/lib/validations/public-blog.schema";

export interface LandingJournalPost {
  categoryName: string | null;
  coverAlt: string;
  coverSrc: string;
  date?: string;
  excerpt: string;
  href: string;
  id: string;
  slug: string;
  title: string;
}

export type PublicBlogLoadResult =
  | { items: LandingJournalPost[]; ok: true }
  | { items: []; ok: false };

export type PublicBlogDetailLoadResult =
  | { ok: true; post: PublicBlogPostDetailPayload }
  | { notFound: true; ok: false }
  | { notFound: false; ok: false };

const publicBlogLoadFailure: JsonApiFailure = {
  code: "INTERNAL_ERROR",
  fields: {},
  forbidden: false,
  message: landingBlogHighlights.errorMessage,
  ok: false,
  status: 0,
  unauthorized: false,
};

export function formatPublicBlogDate(isoDateTime: string): string | undefined {
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

export function splitJournalParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/u)
    .map((part) => part.trim())
    .filter((part) => part !== "");
}

export function mapPublicBlogPost(value: unknown): LandingJournalPost | null {
  const parsed = publicBlogPostSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return toLandingJournalPost(parsed.data);
}

export function mapPublicBlogList(value: unknown): LandingJournalPost[] | null {
  const parsed = publicBlogListSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const items: LandingJournalPost[] = [];

  for (const item of parsed.data.items) {
    const post = mapPublicBlogPost(item);

    if (post !== null) {
      items.push(post);
    }
  }

  if (items.length === 0 && parsed.data.items.length > 0) {
    return null;
  }

  return items;
}

export function mapPublicBlogDetail(
  value: unknown,
): PublicBlogPostDetailPayload | null {
  const parsed = publicBlogDetailPayloadSchema.safeParse(value);

  if (!parsed.success) {
    return null;
  }

  return parsed.data.post;
}

export async function loadPublicBlogHighlights(): Promise<PublicBlogLoadResult> {
  const limit = 1 + landingBlogHighlights.reservedCount;
  return loadPublicBlogPosts(limit);
}

export async function loadPublicBlogPosts(
  limit?: number,
): Promise<PublicBlogLoadResult> {
  const result = await requestPublicBlogList(limit);

  if (!result.ok) {
    return { items: [], ok: false };
  }

  const items = mapPublicBlogList(result.data);

  if (items === null) {
    return { items: [], ok: false };
  }

  return { items, ok: true };
}

export async function loadPublicBlogPost(
  slug: string,
): Promise<PublicBlogDetailLoadResult> {
  const result = await requestPublicBlogPost(slug);

  if (!result.ok) {
    return {
      notFound: result.status === 404 || result.code === "NOT_FOUND",
      ok: false,
    };
  }

  const post = mapPublicBlogDetail(result.data);

  if (post === null) {
    return { notFound: false, ok: false };
  }

  return { ok: true, post };
}

export function resolveJournalCover(
  post: Pick<LandingJournalPost, "coverAlt" | "coverSrc"> | null,
  fallback: { alt: string; src: string },
): { alt: string; src: string } {
  if (post !== null && isUsableCustomerServiceImage(post.coverSrc)) {
    return {
      alt: post.coverAlt.trim() === "" ? fallback.alt : post.coverAlt,
      src: post.coverSrc,
    };
  }

  return {
    alt: fallback.alt,
    src: fallback.src,
  };
}

function toLandingJournalPost(post: PublicBlogPostPayload): LandingJournalPost {
  const date = formatPublicBlogDate(post.publishedAt);
  const coverSrc = isUsableCustomerServiceImage(post.coverImageUrl)
    ? post.coverImageUrl
    : landingBlogHighlights.featuredImage.src;
  const coverAlt =
    post.coverImageAlt?.trim() || landingBlogHighlights.featuredImage.alt;

  return {
    categoryName: post.categoryName,
    coverAlt,
    coverSrc,
    excerpt: post.excerpt,
    href: blogPostPath(post.slug),
    id: post.id,
    slug: post.slug,
    title: post.title,
    ...(date === undefined ? {} : { date }),
  };
}

async function requestPublicBlogList(
  limit?: number,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(CUSTOMER_API_PATHS.blog, `${origin}/`);

  if (limit !== undefined) {
    url.searchParams.set("limit", String(limit));
  }

  return requestPublicJson(url);
}

async function requestPublicBlogPost(
  slug: string,
): Promise<JsonApiResult<unknown>> {
  const env = loadServerEnv();
  const origin = env.NEATLY_API_URL.endsWith("/")
    ? env.NEATLY_API_URL.slice(0, -1)
    : env.NEATLY_API_URL;
  const url = new URL(customerPublicBlogApiPath(slug), `${origin}/`);

  return requestPublicJson(url);
}

async function requestPublicJson(url: URL): Promise<JsonApiResult<unknown>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(CUSTOMER_BLOG_REQUEST_TIMEOUT_MS),
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return parseJsonApiResponse(response.status, body);
  } catch {
    return publicBlogLoadFailure;
  }
}
