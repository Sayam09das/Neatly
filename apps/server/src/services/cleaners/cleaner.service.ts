import { AuthError } from "../../lib/auth/errors.ts";
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
  RateLimitError,
  ValidationError,
} from "../../lib/errors.ts";
import { parseWithSchema } from "../../lib/validations/parse.ts";
import { emailSchema } from "../../lib/validations/primitives.ts";
import type { BookingRepository } from "../../repositories/booking.repository.ts";
import type { CleanerRepository } from "../../repositories/cleaner.repository.ts";
import type { CleanerInvitationInspection } from "../auth.service.ts";
import { CLEANER_UPCOMING_EXCLUDED_STATUSES } from "../bookings/booking.types.ts";
import {
  type ActivateCleanerInvitationResult,
  CLEANER_SORT_FIELDS,
  CLEANER_WEEKDAYS,
  type CleanerAvailabilityView,
  type CleanerInvitationGateway,
  type CleanerListQuery,
  type CleanerRecord,
  type CleanerSessionView,
  type CleanerStats,
  type CleanerWeekDayAvailability,
  type CreateCleanerInput,
  type InviteCleanerInput,
  type InviteCleanerResult,
  toCleanerSessionView,
  type UpdateCleanerInput,
} from "./cleaner.types.ts";

const EXISTING_ACCOUNT_MESSAGE = "An account with this email already exists.";

export class CleanerService {
  private readonly bookings: BookingRepository;
  private readonly cleaners: CleanerRepository;
  private readonly invitations: CleanerInvitationGateway | undefined;

  public constructor(
    cleaners: CleanerRepository,
    bookings: BookingRepository,
    invitations?: CleanerInvitationGateway,
  ) {
    this.bookings = bookings;
    this.cleaners = cleaners;
    this.invitations = invitations;
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
      status: input.status,
      userId: input.userId ?? null,
    });
  }

  public async invite(
    actor: Actor,
    input: InviteCleanerInput,
    context: { ip: string },
  ): Promise<InviteCleanerResult> {
    requireAdminActor(actor);
    const invitations = this.requireInvitations();
    const name = requireName(input.name);
    const email = parseWithSchema(emailSchema, input.email);
    const phone = requirePhone(input.phone);
    const existingCleaner = await this.cleaners.findByEmail(email);

    if (existingCleaner !== null) {
      throw existingAccountError();
    }

    const existingUser = await invitations.findUserByEmail(email);

    if (existingUser === null) {
      try {
        const invited = await invitations.createInvitedStaffUser({
          email,
          name,
        });
        const cleaner = await this.cleaners.create({
          email,
          name,
          phone,
          status: "INACTIVE",
          userId: invited.userId,
        });
        return { cleaner, invitationSent: invited.invitationSent };
      } catch (error: unknown) {
        rethrowInvitationError(error);
      }
    }

    const linked = await this.cleaners.findByUserId(existingUser.id);

    if (
      linked !== null ||
      existingUser.emailVerifiedAt !== null ||
      existingUser.role !== "STAFF"
    ) {
      throw existingAccountError();
    }

    try {
      const invitationSent = await invitations.resendCleanerInvitation(
        existingUser.id,
        context,
      );
      const cleaner = await this.cleaners.create({
        email,
        name,
        phone,
        status: "INACTIVE",
        userId: existingUser.id,
      });
      return { cleaner, invitationSent };
    } catch (error: unknown) {
      rethrowInvitationError(error);
    }
  }

  public async resendInvitation(
    actor: Actor,
    id: string,
    context: { ip: string },
  ): Promise<InviteCleanerResult> {
    requireAdminActor(actor);
    const invitations = this.requireInvitations();
    const cleaner = await this.requireCleaner(id);

    if (cleaner.accountState !== "INVITED" || cleaner.userId === null) {
      throw new ValidationError("This invitation cannot be resent.");
    }

    let invitationSent = false;

    try {
      invitationSent = await invitations.resendCleanerInvitation(
        cleaner.userId,
        context,
      );
    } catch (error: unknown) {
      rethrowInvitationError(error);
    }

    return { cleaner, invitationSent };
  }

  public async inspectInvitation(
    token: string,
  ): Promise<CleanerInvitationInspection> {
    return this.requireInvitations().inspectCleanerInvitation(token);
  }

  public async activateInvitation(
    input: unknown,
    context: { ip: string },
  ): Promise<ActivateCleanerInvitationResult> {
    const invitations = this.requireInvitations();
    let session: ActivateCleanerInvitationResult;

    try {
      session = await invitations.activateCleanerInvitation(input, context);
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        throw error;
      }

      throw error;
    }

    const cleaner = await this.cleaners.findByUserId(session.user.id);

    if (cleaner === null) {
      throw new ValidationError("This invitation is no longer valid.");
    }

    const updated = await this.cleaners.update(cleaner.id, {
      emailVerifiedAt: new Date(),
      status: "ACTIVE",
    });

    if (updated === null) {
      throw cleanerNotFound();
    }

    return session;
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
    const cleaner = await this.requireCleaner(id);
    const updated = await this.cleaners.update(id, { status: "INACTIVE" });

    if (updated === null) {
      throw cleanerNotFound();
    }

    await this.syncLinkedUser(cleaner.userId, "INACTIVE");
    return updated;
  }

  public async activate(actor: Actor, id: string): Promise<CleanerRecord> {
    requireAdminActor(actor);
    const cleaner = await this.requireCleaner(id);

    if (cleaner.accountState === "INVITED") {
      throw new ValidationError(
        "This cleaner has not activated their account yet.",
      );
    }

    const updated = await this.cleaners.update(id, { status: "ACTIVE" });

    if (updated === null) {
      throw cleanerNotFound();
    }

    await this.syncLinkedUser(cleaner.userId, "ACTIVE");
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

  private requireInvitations(): CleanerInvitationGateway {
    if (this.invitations === undefined) {
      throw new ValidationError("Cleaner invitations are unavailable.");
    }

    return this.invitations;
  }

  private async requireCleaner(id: string): Promise<CleanerRecord> {
    const cleaner = await this.cleaners.findById(id);

    if (cleaner === null) {
      throw cleanerNotFound();
    }

    return cleaner;
  }

  private async syncLinkedUser(
    userId: string | null,
    status: "ACTIVE" | "INACTIVE",
  ): Promise<void> {
    if (userId === null || this.invitations === undefined) {
      return;
    }

    const user = await this.invitations.findUserById(userId);

    if (user === null) {
      return;
    }

    await this.invitations.setUserStatus(userId, status);

    if (status === "INACTIVE") {
      await this.invitations.revokeAllSessions(userId);
    }
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

function requirePhone(phone: string): string {
  const trimmed = phone.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field: "phone", issue: "Enter a phone number." },
    ]);
  }

  return trimmed;
}

function existingAccountError(): ValidationError {
  return new ValidationError("Validation failed.", [
    { field: "email", issue: EXISTING_ACCOUNT_MESSAGE },
  ]);
}

function rethrowInvitationError(error: unknown): never {
  if (error instanceof AuthError) {
    if (error.code === "RATE_LIMITED") {
      throw new RateLimitError();
    }

    if (error.code === "INVALID_INPUT") {
      throw new ValidationError(error.message, error.details);
    }
  }

  throw error;
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
