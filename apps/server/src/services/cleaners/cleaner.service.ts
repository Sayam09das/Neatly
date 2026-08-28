import {
  type Actor,
  assertOwnerOrAdmin,
  requireAdminActor,
} from "../../lib/domain/actor.ts";
import { cleanerNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { ConflictError, ValidationError } from "../../lib/errors.ts";
import { parseWithSchema } from "../../lib/validations/parse.ts";
import { emailSchema } from "../../lib/validations/primitives.ts";
import type { CleanerRepository } from "../../repositories/cleaner.repository.ts";
import {
  CLEANER_SORT_FIELDS,
  type CleanerListQuery,
  type CleanerRecord,
  type CleanerStats,
  type CreateCleanerInput,
  type UpdateCleanerInput,
} from "./cleaner.types.ts";

export class CleanerService {
  private readonly cleaners: CleanerRepository;

  public constructor(cleaners: CleanerRepository) {
    this.cleaners = cleaners;
  }

  public async create(
    actor: Actor,
    input: CreateCleanerInput,
  ): Promise<CleanerRecord> {
    requireAdminActor(actor);
    const email =
      input.email === undefined ||
      input.email === null ||
      input.email.trim() === ""
        ? null
        : parseWithSchema(emailSchema, input.email);

    if (email !== null) {
      const existing = await this.cleaners.findByEmail(email);

      if (existing !== null) {
        throw new ConflictError("A cleaner with this email already exists.");
      }
    }

    return this.cleaners.create({
      email,
      name: requireName(input.name),
      phone: emptyToNull(input.phone),
      userId: input.userId ?? null,
    });
  }

  public async getById(actor: Actor, id: string): Promise<CleanerRecord> {
    const cleaner = await this.cleaners.findById(id);

    if (cleaner === null) {
      throw cleanerNotFound();
    }

    assertOwnerOrAdmin(actor, cleaner.userId);
    return cleaner;
  }

  public async list(
    actor: Actor,
    query: CleanerListQuery = {},
  ): Promise<ListResult<CleanerRecord>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, CLEANER_SORT_FIELDS);
    const result = await this.cleaners.list({ ...query, pagination, sort });
    return toListResult(result.items, result.total, pagination);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateCleanerInput,
  ): Promise<CleanerRecord> {
    const cleaner = await this.getById(actor, id);

    if (
      input.email !== undefined &&
      input.email !== null &&
      input.email.trim() !== ""
    ) {
      const email = parseWithSchema(emailSchema, input.email);
      const existing = await this.cleaners.findByEmail(email);

      if (existing !== null && existing.id !== cleaner.id) {
        throw new ConflictError("A cleaner with this email already exists.");
      }
    }

    const updated = await this.cleaners.update(id, {
      email:
        input.email === undefined
          ? undefined
          : input.email === null || input.email.trim() === ""
            ? null
            : parseWithSchema(emailSchema, input.email),
      name: input.name === undefined ? undefined : requireName(input.name),
      phone: input.phone === undefined ? undefined : emptyToNull(input.phone),
    });

    if (updated === null) {
      throw cleanerNotFound();
    }

    return updated;
  }

  public async deactivate(actor: Actor, id: string): Promise<CleanerRecord> {
    requireAdminActor(actor);
    const cleaner = await this.cleaners.findById(id);

    if (cleaner === null) {
      throw cleanerNotFound();
    }

    const updated = await this.cleaners.update(id, { status: "INACTIVE" });

    if (updated === null) {
      throw cleanerNotFound();
    }

    return updated;
  }

  public async activate(actor: Actor, id: string): Promise<CleanerRecord> {
    requireAdminActor(actor);
    const cleaner = await this.cleaners.findById(id);

    if (cleaner === null) {
      throw cleanerNotFound();
    }

    const updated = await this.cleaners.update(id, { status: "ACTIVE" });

    if (updated === null) {
      throw cleanerNotFound();
    }

    return updated;
  }

  public async stats(actor: Actor): Promise<CleanerStats> {
    requireAdminActor(actor);
    const [total, active] = await Promise.all([
      this.cleaners.countTotal(),
      this.cleaners.countByStatus("ACTIVE"),
    ]);

    return {
      active,
      inactive: total - active,
      total,
    };
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

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
