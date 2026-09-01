import { describe, expect, it } from "vitest";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
import {
  AuthorizationError,
  NotFoundError,
} from "../../../apps/server/src/lib/errors.ts";
import type { CmsRepository } from "../../../apps/server/src/repositories/cms.repository.ts";
import { CmsService } from "../../../apps/server/src/services/cms/cms.service.ts";
import type {
  BlogPostRecord,
  NewsletterSubscriberRecord,
  PortfolioProjectRecord,
  PublicBlogPostDetail,
} from "../../../apps/server/src/services/cms/cms.types.ts";

const admin: Actor = { id: "admin-1", role: "ADMIN" };
const customer: Actor = { id: "customer-1", role: "CUSTOMER" };

const NOW = new Date("2026-09-01T12:00:00.000Z");

const POST: BlogPostRecord = {
  authorId: "admin-1",
  categoryId: "cat-1",
  categoryName: "Home Care",
  content: "Sample",
  createdAt: NOW,
  excerpt: "Sample excerpt",
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

const PROJECT: PortfolioProjectRecord = {
  category: "RESIDENTIAL",
  createdAt: NOW,
  description: "Sample project",
  id: "project-1",
  isFeatured: true,
  isPublished: true,
  location: null,
  slug: "dev-sample-project",
  sortOrder: 1,
  title: "Sample project",
  updatedAt: NOW,
};

const SUBSCRIBER: NewsletterSubscriberRecord = {
  createdAt: NOW,
  email: "dev-subscriber-01@example.test",
  id: "sub-1",
  status: "SUBSCRIBED",
  subscribedAt: NOW,
  unsubscribedAt: null,
  updatedAt: NOW,
};

class MemoryCmsRepository implements CmsRepository {
  private readonly subscribers: NewsletterSubscriberRecord[];

  public constructor(
    private readonly posts: readonly BlogPostRecord[],
    private readonly projects: readonly PortfolioProjectRecord[],
    subscribers: readonly NewsletterSubscriberRecord[],
  ) {
    this.subscribers = subscribers.map((subscriber) => ({ ...subscriber }));
  }

  public async findBlogPostById(id: string): Promise<BlogPostRecord | null> {
    return this.posts.find((post) => post.id === id) ?? null;
  }

  public async findNewsletterSubscriberById(
    id: string,
  ): Promise<NewsletterSubscriberRecord | null> {
    return this.subscribers.find((subscriber) => subscriber.id === id) ?? null;
  }

  public async findPortfolioProjectById(
    id: string,
  ): Promise<PortfolioProjectRecord | null> {
    return this.projects.find((project) => project.id === id) ?? null;
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
    items: PortfolioProjectRecord[];
    total: number;
  }> {
    return { items: [...this.projects], total: this.projects.length };
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

    return toPublicDetail(post);
  }

  public async listPublishedBlogPosts(): Promise<{
    items: PublicBlogPostDetail[];
    total: number;
  }> {
    const items = this.posts
      .filter(
        (post) => post.status === "PUBLISHED" && post.publishedAt !== null,
      )
      .map(toPublicDetail);

    return { items, total: items.length };
  }

  public async upsertNewsletterSubscription(email: string): Promise<void> {
    const existing = this.subscribers.find(
      (subscriber) => subscriber.email === email,
    );
    const now = new Date();

    if (existing === undefined) {
      this.subscribers.push({
        createdAt: now,
        email,
        id: `sub-${String(this.subscribers.length + 1)}`,
        status: "SUBSCRIBED",
        subscribedAt: now,
        unsubscribedAt: null,
        updatedAt: now,
      });
      return;
    }

    existing.status = "SUBSCRIBED";
    existing.subscribedAt = now;
    existing.unsubscribedAt = null;
    existing.updatedAt = now;
  }
}

function toPublicDetail(post: BlogPostRecord): PublicBlogPostDetail {
  if (post.publishedAt === null) {
    throw new Error("Published posts require publishedAt.");
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

describe("CmsService", (): void => {
  it("lists and retrieves blog, portfolio, and newsletter records for admins", async (): Promise<void> => {
    const cms = new CmsService(
      new MemoryCmsRepository([POST], [PROJECT], [SUBSCRIBER]),
    );

    const posts = await cms.listBlogPosts(admin);
    expect(posts.items).toHaveLength(1);
    expect(posts.pagination.total).toBe(1);
    await expect(cms.getBlogPost(admin, "post-1")).resolves.toMatchObject({
      slug: "dev-sample",
      status: "PUBLISHED",
    });

    const projects = await cms.listPortfolioProjects(admin);
    expect(projects.items).toHaveLength(1);
    await expect(
      cms.getPortfolioProject(admin, "project-1"),
    ).resolves.toMatchObject({ slug: "dev-sample-project" });

    const subscribers = await cms.listNewsletterSubscribers(admin);
    expect(subscribers.items).toHaveLength(1);
    await expect(
      cms.getNewsletterSubscriber(admin, "sub-1"),
    ).resolves.toMatchObject({ email: "dev-subscriber-01@example.test" });
  });

  it("rejects missing records and non-admin actors", async (): Promise<void> => {
    const cms = new CmsService(new MemoryCmsRepository([], [], []));

    await expect(cms.listBlogPosts(customer)).rejects.toBeInstanceOf(
      AuthorizationError,
    );
    await expect(cms.getBlogPost(admin, "missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
    await expect(
      cms.getPortfolioProject(admin, "missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      cms.getNewsletterSubscriber(admin, "missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("lists published journal posts and hides drafts", async (): Promise<void> => {
    const draft: BlogPostRecord = {
      ...POST,
      id: "post-draft",
      publishedAt: null,
      slug: "dev-draft",
      status: "DRAFT",
      title: "Draft post",
    };
    const cms = new CmsService(
      new MemoryCmsRepository([POST, draft], [PROJECT], [SUBSCRIBER]),
    );

    const listed = await cms.listPublicBlogPosts();
    expect(listed.items).toHaveLength(1);
    expect(listed.items[0]).toMatchObject({
      slug: "dev-sample",
      title: "Sample post",
    });
    expect(JSON.stringify(listed.items[0])).not.toContain("authorId");
    expect(JSON.stringify(listed.items[0])).not.toContain("content");

    await expect(cms.getPublicBlogPostBySlug("dev-sample")).resolves.toEqual({
      categoryName: "Home Care",
      content: "Sample",
      coverImageAlt: null,
      coverImageUrl: null,
      excerpt: "Sample excerpt",
      id: "post-1",
      publishedAt: NOW.toISOString(),
      seoDescription: null,
      seoTitle: null,
      slug: "dev-sample",
      title: "Sample post",
    });
    await expect(
      cms.getPublicBlogPostBySlug("dev-draft"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("subscribes emails without leaking whether the address is new", async (): Promise<void> => {
    const unsubscribed: NewsletterSubscriberRecord = {
      ...SUBSCRIBER,
      email: "returning@example.test",
      id: "sub-2",
      status: "UNSUBSCRIBED",
      unsubscribedAt: NOW,
    };
    const repo = new MemoryCmsRepository([], [], [unsubscribed]);
    const cms = new CmsService(repo);

    await expect(cms.subscribeNewsletter("new@example.test")).resolves.toEqual({
      subscribed: true,
    });
    await expect(
      cms.subscribeNewsletter("returning@example.test"),
    ).resolves.toEqual({ subscribed: true });

    const listed = await cms.listNewsletterSubscribers(admin);
    expect(listed.items).toHaveLength(2);
    expect(
      listed.items.find((item) => item.email === "returning@example.test")
        ?.status,
    ).toBe("SUBSCRIBED");
  });
});
