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
  type CreateBookingInput,
  type CreateCustomerBookingInput,
  type CustomerBookingView,
  toCustomerBookingView,
  type UpdateBookingInput,
} from "./booking.types.ts";
import { assertBookingTransition } from "./booking-transitions.ts";

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
      const existing = await this.bookings.findByQuoteRequestId(
        input.quoteRequestId,
      );

      if (existing !== null) {
        throw new ConflictError("A booking already exists for this quote.");
      }
    }

    return this.bookings.create({
      cleanerId,
      customerId: customer.id,
      notes: input.notes ?? null,
      quoteRequestId: input.quoteRequestId ?? null,
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
    const quoteRequestId = await this.resolveOwnedQuoteRequestId(
      customer.email,
      input.quoteRequestId,
    );

    const created = await this.bookings.create({
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
    const booking = await this.bookings.findById(id);

    if (booking === null) {
      throw bookingNotFound();
    }

    const customer = await this.customers.findByUserId(identity.id);

    if (customer === null || booking.customerId !== customer.id) {
      throw bookingNotFound();
    }

    return toCustomerBookingView(booking);
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

  private async resolveOwnedQuoteRequestId(
    customerEmail: string,
    quoteRequestId: string | null | undefined,
  ): Promise<string | null> {
    if (quoteRequestId === undefined || quoteRequestId === null) {
      return null;
    }

    const quote = await this.quotes.findById(quoteRequestId);

    if (
      quote === null ||
      quote.email.toLowerCase() !== customerEmail.toLowerCase()
    ) {
      throw bookingNotFound();
    }

    const existing = await this.bookings.findByQuoteRequestId(quote.id);

    if (existing !== null) {
      throw new ConflictError("A booking already exists for this quote.");
    }

    return quote.id;
  }
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
