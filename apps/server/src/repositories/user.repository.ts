import type { Prisma, UserRole, UserStatus } from "@prisma/client";
import { AUTH_OPERATOR_ROLES } from "../config/auth.ts";
import { prisma } from "../lib/db.ts";
import { resolvePagination } from "../lib/domain/list.ts";
import type { SortQuery } from "../lib/query.ts";
import type {
  UpdateUserProfileInput,
  UserListQuery,
  UserProfile,
} from "../services/users/user.types.ts";

const USER_PROFILE_SELECT = {
  createdAt: true,
  email: true,
  emailVerifiedAt: true,
  id: true,
  lastLoginAt: true,
  name: true,
  role: true,
  status: true,
  updatedAt: true,
} as const;

export interface UserRepository {
  findById(id: string): Promise<UserProfile | null>;
  list(query: UserListQuery): Promise<{ items: UserProfile[]; total: number }>;
  listAdminIds(): Promise<readonly string[]>;
  update(
    id: string,
    input: UpdateUserProfileInput & { status?: UserStatus },
  ): Promise<UserProfile | null>;
}

function toProfile(row: {
  createdAt: Date;
  email: string;
  emailVerifiedAt: Date | null;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  role: UserRole;
  status: UserStatus;
  updatedAt: Date;
}): UserProfile {
  return {
    createdAt: row.createdAt,
    email: row.email,
    emailVerifiedAt: row.emailVerifiedAt,
    id: row.id,
    lastLoginAt: row.lastLoginAt,
    name: row.name,
    role: row.role,
    status: row.status,
    updatedAt: row.updatedAt,
  };
}

function orderBy(
  sort: SortQuery | undefined,
): Prisma.UserOrderByWithRelationInput {
  const direction = sort?.direction ?? "desc";

  switch (sort?.field) {
    case "email":
      return { email: direction };
    case "name":
      return { name: direction };
    default:
      return { createdAt: direction };
  }
}

export class PrismaUserRepository implements UserRepository {
  public async listAdminIds(): Promise<readonly string[]> {
    const rows = await prisma.user.findMany({
      select: { id: true },
      take: 100,
      where: {
        role: { in: [...AUTH_OPERATOR_ROLES] },
        status: "ACTIVE",
      },
    });
    return rows.map((row) => row.id);
  }

  public async findById(id: string): Promise<UserProfile | null> {
    const row = await prisma.user.findUnique({
      select: USER_PROFILE_SELECT,
      where: { id },
    });
    return row === null ? null : toProfile(row);
  }

  public async update(
    id: string,
    input: UpdateUserProfileInput & { status?: UserStatus },
  ): Promise<UserProfile | null> {
    try {
      const row = await prisma.user.update({
        data: input,
        select: USER_PROFILE_SELECT,
        where: { id },
      });
      return toProfile(row);
    } catch {
      return null;
    }
  }

  public async list(
    query: UserListQuery,
  ): Promise<{ items: UserProfile[]; total: number }> {
    const pagination = resolvePagination(query.pagination);
    const search = query.search?.trim();
    const where: Prisma.UserWhereInput = {
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
      prisma.user.count({ where }),
      prisma.user.findMany({
        orderBy: orderBy(query.sort),
        select: USER_PROFILE_SELECT,
        skip: pagination.skip,
        take: pagination.limit,
        where,
      }),
    ]);

    return { items: rows.map(toProfile), total };
  }
}
