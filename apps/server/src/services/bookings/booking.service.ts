import type { BookingStatus } from "@prisma/client";
import { CUSTOMER_BOOKING_LEAD_MS } from "../../config/bookings.ts";
import {
  type Actor,
  isAdminActor,
  requireAdminActor,
  type SessionCustomerIdentity,
} from "../../lib/domain/actor.ts";
import {
  bookingConflict,
  bookingNotFound,
  catalogItemNotFound,
  cleanerNotAvailable,
  cleanerNotFound,
  customerNotFound,
  quoteAlreadyConverted,
  quoteNotAccepted,
  quoteRequestNotFound,
} from "../../lib/domain/errors.ts";
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
import type { BookingRepository } from "../../repositories/booking.repository.ts";
import type { CatalogRepository } from "../../repositories/catalog.repository.ts";
import type { CleanerRepository } from "../../repositories/cleaner.repository.ts";
import type { CustomerRepository } from "../../repositories/customer.repository.ts";
import type { QuoteRepository } from "../../repositories/quote.repository.ts";
import {
  BOOKING_SORT_FIELDS,
  type BookingListQuery,
  type BookingRecord,
  CLEANER_OVERVIEW_TODAY_LIMIT,
  CLEANER_UPCOMING_EXCLUDED_STATUSES,
  type CleanerJobListQuery,
  type CleanerJobView,
  type CleanerOverview,
  type CleanerScheduleView,
  type CreateBookingInput,
  type CreateCustomerBookingInput,
  CUSTOMER_OVERVIEW_RECENT_LIMIT,
  CUSTOMER_UPCOMING_EXCLUDED_STATUSES,
  type CustomerBookingListQuery,
  type CustomerBookingView,
  type CustomerOverview,
  toCleanerJobView,
  toCustomerBookingView,
  type UpdateBookingInput,
} from "./booking.types.ts";
import {
  assertBookingTransition,
  customerMayCancelBooking,
  customerMayUpdateBooking,
} from "./booking-transitions.ts";

export class BookingService {
  private readonly bookings: BookingRepository;
  private readonly catalog: CatalogRepository;
  private readonly cleaners: CleanerRepository;
  private readonly customers: CustomerRepository;
  private readonly quotes: QuoteRepository;

  public constructor(
    bookings: BookingRepository,
    customers: CustomerRepository,
    cleaners: CleanerRepository,
    catalog: CatalogRepository,
    quotes: QuoteRepository,
  ) {
    this.bookings = bookings;
    this.customers = customers;
    this.cleaners = cleaners;
    this.catalog = catalog;
    this.quotes = quotes;
  }

  public async create(
    actor: Actor,
    input: CreateBookingInput,
  ): Promise<BookingRecord> {
    requireAdminActor(actor);
    const customer = await this.customers.findById(input.customerId);

    if (customer === null) {
      throw customerNotFound();
    }

    if (customer.status !== "ACTIVE") {
      throw new ConflictError("This customer is not active.");
    }

    const offering = await this.catalog.findById(input.serviceId);

    if (offering === null) {
      throw catalogItemNotFound();
    }

    if (!offering.isActive) {
      throw new ConflictError("This service offering is not active.");
    }

    const cleanerId = input.cleanerId ?? null;

    if (cleanerId !== null) {
      await this.requireActiveCleaner(cleanerId);
    }

    if (input.quoteRequestId !== undefined && input.quoteRequestId !== null) {
      return this.createLinkedBooking({
        cleanerId,
        customerId: customer.id,
        notes: input.notes ?? null,
        quoteRequestId: input.quoteRequestId,
        scheduledAt: input.scheduledAt ?? null,
        serviceAddress: input.serviceAddress ?? null,
        serviceId: offering.id,
        status: cleanerId === null ? "PENDING" : "ASSIGNED",
      });
    }

    return this.bookings.create({
      cleanerId,
      customerId: customer.id,
      notes: input.notes ?? null,
      quoteRequestId: null,
      scheduledAt: input.scheduledAt ?? null,
      serviceAddress: input.serviceAddress ?? null,
      serviceId: offering.id,
      status: cleanerId === null ? "PENDING" : "ASSIGNED",
    });
  }

