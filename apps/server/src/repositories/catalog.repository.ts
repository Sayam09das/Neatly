import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  CatalogListQuery,
  CatalogRecord,
  CreateCatalogInput,
  UpdateCatalogInput,
} from "../services/catalog/catalog.types.ts";

export interface CatalogRepository {
  countActive(): Promise<number>;
  countTotal(): Promise<number>;
  create(input: CreateCatalogInput & { slug: string }): Promise<CatalogRecord>;
  findById(id: string): Promise<CatalogRecord | null>;
  findBySlug(slug: string): Promise<CatalogRecord | null>;
  list(
    query: CatalogListQuery,
  ): Promise<{ items: CatalogRecord[]; total: number }>;
  update(
    id: string,
    input: UpdateCatalogInput & { isActive?: boolean },
  ): Promise<CatalogRecord | null>;
}

function toRecord(row: {
  benefits: string[];
  coverMedia: { url: string } | null;
  coverMediaId: string | null;
  createdAt: Date;
  excludedTasks: string[];
  faqs: Prisma.JsonValue;
  fullDescription: string;
  id: string;
  includedTasks: Prisma.JsonValue;
  isActive: boolean;
  isFeatured: boolean;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
  shortDescription: string;
  slug: string;
  sortOrder: number;
  updatedAt: Date;
}): CatalogRecord {
  return {
    benefits: row.benefits,
    coverImageUrl: row.coverMedia?.url ?? null,
    coverMediaId: row.coverMediaId,
    createdAt: row.createdAt,
    excludedTasks: row.excludedTasks,
    faqs: row.faqs,
    fullDescription: row.fullDescription,
    id: row.id,
    includedTasks: row.includedTasks,
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    name: row.name,
    seoDescription: row.seoDescription,
    seoTitle: row.seoTitle,
    shortDescription: row.shortDescription,
    slug: row.slug,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt,
  };
}

const CATALOG_INCLUDE = {
  coverMedia: { select: { url: true } },
} as const;

function orderBy(
  sort: SortQuery | undefined,
): Prisma.ServiceOrderByWithRelationInput {
  const direction = sort?.direction ?? "asc";

  switch (sort?.field) {
    case "createdAt":
      return { createdAt: direction };
    case "name":
      return { name: direction };
    default:
      return { sortOrder: direction };
  }
}

export class PrismaCatalogRepository implements CatalogRepository {
  public async findById(id: string): Promise<CatalogRecord | null> {
    const row = await prisma.service.findUnique({
      include: CATALOG_INCLUDE,
      where: { id },
    });
    return row === null ? null : toRecord(row);
  }

  public async findBySlug(slug: string): Promise<CatalogRecord | null> {
    const row = await prisma.service.findUnique({
      include: CATALOG_INCLUDE,
      where: { slug },
    });
    return row === null ? null : toRecord(row);
  }

  public async create(
    input: CreateCatalogInput & { slug: string },
  ): Promise<CatalogRecord> {
    const row = await prisma.service.create({
      data: {
        benefits: input.benefits ?? [],
        coverMediaId: input.coverMediaId ?? null,
        excludedTasks: input.excludedTasks ?? [],
        faqs:
          input.faqs === undefined
            ? undefined
            : (input.faqs as Prisma.InputJsonValue),
        fullDescription: input.fullDescription,
        includedTasks:
          input.includedTasks === undefined
            ? undefined
            : (input.includedTasks as Prisma.InputJsonValue),
        isFeatured: input.isFeatured ?? false,
        name: input.name,
        seoDescription: input.seoDescription ?? null,
        seoTitle: input.seoTitle ?? null,
        shortDescription: input.shortDescription,
        slug: input.slug,
        sortOrder: input.sortOrder ?? 0,
      },
      include: CATALOG_INCLUDE,
    });
    return toRecord(row);
  }

  public async update(
    id: string,
    input: UpdateCatalogInput & { isActive?: boolean },
  ): Promise<CatalogRecord | null> {
    try {
      const row = await prisma.service.update({
        data: {
          ...input,
          faqs:
            input.faqs === undefined
              ? undefined
              : (input.faqs as Prisma.InputJsonValue),
          includedTasks:
            input.includedTasks === undefined
              ? undefined
              : (input.includedTasks as Prisma.InputJsonValue),
        },
        include: CATALOG_INCLUDE,
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async list(
    query: CatalogListQuery,
  ): Promise<{ items: CatalogRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.ServiceWhereInput = {
      ...(query.active === undefined ? {} : { isActive: query.active }),
      ...(search === undefined || search === ""
        ? {}
        : { name: { contains: search, mode: "insensitive" } }),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.service.count({ where }),
      prisma.service.findMany({
        include: CATALOG_INCLUDE,
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async countTotal(): Promise<number> {
    return prisma.service.count();
  }

  public async countActive(): Promise<number> {
    return prisma.service.count({ where: { isActive: true } });
  }
}
