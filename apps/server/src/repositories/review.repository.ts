import type { Prisma, ServiceCategory } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  CreateReviewInput,
  ReviewListQuery,
  ReviewRecord,
  UpdateReviewInput,
} from "../services/reviews/review.types.ts";

export interface ReviewRepository {
  countActive(): Promise<number>;
  countTotal(): Promise<number>;
  create(input: CreateReviewInput): Promise<ReviewRecord>;
  findById(id: string): Promise<ReviewRecord | null>;
  list(
    query: ReviewListQuery,
  ): Promise<{ items: ReviewRecord[]; total: number }>;
  update(
    id: string,
    input: UpdateReviewInput & { isActive?: boolean },
  ): Promise<ReviewRecord | null>;
}

function toRecord(row: {
  avatarMediaId: string | null;
  content: string;
  createdAt: Date;
  customerName: string;
  customerRole: string | null;
  id: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  serviceCategory: ServiceCategory | null;
  sortOrder: number;
  updatedAt: Date;
}): ReviewRecord {
  return {
    avatarMediaId: row.avatarMediaId,
    content: row.content,
    createdAt: row.createdAt,
    customerName: row.customerName,
    customerRole: row.customerRole,
    id: row.id,
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    rating: row.rating,
    serviceCategory: row.serviceCategory,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt,
  };
}

function orderBy(
  sort: SortQuery | undefined,
): Prisma.TestimonialOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "rating":
      return { rating: direction };
    case "sortOrder":
      return { sortOrder: direction };
    default:
      return { createdAt: direction };
  }
}

export class PrismaReviewRepository implements ReviewRepository {
  public async findById(id: string): Promise<ReviewRecord | null> {
    const row = await prisma.testimonial.findUnique({ where: { id } });
    return row === null ? null : toRecord(row);
  }

  public async create(input: CreateReviewInput): Promise<ReviewRecord> {
    const row = await prisma.testimonial.create({
      data: {
        avatarMediaId: input.avatarMediaId ?? null,
        content: input.content,
        customerName: input.customerName,
        customerRole: input.customerRole ?? null,
        isFeatured: input.isFeatured ?? false,
        rating: input.rating,
        serviceCategory: input.serviceCategory ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return toRecord(row);
  }

  public async update(
    id: string,
    input: UpdateReviewInput & { isActive?: boolean },
  ): Promise<ReviewRecord | null> {
    try {
      const row = await prisma.testimonial.update({
        data: input,
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async list(
    query: ReviewListQuery,
  ): Promise<{ items: ReviewRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.TestimonialWhereInput = {
      ...(query.active === undefined ? {} : { isActive: query.active }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { content: { contains: search, mode: "insensitive" } },
              { customerName: { contains: search, mode: "insensitive" } },
            ],
          }),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async countTotal(): Promise<number> {
    return prisma.testimonial.count();
  }

  public async countActive(): Promise<number> {
    return prisma.testimonial.count({ where: { isActive: true } });
  }
}