  public async createForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    input: CreateCustomerBookingInput,
  ): Promise<CustomerBookingView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.requireSessionCustomer(identity);
    const offering = await this.requireActiveOffering(input.serviceId);
    this.assertFutureSchedule(input.scheduledAt);
    const quoteRequestId = await this.requireOwnedAcceptedQuoteId(
      customer.email,
      input.quoteRequestId,
      offering.id,
    );
    const created = await this.createLinkedBooking({
      cleanerId: null,
      customerId: customer.id,
      notes: emptyToNull(input.notes),
      quoteRequestId,
      scheduledAt: input.scheduledAt,
      serviceAddress: input.serviceAddress.trim(),
      serviceId: offering.id,
      status: "PENDING",
    });

    return toCustomerBookingView(created);
  }

  public async getCustomerBooking(
    actor: Actor,
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerBookingView> {
    this.assertCustomerActor(actor, identity);
    const booking = await this.requireOwnedCustomerBooking(identity, id);
    return toCustomerBookingView(booking);
  }

  public async cancelForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerBookingView> {
    this.assertCustomerActor(actor, identity);
    const booking = await this.requireOwnedCustomerBooking(identity, id);

    if (!customerMayCancelBooking(booking.status)) {
      throw new ConflictError("This booking can no longer be cancelled.");
    }

    assertBookingTransition(booking.status, "CANCELLED");
    const updated = await this.bookings.compareAndUpdate(
      booking.id,
      booking.status,
      { status: "CANCELLED" },
    );

    if (updated === null) {
      throw bookingConflict();
    }

    return toCustomerBookingView(updated);
  }

  public async updateForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    id: string,
    input: UpdateBookingInput,
  ): Promise<CustomerBookingView> {
    this.assertCustomerActor(actor, identity);
    const booking = await this.requireOwnedCustomerBooking(identity, id);

    if (!customerMayUpdateBooking(booking.status)) {
      throw new ConflictError("This booking can no longer be updated.");
    }

    if (input.scheduledAt !== undefined && input.scheduledAt !== null) {
      this.assertFutureSchedule(input.scheduledAt);
    }

    const updated = await this.bookings.compareAndUpdate(
      booking.id,
      booking.status,
      {
        notes: input.notes,
        scheduledAt: input.scheduledAt,
        serviceAddress: input.serviceAddress,
        status: booking.status,
      },
    );

    if (updated === null) {
      throw bookingConflict();
    }

    return toCustomerBookingView(updated);
  }

  public async listForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    query: CustomerBookingListQuery = {},
  ): Promise<ListResult<CustomerBookingView>> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.customers.findByUserId(identity.id);
    const pagination = resolvePagination(query.pagination);

    if (customer === null) {
      return toListResult([], 0, pagination);
    }

    const scoped = this.toScopedCustomerListQuery(customer.id, query);
    const sort = resolveSort(scoped.sort, BOOKING_SORT_FIELDS);
    const result = await this.bookings.list({ ...scoped, pagination, sort });
    return toListResult(
      result.items.map(toCustomerBookingView),
      result.total,
      pagination,
    );
  }

  public async getCustomerOverview(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): Promise<CustomerOverview> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.customers.findByUserId(identity.id);

    if (customer === null) {
      return emptyCustomerOverview();
    }

    const now = new Date();
    const upcomingQuery: BookingListQuery = {
      customerId: customer.id,
      excludeStatuses: CUSTOMER_UPCOMING_EXCLUDED_STATUSES,
      pagination: { limit: 1, page: 1, skip: 0 },
      scheduledFrom: now,
      sort: { direction: "asc", field: "scheduledAt" },
    };

    const [upcoming, recent, pending, completed, all] = await Promise.all([
      this.bookings.list(upcomingQuery),
      this.bookings.list({
        customerId: customer.id,
        pagination: {
          limit: CUSTOMER_OVERVIEW_RECENT_LIMIT,
          page: 1,
          skip: 0,
        },
        sort: { direction: "desc", field: "createdAt" },
      }),
      this.bookings.list({
        customerId: customer.id,
        pagination: { limit: 1, page: 1, skip: 0 },
        status: "PENDING",
      }),
      this.bookings.list({
        customerId: customer.id,
        pagination: { limit: 1, page: 1, skip: 0 },
        status: "COMPLETED",
      }),
      this.bookings.list({
        customerId: customer.id,
        pagination: { limit: 1, page: 1, skip: 0 },
      }),
    ]);

    return {
      recentBookings: recent.items.map(toCustomerBookingView),
      summary: {
        completed: completed.total,
        pending: pending.total,
        total: all.total,
        upcoming: upcoming.total,
      },
      upcomingBooking:
        upcoming.items[0] === undefined
          ? null
          : toCustomerBookingView(upcoming.items[0]),
    };
  }

  public async listForCleaner(
    actor: Actor,
    query: CleanerJobListQuery = {},
  ): Promise<ListResult<CleanerJobView>> {
    const cleaner = await this.requireSessionCleaner(actor);
    const pagination = resolvePagination(query.pagination);
    const scoped = this.toScopedCleanerListQuery(cleaner.id, query);
    const sort = resolveSort(scoped.sort, BOOKING_SORT_FIELDS);
    const result = await this.bookings.list({ ...scoped, pagination, sort });
    return toListResult(
      result.items.map(toCleanerJobView),
      result.total,
      pagination,
    );
  }

  public async getCleanerJob(
    actor: Actor,
    id: string,
  ): Promise<CleanerJobView> {
    const cleaner = await this.requireSessionCleaner(actor);
    const booking = await this.bookings.findById(id);

    if (booking === null || booking.cleanerId !== cleaner.id) {
      throw bookingNotFound();
    }

    return toCleanerJobView(booking);
  }

  public async getCleanerOverview(actor: Actor): Promise<CleanerOverview> {
    const cleaner = await this.requireSessionCleaner(actor);
    const now = new Date();
    const todayStart = utcDayStart(now);
    const todayEnd = utcDayEnd(now);

    const upcomingQuery: BookingListQuery = {
      cleanerId: cleaner.id,
      excludeStatuses: CLEANER_UPCOMING_EXCLUDED_STATUSES,
      pagination: { limit: 1, page: 1, skip: 0 },
      scheduledFrom: now,
      sort: { direction: "asc", field: "scheduledAt" },
    };

    const [upcoming, assignedToday, completedToday, inProgress, todayJobs] =
      await Promise.all([
        this.bookings.list(upcomingQuery),
        this.bookings.list({
          cleanerId: cleaner.id,
          excludeStatuses: ["CANCELLED"],
          pagination: { limit: 1, page: 1, skip: 0 },
          scheduledFrom: todayStart,
          scheduledTo: todayEnd,
        }),
        this.bookings.list({
          cleanerId: cleaner.id,
          pagination: { limit: 1, page: 1, skip: 0 },
          scheduledFrom: todayStart,
          scheduledTo: todayEnd,
          status: "COMPLETED",
        }),
        this.bookings.list({
          cleanerId: cleaner.id,
          pagination: { limit: 1, page: 1, skip: 0 },
          status: "IN_PROGRESS",
        }),
        this.bookings.list({
          cleanerId: cleaner.id,
          excludeStatuses: ["CANCELLED"],
          pagination: {
            limit: CLEANER_OVERVIEW_TODAY_LIMIT,
            page: 1,
            skip: 0,
          },
          scheduledFrom: todayStart,
          scheduledTo: todayEnd,
          sort: { direction: "asc", field: "scheduledAt" },
        }),
      ]);

    return {
      nextJob:
        upcoming.items[0] === undefined
          ? null
          : toCleanerJobView(upcoming.items[0]),
      summary: {
        assignedToday: assignedToday.total,
        completedToday: completedToday.total,
        inProgress: inProgress.total,
        upcoming: upcoming.total,
      },
      todayJobs: todayJobs.items.map(toCleanerJobView),
    };
  }

  public async getCleanerSchedule(
    actor: Actor,
    date: Date = new Date(),
  ): Promise<CleanerScheduleView> {
    const cleaner = await this.requireSessionCleaner(actor);
    const dayStart = utcDayStart(date);
    const dayEnd = utcDayEnd(date);
    const weekStart = utcWeekStart(dayStart);
    const weekEnd = utcDayEnd(
      new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
    );
    const now = new Date();

    const [dayJobs, weekJobs, upcoming] = await Promise.all([
      this.bookings.list({
        cleanerId: cleaner.id,
        pagination: { limit: 50, page: 1, skip: 0 },
        scheduledFrom: dayStart,
        scheduledTo: dayEnd,
        sort: { direction: "asc", field: "scheduledAt" },
      }),
      this.bookings.list({
        cleanerId: cleaner.id,
        pagination: { limit: 100, page: 1, skip: 0 },
        scheduledFrom: weekStart,
        scheduledTo: weekEnd,
        sort: { direction: "asc", field: "scheduledAt" },
      }),
      this.bookings.list({
        cleanerId: cleaner.id,
        excludeStatuses: CLEANER_UPCOMING_EXCLUDED_STATUSES,
        pagination: { limit: 1, page: 1, skip: 0 },
        scheduledFrom: now,
        sort: { direction: "asc", field: "scheduledAt" },
      }),
    ]);

    const first = dayJobs.items[0];

    return {
      date: toUtcDateParam(dayStart),
      jobs: dayJobs.items.map(toCleanerJobView),
      nextJob:
        upcoming.items[0] === undefined
          ? null
          : toCleanerJobView(upcoming.items[0]),
      summary: {
        firstStart:
          first?.scheduledAt === undefined || first.scheduledAt === null
            ? null
            : first.scheduledAt.toISOString(),
        jobCount: dayJobs.total,
      },
      week: Array.from({ length: 7 }, (_, index) => {
        const current = new Date(
          weekStart.getTime() + index * 24 * 60 * 60 * 1000,
        );
        const currentKey = toUtcDateParam(current);
        return {
          date: currentKey,
          jobCount: weekJobs.items.filter((job) => {
            if (job.scheduledAt === null) {
              return false;
            }

            return toUtcDateParam(job.scheduledAt) === currentKey;
          }).length,
        };
      }),
    };
  }

  public async startCleanerJob(
    actor: Actor,
    id: string,
  ): Promise<CleanerJobView> {
    return this.transitionCleanerJob(actor, id, "IN_PROGRESS");
  }

  public async completeCleanerJob(
    actor: Actor,
    id: string,
  ): Promise<CleanerJobView> {
    return this.transitionCleanerJob(actor, id, "COMPLETED");
  }

  public async getById(actor: Actor, id: string): Promise<BookingRecord> {
    const booking = await this.bookings.findById(id);

    if (booking === null) {
      throw bookingNotFound();
    }

    await this.assertBookingAccess(actor, booking);
    return booking;
  }

  public async list(
    actor: Actor,
    query: BookingListQuery = {},
  ): Promise<ListResult<BookingRecord>> {
    const scoped = await this.scopedListQuery(actor, query);
    const pagination = resolvePagination(scoped.pagination);
    const sort = resolveSort(scoped.sort, BOOKING_SORT_FIELDS);
    const result = await this.bookings.list({ ...scoped, pagination, sort });
    return toListResult(result.items, result.total, pagination);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateBookingInput,
  ): Promise<BookingRecord> {
    requireAdminActor(actor);
    const booking = await this.requireBooking(id);

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      throw new ConflictError("This booking can no longer be updated.");
    }

    const updated = await this.bookings.update(id, input);

    if (updated === null) {
      throw bookingNotFound();
    }

    return updated;
  }

  public async assignCleaner(
    actor: Actor,
    bookingId: string,
    cleanerId: string,
  ): Promise<BookingRecord> {
    requireAdminActor(actor);
    const booking = await this.requireBooking(bookingId);
    await this.requireActiveCleaner(cleanerId);

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      throw new ConflictError("This booking can no longer be assigned.");
    }

    const nextStatus: BookingStatus =
      booking.status === "PENDING" || booking.status === "CONFIRMED"
        ? "ASSIGNED"
        : booking.status;

    if (nextStatus !== booking.status) {
      assertBookingTransition(booking.status, nextStatus);
    }

    const updated = await this.bookings.compareAndUpdate(
      booking.id,
      booking.status,
      { cleanerId, status: nextStatus },
    );

    if (updated === null) {
      throw bookingConflict();
    }

    return updated;
  }

  public async changeStatus(
    actor: Actor,
    bookingId: string,
    nextStatus: BookingStatus,
  ): Promise<BookingRecord> {
    requireAdminActor(actor);
    const booking = await this.requireBooking(bookingId);
    assertBookingTransition(booking.status, nextStatus);

    if (nextStatus === "ASSIGNED" && booking.cleanerId === null) {
      throw new ConflictError("Assign a cleaner before this status.");
    }

    const updated = await this.bookings.compareAndUpdate(
      booking.id,
      booking.status,
      { status: nextStatus },
    );

    if (updated === null) {
      throw bookingConflict();
    }

    return updated;
  }

  public async cancel(actor: Actor, bookingId: string): Promise<BookingRecord> {
    return this.changeStatus(actor, bookingId, "CANCELLED");
  }

  public async complete(
    actor: Actor,
    bookingId: string,
  ): Promise<BookingRecord> {
    return this.changeStatus(actor, bookingId, "COMPLETED");
  }

  private async requireOwnedCustomerBooking(
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<BookingRecord> {
    const booking = await this.bookings.findById(id);

    if (booking === null) {
      throw bookingNotFound();
    }

    const customer = await this.customers.findByUserId(identity.id);

    if (customer === null || booking.customerId !== customer.id) {
      throw bookingNotFound();
    }

    return booking;
  }

  private async requireBooking(id: string): Promise<BookingRecord> {
    const booking = await this.bookings.findById(id);

    if (booking === null) {
      throw bookingNotFound();
    }

    return booking;
  }

  private async requireActiveCleaner(cleanerId: string): Promise<void> {
    const cleaner = await this.cleaners.findById(cleanerId);

    if (cleaner === null) {
      throw cleanerNotFound();
    }

    if (cleaner.status !== "ACTIVE") {
      throw cleanerNotAvailable();
    }
  }

  private async assertBookingAccess(
    actor: Actor,
    booking: BookingRecord,
  ): Promise<void> {
    if (isAdminActor(actor)) {
      return;
    }

    if (actor.role === "CUSTOMER" && booking.customerId !== null) {
      const customer = await this.customers.findById(booking.customerId);

      if (customer !== null && customer.userId === actor.id) {
        return;
      }
    }

    if (actor.role === "CLEANER" && booking.cleanerId !== null) {
      const cleaner = await this.cleaners.findById(booking.cleanerId);

      if (cleaner !== null && cleaner.userId === actor.id) {
        return;
      }
    }

    throw new AuthorizationError();
  }

  private async scopedListQuery(
    actor: Actor,
    query: BookingListQuery,
  ): Promise<BookingListQuery> {
    if (isAdminActor(actor)) {
      return query;
    }

    if (actor.role === "CUSTOMER") {
      const customer = await this.customers.findByUserId(actor.id);

      if (customer === null) {
        throw new AuthorizationError();
      }

      return { ...query, customerId: customer.id };
    }

    if (actor.role === "CLEANER") {
      const cleaner = await this.cleaners.findByUserId(actor.id);

      if (cleaner === null) {
        throw new AuthorizationError();
      }

      return { ...query, cleanerId: cleaner.id };
    }

    throw new AuthorizationError();
  }

  private async transitionCleanerJob(
    actor: Actor,
    id: string,
    nextStatus: BookingStatus,
  ): Promise<CleanerJobView> {
    if (nextStatus !== "IN_PROGRESS" && nextStatus !== "COMPLETED") {
      throw new AuthorizationError();
    }

    const cleaner = await this.requireSessionCleaner(actor);
    const booking = await this.bookings.findById(id);

    if (booking === null || booking.cleanerId !== cleaner.id) {
      throw bookingNotFound();
    }

    assertBookingTransition(booking.status, nextStatus);
    const updated = await this.bookings.compareAndUpdate(
      booking.id,
      booking.status,
      { status: nextStatus },
    );

    if (updated === null) {
      throw bookingConflict();
    }

    return toCleanerJobView(updated);
  }

  private async requireSessionCleaner(actor: Actor): Promise<{
    id: string;
    status: "ACTIVE" | "INACTIVE";
  }> {
    if (actor.role !== "CLEANER") {
      throw new AuthorizationError();
    }

    const cleaner = await this.cleaners.findByUserId(actor.id);

    if (cleaner === null || cleaner.status !== "ACTIVE") {
      throw new AuthorizationError();
    }

    return cleaner;
  }

  private toScopedCleanerListQuery(
    cleanerId: string,
    query: CleanerJobListQuery,
  ): BookingListQuery {
    const now = new Date();
    const upcoming = query.window === "upcoming";
    const today = query.window === "today";

    return {
      cleanerId,
      excludeStatuses:
        query.status !== undefined
          ? undefined
          : today
            ? (["CANCELLED"] as const)
            : upcoming
              ? CLEANER_UPCOMING_EXCLUDED_STATUSES
              : undefined,
      pagination: query.pagination,
      scheduledFrom: today ? utcDayStart(now) : upcoming ? now : undefined,
      scheduledTo: today
        ? utcDayEnd(now)
        : query.window === "past"
          ? now
          : undefined,
      search: query.search,
      sort: {
        direction: query.window === "past" ? "desc" : "asc",
        field: "scheduledAt",
      },
      status: query.status,
    };
  }

  private toScopedCustomerListQuery(
    customerId: string,
    query: CustomerBookingListQuery,
  ): BookingListQuery {
    const now = new Date();
    const upcoming = query.window === "upcoming";

    return {
      customerId,
      excludeStatuses:
        upcoming && query.status === undefined
          ? CUSTOMER_UPCOMING_EXCLUDED_STATUSES
          : undefined,
      pagination: query.pagination,
      scheduledFrom: upcoming ? now : undefined,
      scheduledTo: query.window === "past" ? now : undefined,
      search: query.search,
      sort: {
        direction: upcoming ? "asc" : "desc",
        field: "scheduledAt",
      },
      status: query.status,
    };
  }

  private assertCustomerActor(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): void {
    if (actor.id !== identity.id || actor.role !== "CUSTOMER") {
      throw new AuthorizationError();
    }
  }

  private async requireSessionCustomer(
    identity: SessionCustomerIdentity,
  ): Promise<{
    email: string;
    id: string;
    status: "ACTIVE" | "INACTIVE";
  }> {
    const byUser = await this.customers.findByUserId(identity.id);

    if (byUser !== null) {
      if (byUser.status !== "ACTIVE") {
        throw new ConflictError("This customer is not active.");
      }

      return byUser;
    }

    const byEmail = await this.customers.findByEmail(identity.email);

    if (byEmail !== null) {
      if (byEmail.userId !== null && byEmail.userId !== identity.id) {
        throw new ConflictError("This account cannot create a booking.");
      }

      const linked = await this.customers.update(byEmail.id, {
        userId: identity.id,
      });

      if (linked === null || linked.status !== "ACTIVE") {
        throw new ConflictError("This customer is not active.");
      }

      return linked;
    }

    return this.customers.create({
      email: identity.email,
      name: identity.name,
      userId: identity.id,
    });
  }

  private async requireActiveOffering(serviceId: string): Promise<{
    id: string;
    isActive: boolean;
  }> {
    const offering = await this.catalog.findById(serviceId);

    if (offering === null) {
      throw catalogItemNotFound();
    }

    if (!offering.isActive) {
      throw new ConflictError("This service is not available.");
    }

    return offering;
  }

  private assertFutureSchedule(scheduledAt: Date): void {
    const min = new Date(Date.now() + CUSTOMER_BOOKING_LEAD_MS);

    if (scheduledAt.getTime() < min.getTime()) {
      throw new ValidationError("Validation failed.", [
        {
          field: "scheduledAt",
          issue: "Choose a time at least 24 hours from now.",
        },
      ]);
    }
  }

  private async requireOwnedAcceptedQuoteId(
    customerEmail: string,
    quoteRequestId: string,
    serviceId: string,
  ): Promise<string> {
    const quote = await this.quotes.findById(quoteRequestId);

    if (
      quote === null ||
      quote.email.toLowerCase() !== customerEmail.toLowerCase()
    ) {
      throw quoteRequestNotFound();
    }

    if (quote.status === "CONVERTED") {
      throw quoteAlreadyConverted();
    }

    if (quote.status !== "ACCEPTED") {
      throw quoteNotAccepted();
    }

    if (quote.serviceId !== null && quote.serviceId !== serviceId) {
      throw new ValidationError("Validation failed.", [
        {
          field: "serviceId",
          issue: "Choose the service from this quote.",
        },
      ]);
    }

    return quote.id;
  }

  private async createLinkedBooking(
    input: CreateBookingInput & {
      quoteRequestId: string;
      status?: BookingRecord["status"];
    },
  ): Promise<BookingRecord> {
    const result = await this.bookings.createFromAcceptedQuote(input);

    if (result.ok) {
      return result.booking;
    }

    if (result.reason === "DUPLICATE") {
      throw quoteAlreadyConverted();
    }

    if (result.reason === "NOT_FOUND") {
      throw quoteRequestNotFound();
    }

    throw quoteNotAccepted();
  }
}

function emptyCustomerOverview(): CustomerOverview {
  return {
    recentBookings: [],
    summary: {
      completed: 0,
      pending: 0,
      total: 0,
      upcoming: 0,
    },
    upcomingBooking: null,
  };
}

function utcDayStart(now: Date): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function utcDayEnd(now: Date): Date {
  return new Date(utcDayStart(now).getTime() + 24 * 60 * 60 * 1000 - 1);
}

function utcWeekStart(now: Date): Date {
  const start = utcDayStart(now);
  const weekday = start.getUTCDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  return new Date(start.getTime() - offset * 24 * 60 * 60 * 1000);
}

function toUtcDateParam(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
