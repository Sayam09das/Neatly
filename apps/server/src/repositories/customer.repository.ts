import type { CustomerStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  CreateCustomerInput,
  CustomerListQuery,
  CustomerRecord,
  UpdateCustomerInput,
} from "../services/customers/customer.types.ts";

export interface CustomerRepository {
  countByStatus(status: CustomerStatus): Promise<number>;
  countTotal(): Promise<number>;
  create(input: CreateCustomerInput): Promise<CustomerRecord>;
  findByEmail(email: string): Promise<CustomerRecord | null>;
  findById(id: string): Promise<CustomerRecord | null>;
  findByUserId(userId: string): Promise<CustomerRecord | null>;
  list(
    query: CustomerListQuery,
  ): Promise<{ items: CustomerRecord[]; total: number }>;
  update(
    id: string,
    input: UpdateCustomerInput & { status?: CustomerStatus },
  ): Promise<CustomerRecord | null>;
}

function toRecord(row: {
  address: string | null;
  avatarMediaId: string | null;
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  status: CustomerStatus;
  updatedAt: Date;
  userId: string | null;
}): CustomerRecord {
  return {
    address: row.address,
    avatarMediaId: row.avatarMediaId,
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
): Prisma.CustomerOrderByWithRelationInput {
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

export class PrismaCustomerRepository implements CustomerRepository {
  public async findById(id: string): Promise<CustomerRecord | null> {
    const row = await prisma.customer.findUnique({ where: { id } });
    return row === null ? null : toRecord(row);
  }

  public async findByEmail(email: string): Promise<CustomerRecord | null> {
    const row = await prisma.customer.findUnique({ where: { email } });
    return row === null ? null : toRecord(row);
  }

  public async findByUserId(userId: string): Promise<CustomerRecord | null> {
    const row = await prisma.customer.findUnique({ where: { userId } });
    return row === null ? null : toRecord(row);
  }

  public async create(input: CreateCustomerInput): Promise<CustomerRecord> {
    const row = await prisma.customer.create({
      data: {
        address: input.address ?? null,
        avatarMediaId: input.avatarMediaId ?? null,
        email: input.email,
        name: input.name,
        phone: input.phone ?? null,
        userId: input.userId ?? null,
      },
    });
    return toRecord(row);
  }

  public async update(
    id: string,
    input: UpdateCustomerInput & { status?: CustomerStatus },
  ): Promise<CustomerRecord | null> {
    try {
      const row = await prisma.customer.update({
        data: input,
        where: { id },
      });
      return toRecord(row);
    } catch {
      return null;
    }
  }

  public async list(
    query: CustomerListQuery,
  ): Promise<{ items: CustomerRecord[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.CustomerWhereInput = {
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
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        orderBy: orderBy(query.sort),
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toRecord), total };
  }

  public async countTotal(): Promise<number> {
    return prisma.customer.count();
  }

  public async countByStatus(status: CustomerStatus): Promise<number> {
    return prisma.customer.count({ where: { status } });
  }
}
