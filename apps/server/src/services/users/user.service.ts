import type { UserStatus } from "@prisma/client";
import { type Actor, requireAdminActor } from "../../lib/domain/actor.ts";
import { userNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { ValidationError } from "../../lib/errors.ts";
import type { UserRepository } from "../../repositories/user.repository.ts";
import {
  type UpdateUserProfileInput,
  USER_SORT_FIELDS,
  type UserListQuery,
  type UserProfile,
} from "./user.types.ts";

export class UserService {
  private readonly users: UserRepository;

  public constructor(users: UserRepository) {
    this.users = users;
  }

  public async listAdminIds(actor: Actor): Promise<readonly string[]> {
    requireAdminActor(actor);
    return this.users.listAdminIds();
  }

  public async listAdminRecipientIds(): Promise<readonly string[]> {
    return this.users.listAdminIds();
  }

  public async getById(actor: Actor, id: string): Promise<UserProfile> {
    requireAdminActor(actor);
    const user = await this.users.findById(id);

    if (user === null) {
      throw userNotFound();
    }

    return user;
  }

  public async list(
    actor: Actor,
    query: UserListQuery = {},
  ): Promise<ListResult<UserProfile>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, USER_SORT_FIELDS);
    const result = await this.users.list({ ...query, pagination, sort });
    return toListResult(result.items, result.total, pagination);
  }

  public async updateProfile(
    actor: Actor,
    id: string,
    input: UpdateUserProfileInput,
  ): Promise<UserProfile> {
    requireAdminActor(actor);
    await this.getById(actor, id);
    const updated = await this.users.update(id, {
      name: input.name === undefined ? undefined : requireName(input.name),
    });

    if (updated === null) {
      throw userNotFound();
    }

    return updated;
  }

  public async setStatus(
    actor: Actor,
    id: string,
    status: UserStatus,
  ): Promise<UserProfile> {
    requireAdminActor(actor);
    await this.getById(actor, id);
    const updated = await this.users.update(id, { status });

    if (updated === null) {
      throw userNotFound();
    }

    return updated;
  }
}

function requireName(name: string): string {
  const trimmed = name.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field: "name", issue: "Enter a name." },
    ]);
  }

  return trimmed;
}
