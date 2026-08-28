import type { CleanerStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  CleanerListQuery,
  CleanerRecord,
  CreateCleanerInput,
  UpdateCleanerInput,
} from "../services/cleaners/cleaner.types.ts";

export interface CleanerRepository {
  countByStatus(status: CleanerStatus): Promise<number>;
  countTotal(): Promise<number>;
  create(input: CreateCleanerInput): Promise<CleanerRecord>;
  findByEmail(email: string): Promise<CleanerRecord | null>;
  findById(id: string): Promise<CleanerRecord | null>;
  findByUserId(userId: string): Promise<CleanerRecord | null>;
  list(
    query: CleanerListQuery,
  ): Promise<{ items: CleanerRecord[]; total: number }>;
  update(
    id: string,
    input: UpdateCleanerInput & { status?: CleanerStatus },
  ): Promise<CleanerRecord | null>;
}

function toRecord(row: {
  createdAt: Date;
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
  updatedAt: Date;
  userId: string | null;
}): CleanerRecord {
  return {
    createdAt: row.createdAt,
    email: row.email,
    id: row.id,
    name: row.name,
    phone: row.phone,
    status: row.status,
    updatedAt: row.updatedAt,
    userId: row.userId,
  };
}

function orderBy(
  sort: SortQuery | undefined,
): Prisma.CleanerOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "email":
      return { email: direction };
    case "name":
      return { name: direction };
    case "status":
      return { status: direction };
    default:
      return { createdAt: direction };
  }
}

export class PrismaCleanerRepository implements CleanerRepository {
  public async findById(id: string): Promise<CleanerRecord | null> {
    const row = await prisma.cleaner.findUnique({ where: { id } });
    return row === null ? null : toRecord(row);
  }

  public async findByEmail(email: string): Promise<CleanerRecord | null> {
    const row = await prisma.cleaner.findUnique({ where: { email } });
    return row === null ? null : toRecord(row);
  }

  public async findByUserId(userId: string): Promise<CleanerRecord | null> {
    const row = await prisma.cleaner.findUnique({ where: { userId } });
    return row === null ? null : toRecord(row);
  }

  public async create(input: CreateCleanerInput): Promise<CleanerRecord> {
    const row = await prisma.cleaner.create({
      data: {
        email: input.email ?? null,
        name: input.name,
        phone: input.phone ?? null,
        userId: input.userId ?? null,
      },
    });
    return toRecord(row);
  }

  public async update(
    id: string,
    input: UpdateCleanerInput & { status?: CleanerStatus },
  ): Promise<CleanerRecord | null> {
    try {
      const row = await prisma.cleaner.update({
        data: input,
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async list(
    query: CleanerListQuery,
  ): Promise<{ items: CleanerRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.CleanerWhereInput = {
      ...(query.status === undefined ? {} : { status: query.status }),
      ...(search === undefined || search === ""
        ? {}
        : {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.cleaner.count({ where }),
      prisma.cleaner.findMany({
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async countTotal(): Promise<number> {
    return prisma.cleaner.count();
  }

  public async countByStatus(status: CleanerStatus): Promise<number> {
    return prisma.cleaner.count({ where: { status } });
  }
}
