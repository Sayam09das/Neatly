import type {
  BlogStatus,
  NewsletterStatus,
  Prisma,
  ServiceCategory,
} from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  BlogListQuery,
  BlogPostRecord,
  NewsletterListQuery,
  NewsletterSubscriberRecord,
  PortfolioListQuery,
  PortfolioProjectRecord,
  PublicBlogListQuery,
  PublicBlogPostDetail,
} from "../services/cms/cms.types.ts";

export interface CmsRepository {
  findBlogPostById(id: string): Promise<BlogPostRecord | null>;
  findNewsletterSubscriberById(
    id: string,
  ): Promise<NewsletterSubscriberRecord | null>;
  findPortfolioProjectById(id: string): Promise<PortfolioProjectRecord | null>;
  findPublishedBlogPostBySlug(
    slug: string,
  ): Promise<PublicBlogPostDetail | null>;
  listBlogPosts(
    query: BlogListQuery,
  ): Promise<{ items: BlogPostRecord[]; total: number }>;
  listNewsletterSubscribers(
    query: NewsletterListQuery,
  ): Promise<{ items: NewsletterSubscriberRecord[]; total: number }>;
  listPortfolioProjects(
    query: PortfolioListQuery,
  ): Promise<{ items: PortfolioProjectRecord[]; total: number }>;
  listPublishedBlogPosts(
    query: PublicBlogListQuery,
  ): Promise<{ items: PublicBlogPostDetail[]; total: number }>;
  upsertNewsletterSubscription(email: string): Promise<void>;
}

function toBlogPost(row: {
  authorId: string;
  category: { name: string } | null;
  categoryId: string | null;
  content: string;
  createdAt: Date;
  excerpt: string;
  id: string;
  publishedAt: Date | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  status: BlogStatus;
  tags: string[];
  title: string;
  updatedAt: Date;
}): BlogPostRecord {
  return {
    authorId: row.authorId,
    categoryId: row.categoryId,
    categoryName: row.category?.name ?? null,
    content: row.content,
    createdAt: row.createdAt,
    excerpt: row.excerpt,
    id: row.id,
    publishedAt: row.publishedAt,
    seoDescription: row.seoDescription,
    seoTitle: row.seoTitle,
    slug: row.slug,
    status: row.status,
    tags: row.tags,
    title: row.title,
    updatedAt: row.updatedAt,
  };
}

function toPortfolio(row: {
  category: ServiceCategory;
  createdAt: Date;
  description: string;
  id: string;
  isFeatured: boolean;
  isPublished: boolean;
  location: string | null;
  slug: string;
  sortOrder: number;
  title: string;
  updatedAt: Date;
}): PortfolioProjectRecord {
  return {
    category: row.category,
    createdAt: row.createdAt,
    description: row.description,
    id: row.id,
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    location: row.location,
    slug: row.slug,
    sortOrder: row.sortOrder,
    title: row.title,
    updatedAt: row.updatedAt,
  };
}

function toSubscriber(row: {
  createdAt: Date;
  email: string;
  id: string;
  status: NewsletterStatus;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  updatedAt: Date;
}): NewsletterSubscriberRecord {
  return {
    createdAt: row.createdAt,
    email: row.email,
    id: row.id,
    status: row.status,
    subscribedAt: row.subscribedAt,
    unsubscribedAt: row.unsubscribedAt,
    updatedAt: row.updatedAt,
  };
}

const publishedBlogInclude = {
  category: { select: { name: true } },
  coverMedia: { select: { altText: true, url: true } },
} as const;

function toPublicBlogPost(row: {
  category: { name: string } | null;
  content: string;
  coverMedia: { altText: string; url: string } | null;
  excerpt: string;
  id: string;
  publishedAt: Date | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  title: string;
}): PublicBlogPostDetail | null {
  if (row.publishedAt === null) {
    return null;
  }

  return {
    categoryName: row.category?.name ?? null,
    content: row.content,
    coverImageAlt: row.coverMedia?.altText ?? null,
    coverImageUrl: row.coverMedia?.url ?? null,
    excerpt: row.excerpt,
    id: row.id,
    publishedAt: row.publishedAt.toISOString(),
    seoDescription: row.seoDescription,
    seoTitle: row.seoTitle,
    slug: row.slug,
    title: row.title,
  };
}

const publishedBlogWhere: Prisma.BlogPostWhereInput = {
  publishedAt: { not: null },
  status: "PUBLISHED",
};

function createdRange(
  from: Date | undefined,
  to: Date | undefined,
): Prisma.DateTimeFilter | undefined {
  if (from === undefined && to === undefined) {
    return undefined;
  }

  return {
    ...(from === undefined ? {} : { gte: from }),
    ...(to === undefined ? {} : { lte: to }),
  };
}

