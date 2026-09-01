import type { Actor } from "../../lib/domain/actor.ts";
import { requireAdminActor } from "../../lib/domain/actor.ts";
import {
  blogPostNotFound,
  newsletterSubscriberNotFound,
  portfolioProjectNotFound,
} from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import type { CmsRepository } from "../../repositories/cms.repository.ts";
import {
  BLOG_SORT_FIELDS,
  type BlogListQuery,
  type BlogPostRecord,
  NEWSLETTER_SORT_FIELDS,
  type NewsletterListQuery,
  type NewsletterSubscribeResult,
  type NewsletterSubscriberRecord,
  PORTFOLIO_SORT_FIELDS,
  type PortfolioListQuery,
  type PortfolioProjectRecord,
  type PublicBlogListQuery,
  type PublicBlogPost,
  type PublicBlogPostDetail,
} from "./cms.types.ts";

export class CmsService {
  private readonly cms: CmsRepository;

  public constructor(cms: CmsRepository) {
    this.cms = cms;
  }

  public async listBlogPosts(
    actor: Actor,
    query: BlogListQuery = {},
  ): Promise<ListResult<BlogPostRecord>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, BLOG_SORT_FIELDS);
    const result = await this.cms.listBlogPosts({
      ...query,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async getBlogPost(actor: Actor, id: string): Promise<BlogPostRecord> {
    requireAdminActor(actor);
    const post = await this.cms.findBlogPostById(id);

    if (post === null) {
      throw blogPostNotFound();
    }

    return post;
  }

  public async listPortfolioProjects(
    actor: Actor,
    query: PortfolioListQuery = {},
  ): Promise<ListResult<PortfolioProjectRecord>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, PORTFOLIO_SORT_FIELDS);
    const result = await this.cms.listPortfolioProjects({
      ...query,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async getPortfolioProject(
    actor: Actor,
    id: string,
  ): Promise<PortfolioProjectRecord> {
    requireAdminActor(actor);
    const project = await this.cms.findPortfolioProjectById(id);

    if (project === null) {
      throw portfolioProjectNotFound();
    }

    return project;
  }

  public async listNewsletterSubscribers(
    actor: Actor,
    query: NewsletterListQuery = {},
  ): Promise<ListResult<NewsletterSubscriberRecord>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, NEWSLETTER_SORT_FIELDS);
    const result = await this.cms.listNewsletterSubscribers({
      ...query,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async getNewsletterSubscriber(
    actor: Actor,
    id: string,
  ): Promise<NewsletterSubscriberRecord> {
    requireAdminActor(actor);
    const subscriber = await this.cms.findNewsletterSubscriberById(id);

    if (subscriber === null) {
      throw newsletterSubscriberNotFound();
    }

    return subscriber;
  }

  public async listPublicBlogPosts(
    query: PublicBlogListQuery = {},
  ): Promise<ListResult<PublicBlogPost>> {
    const pagination = resolvePagination(query.pagination);
    const result = await this.cms.listPublishedBlogPosts({
      pagination,
      search: query.search,
    });

    return toListResult(
      result.items.map(toPublicBlogSummary),
      result.total,
      pagination,
    );
  }

  public async getPublicBlogPostBySlug(
    slug: string,
  ): Promise<PublicBlogPostDetail> {
    const post = await this.cms.findPublishedBlogPostBySlug(slug);

    if (post === null) {
      throw blogPostNotFound();
    }

    return post;
  }

  public async subscribeNewsletter(
    email: string,
  ): Promise<NewsletterSubscribeResult> {
    await this.cms.upsertNewsletterSubscription(email);
    return { subscribed: true };
  }
}

function toPublicBlogSummary(post: PublicBlogPostDetail): PublicBlogPost {
  return {
    categoryName: post.categoryName,
    coverImageAlt: post.coverImageAlt,
    coverImageUrl: post.coverImageUrl,
    excerpt: post.excerpt,
    id: post.id,
    publishedAt: post.publishedAt,
    slug: post.slug,
    title: post.title,
  };
}
