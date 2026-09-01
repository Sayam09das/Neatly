import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import type { CmsRepository } from "../../../apps/server/src/repositories/cms.repository.ts";
import { CmsService } from "../../../apps/server/src/services/cms/cms.service.ts";
import type {
  BlogPostRecord,
  NewsletterSubscriberRecord,
  PublicBlogPostDetail,
} from "../../../apps/server/src/services/cms/cms.types.ts";
import { createDomainHarness } from "../domain/in-memory-domain.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);
const NOW = new Date("2026-09-01T12:00:00.000Z");

interface Envelope<T> {
  data: T;
  error: { code: string; message: string; requestId?: string } | null;
  success: boolean;
}

const POST: BlogPostRecord = {
  authorId: "admin-1",
  categoryId: "cat-1",
  categoryName: "Home Care",
  content: "Full article body.",
  createdAt: NOW,
  excerpt: "Public excerpt",
  id: "post-1",
  publishedAt: NOW,
  seoDescription: null,
  seoTitle: null,
  slug: "dev-sample",
  status: "PUBLISHED",
  tags: ["development-placeholder"],
  title: "Sample post",
  updatedAt: NOW,
};

class PublicCmsRepository implements CmsRepository {
  public constructor(
    private readonly posts: readonly BlogPostRecord[],
    private readonly subscribers: NewsletterSubscriberRecord[] = [],
  ) {}

  public async findBlogPostById(): Promise<null> {
    return null;
  }

  public async findNewsletterSubscriberById(): Promise<null> {
    return null;
  }

  public async findPortfolioProjectById(): Promise<null> {
    return null;
  }

  public async listBlogPosts(): Promise<{
    items: BlogPostRecord[];
    total: number;
  }> {
    return { items: [...this.posts], total: this.posts.length };
  }

  public async listNewsletterSubscribers(): Promise<{
    items: NewsletterSubscriberRecord[];
    total: number;
  }> {
    return { items: [...this.subscribers], total: this.subscribers.length };
  }

  public async listPortfolioProjects(): Promise<{
    items: [];
    total: number;
  }> {
    return { items: [], total: 0 };
  }

  public async findPublishedBlogPostBySlug(
    slug: string,
  ): Promise<PublicBlogPostDetail | null> {
    const post = this.posts.find(
      (item) => item.slug === slug && item.status === "PUBLISHED",
    );

    if (post === undefined || post.publishedAt === null) {
      return null;
    }

    return {
      categoryName: post.categoryName,
      content: post.content,
      coverImageAlt: null,
      coverImageUrl: null,
      excerpt: post.excerpt,
      id: post.id,
      publishedAt: post.publishedAt.toISOString(),
      seoDescription: post.seoDescription,
      seoTitle: post.seoTitle,
      slug: post.slug,
      title: post.title,
    };
  }

  public async listPublishedBlogPosts(): Promise<{
    items: PublicBlogPostDetail[];
    total: number;
  }> {
    const items: PublicBlogPostDetail[] = [];

    for (const post of this.posts) {
      const mapped = await this.findPublishedBlogPostBySlug(post.slug);

      if (mapped !== null) {
        items.push(mapped);
      }
    }

    return { items, total: items.length };
  }

  public async upsertNewsletterSubscription(email: string): Promise<void> {
    this.subscribers.push({
      createdAt: NOW,
      email,
      id: `sub-${String(this.subscribers.length + 1)}`,
      status: "SUBSCRIBED",
      subscribedAt: NOW,
      unsubscribedAt: null,
      updatedAt: NOW,
    });
  }
}

describe("Public journal and newsletter APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue({
      ...harness,
      cms: new CmsService(new PublicCmsRepository([POST])),
    } as never);
  });

  it("lists published journal posts without authentication", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerBlog,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      items: Array<{ content?: string; slug: string; title: string }>;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]?.slug).toBe("dev-sample");
    expect(body.data.items[0]?.title).toBe("Sample post");
    expect(JSON.stringify(body.data.items)).not.toContain("authorId");
    expect(JSON.stringify(body.data.items)).not.toContain("Full article body");
  });

  it("returns a published journal article by slug", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "GET",
      url: `${API_PREFIX_BLOG}/dev-sample`,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      post: { content: string; slug: string };
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.post.slug).toBe("dev-sample");
    expect(body.data.post.content).toBe("Full article body.");
  });

  it("hides unpublished slugs behind not-found", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "GET",
      url: `${API_PREFIX_BLOG}/missing-note`,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(body.success).toBe(false);
  });

  it("stores a newsletter email without returning the subscriber list", async (): Promise<void> => {
    const response = await dispatchApi({
      body: JSON.stringify({ email: "visitor@example.test" }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.customerNewsletter,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      subscribed: true;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data).toEqual({ subscribed: true });
    expect(JSON.stringify(body.data)).not.toContain("visitor@example.test");
  });
});

const API_PREFIX_BLOG = API_PATHS.customerBlog;