export class PrismaCmsRepository implements CmsRepository {
  public async findBlogPostById(id: string): Promise<BlogPostRecord | null> {
    const row = await prisma.blogPost.findUnique({
      include: { category: { select: { name: true } } },
      where: { id },
    });
    return row === null ? null : toBlogPost(row);
  }

  public async listBlogPosts(
    query: BlogListQuery,
  ): Promise<{ items: BlogPostRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const createdAt = createdRange(query.createdFrom, query.createdTo);
    const where: Prisma.BlogPostWhereInput = {
      ...(query.status === undefined ? {} : { status: query.status }),
      ...(createdAt === undefined ? {} : { createdAt }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
            ],
          }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        include: { category: { select: { name: true } } },
        orderBy: blogOrderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items: rows.map(toBlogPost), total };
  }

  public async findPortfolioProjectById(
    id: string,
  ): Promise<PortfolioProjectRecord | null> {
    const row = await prisma.portfolioProject.findUnique({ where: { id } });
    return row === null ? null : toPortfolio(row);
  }

  public async listPortfolioProjects(
    query: PortfolioListQuery,
  ): Promise<{ items: PortfolioProjectRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const createdAt = createdRange(query.createdFrom, query.createdTo);
    const where: Prisma.PortfolioProjectWhereInput = {
      ...(query.category === undefined ? {} : { category: query.category }),
      ...(query.published === undefined
        ? {}
        : { isPublished: query.published }),
      ...(createdAt === undefined ? {} : { createdAt }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.portfolioProject.findMany({
        orderBy: portfolioOrderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
      prisma.portfolioProject.count({ where }),
    ]);

    return { items: rows.map(toPortfolio), total };
  }

  public async findNewsletterSubscriberById(
    id: string,
  ): Promise<NewsletterSubscriberRecord | null> {
    const row = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    return row === null ? null : toSubscriber(row);
  }

  public async listNewsletterSubscribers(
    query: NewsletterListQuery,
  ): Promise<{ items: NewsletterSubscriberRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const subscribedAt = createdRange(query.subscribedFrom, query.subscribedTo);
    const where: Prisma.NewsletterSubscriberWhereInput = {
      ...(query.status === undefined ? {} : { status: query.status }),
      ...(subscribedAt === undefined ? {} : { subscribedAt }),
      ...(search === undefined || search === ""
        ? {}
        : { email: { contains: search, mode: "insensitive" } }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.newsletterSubscriber.findMany({
        orderBy: newsletterOrderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return { items: rows.map(toSubscriber), total };
  }

  public async findPublishedBlogPostBySlug(
    slug: string,
  ): Promise<PublicBlogPostDetail | null> {
    const row = await prisma.blogPost.findFirst({
      include: publishedBlogInclude,
      where: {
        ...publishedBlogWhere,
        slug,
      },
    });

    if (row === null) {
      return null;
    }

    return toPublicBlogPost(row);
  }

  public async listPublishedBlogPosts(
    query: PublicBlogListQuery,
  ): Promise<{ items: PublicBlogPostDetail[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.BlogPostWhereInput = {
      ...publishedBlogWhere,
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
            ],
          }),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.blogPost.findMany({
        include: publishedBlogInclude,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
      prisma.blogPost.count({ where }),
    ]);
    const items: PublicBlogPostDetail[] = [];

    for (const row of rows) {
      const post = toPublicBlogPost(row);

      if (post !== null) {
        items.push(post);
      }
    }

    return { items, total };
  }

  public async upsertNewsletterSubscription(email: string): Promise<void> {
    const now = new Date();

    await prisma.newsletterSubscriber.upsert({
      create: {
        email,
        status: "SUBSCRIBED",
        subscribedAt: now,
        unsubscribedAt: null,
      },
      update: {
        status: "SUBSCRIBED",
        subscribedAt: now,
        unsubscribedAt: null,
      },
      where: { email },
    });
  }
}

function blogOrderBy(
  sort: SortQuery | undefined,
): Prisma.BlogPostOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "publishedAt":
      return { publishedAt: direction };
    case "title":
      return { title: direction };
    default:
      return { createdAt: direction };
  }
}

function portfolioOrderBy(
  sort: SortQuery | undefined,
): Prisma.PortfolioProjectOrderByWithRelationInput {
  const direction = sort?.direction ?? "asc";

  switch (sort?.field) {
    case "createdAt":
      return { createdAt: direction };
    case "title":
      return { title: direction };
    default:
      return { sortOrder: direction };
  }
}

function newsletterOrderBy(
  sort: SortQuery | undefined,
): Prisma.NewsletterSubscriberOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "email":
      return { email: direction };
    case "createdAt":
      return { createdAt: direction };
    default:
      return { subscribedAt: direction };
  }
}
