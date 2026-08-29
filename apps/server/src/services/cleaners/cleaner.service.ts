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
import {
  AuthorizationError,
  ConflictError,
  ValidationError,
} from "../../lib/errors.ts";
import { parseWithSchema } from "../../lib/validations/parse.ts";
import { emailSchema } from "../../lib/validations/primitives.ts";
import type { BookingRepository } from "../../repositories/booking.repository.ts";
import type { CleanerRepository } from "../../repositories/cleaner.repository.ts";
import { CLEANER_UPCOMING_EXCLUDED_STATUSES } from "../bookings/booking.types.ts";
import {
  CLEANER_SORT_FIELDS,
  CLEANER_WEEKDAYS,
  type CleanerAvailabilityView,
  type CleanerListQuery,
  type CleanerRecord,
  type CleanerSessionView,
  type CleanerStats,
  type CleanerWeekDayAvailability,
  type CreateCleanerInput,
  toCleanerSessionView,
  type UpdateCleanerInput,
} from "./cleaner.types.ts";

export class CleanerService {
  private readonly bookings: BookingRepository;
  private readonly cleaners: CleanerRepository;

  public constructor(cleaners: CleanerRepository, bookings: BookingRepository) {
    this.bookings = bookings;
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

  public async getForSession(actor: Actor): Promise<CleanerSessionView> {
    if (actor.role !== "CLEANER") {
      throw new AuthorizationError();
    }

    const cleaner = await this.cleaners.findByUserId(actor.id);

    if (cleaner === null || cleaner.status !== "ACTIVE") {
      throw new AuthorizationError();
    }

    return toCleanerSessionView(cleaner);
  }

  public async getAvailability(actor: Actor): Promise<CleanerAvailabilityView> {
    const cleaner = await this.requireSessionCleaner(actor);
    const week = parseStoredAvailability(cleaner.availability);
    return {
      conflicts: await this.findAvailabilityConflicts(cleaner.id, week),
      week,
    };
  }

  public async updateAvailability(
    actor: Actor,
    week: readonly CleanerWeekDayAvailability[],
  ): Promise<CleanerAvailabilityView> {
    const cleaner = await this.requireSessionCleaner(actor);
    const normalized = normalizeAvailabilityWeek(week);
    const updated = await this.cleaners.update(cleaner.id, {
      availability: { week: normalized },
    });

    if (updated === null) {
      throw cleanerNotFound();
    }

    return {
      conflicts: await this.findAvailabilityConflicts(cleaner.id, normalized),
      week: normalized,
    };
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

  private async requireSessionCleaner(actor: Actor): Promise<CleanerRecord> {
    if (actor.role !== "CLEANER") {
      throw new AuthorizationError();
    }

    const cleaner = await this.cleaners.findByUserId(actor.id);

    if (cleaner === null || cleaner.status !== "ACTIVE") {
      throw new AuthorizationError();
    }

    return cleaner;
  }

  private async findAvailabilityConflicts(
    cleanerId: string,
    week: readonly CleanerWeekDayAvailability[],
  ): Promise<CleanerAvailabilityView["conflicts"]> {
    const unavailable = new Set(
      week.filter((day) => !day.available).map((day) => day.day),
    );

    if (unavailable.size === 0) {
      return [];
    }

    const upcoming = await this.bookings.list({
      cleanerId,
      excludeStatuses: CLEANER_UPCOMING_EXCLUDED_STATUSES,
      pagination: { limit: 100, page: 1, skip: 0 },
      scheduledFrom: new Date(),
      sort: { direction: "asc", field: "scheduledAt" },
    });

    return upcoming.items.flatMap((job) => {
      if (job.scheduledAt === null) {
        return [];
      }

      const weekday = weekdayFromUtc(job.scheduledAt);

      if (!unavailable.has(weekday)) {
        return [];
      }

      return [
        {
          date: job.scheduledAt.toISOString().slice(0, 10),
          jobId: job.id,
          serviceName: job.service?.name ?? null,
        },
      ];
    });
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

function emptyWeek(): CleanerWeekDayAvailability[] {
  return CLEANER_WEEKDAYS.map((day) => ({
    available: false,
    day,
    end: null,
    start: null,
  }));
}

function parseStoredAvailability(value: unknown): CleanerWeekDayAvailability[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return emptyWeek();
  }

  const week = (value as { week?: unknown }).week;

  if (!Array.isArray(week)) {
    return emptyWeek();
  }

  return normalizeAvailabilityWeek(week as CleanerWeekDayAvailability[]);
}

function normalizeAvailabilityWeek(
  week: readonly CleanerWeekDayAvailability[],
): CleanerWeekDayAvailability[] {
  const byDay = new Map(week.map((day) => [day.day, day]));

  return CLEANER_WEEKDAYS.map((day) => {
    const current = byDay.get(day);

    if (current === undefined || !current.available) {
      return { available: false, day, end: null, start: null };
    }

    return {
      available: true,
      day,
      end: current.end,
      start: current.start,
    };
  });
}

function weekdayFromUtc(value: Date): (typeof CLEANER_WEEKDAYS)[number] {
  const index = value.getUTCDay();
  const sundayFirst = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const day = sundayFirst[index];

  if (day === undefined) {
    return "monday";
  }

  return day;
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
