import type { UserRole, UserStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const USER_SORT_FIELDS = ["createdAt", "email", "name"] as const;

export interface UserProfile {
  createdAt: Date;
  email: string;
  emailVerifiedAt: Date | null;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  role: UserRole;
  status: UserStatus;
  updatedAt: Date;
}

export interface UpdateUserProfileInput {
  name?: string;
}

export interface UserListQuery {
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: UserStatus;
}
