import {
  type Actor,
  isAdminActor,
  requireAdminActor,
  type SessionCustomerIdentity,
} from "../../lib/domain/actor.ts";
import { bookingNotFound, reviewNotFound } from "../../lib/domain/errors.ts";
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
import type { CustomerRepository } from "../../repositories/customer.repository.ts";
import type { ReviewRepository } from "../../repositories/review.repository.ts";
import type { BookingRecord } from "../bookings/booking.types.ts";
import {
  type CreateReviewInput,
  type CustomerReviewView,
  type CustomerReviewWorkspace,
  REVIEW_SORT_FIELDS,
  type ReviewListQuery,
  type ReviewRecord,
  type UpdateReviewInput,
} from "./review.types.ts";

const RATING_MIN = 1;
const RATING_MAX = 5;

const CUSTOMER_ELIGIBLE_REVIEW_LIMIT = 50;

export class ReviewService {
  private readonly bookings: BookingRepository;
  private readonly customers: CustomerRepository;
  private readonly reviews: ReviewRepository;

  public constructor(
    reviews: ReviewRepository,
    customers: CustomerRepository,
    bookings: BookingRepository,
  ) {
    this.reviews = reviews;
    this.customers = customers;
    this.bookings = bookings;
  }

  public async create(
    actor: Actor,
    input: CreateReviewInput,
  ): Promise<ReviewRecord> {
    requireAdminActor(actor);
    return this.reviews.create({
      ...input,
      content: requireText(input.content, "content"),
      customerName: requireText(input.customerName, "customerName"),
      rating: requireRating(input.rating),
    });
  }

  public async getById(id: string, actor?: Actor): Promise<ReviewRecord> {
    const review = await this.reviews.findById(id);

    if (review === null || (!review.isActive && !isAdminViewer(actor))) {
      throw reviewNotFound();
    }

    return review;
  }

  public async list(
    query: ReviewListQuery = {},
    actor?: Actor,
  ): Promise<ListResult<ReviewRecord>> {
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, REVIEW_SORT_FIELDS);
    const result = await this.reviews.list({
      ...query,
      active: isAdminViewer(actor) ? query.active : true,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateReviewInput,
  ): Promise<ReviewRecord> {
    requireAdminActor(actor);
    await this.getById(id, actor);
    const updated = await this.reviews.update(id, {
      ...input,
      content:
        input.content === undefined
          ? undefined
          : requireText(input.content, "content"),
      customerName:
        input.customerName === undefined
          ? undefined
          : requireText(input.customerName, "customerName"),
      rating:
        input.rating === undefined ? undefined : requireRating(input.rating),
    });

    if (updated === null) {
      throw reviewNotFound();
    }

    return updated;
  }

  public async hide(actor: Actor, id: string): Promise<ReviewRecord> {
    requireAdminActor(actor);
    await this.getById(id, actor);
    const updated = await this.reviews.update(id, { isActive: false });

    if (updated === null) {
      throw reviewNotFound();
    }

    return updated;
  }

  public async listForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): Promise<CustomerReviewWorkspace> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.customers.findByUserId(identity.id);

    if (customer === null) {
      return { eligibleBookings: [], reviews: [] };
    }

    const [ownedReviews, completed] = await Promise.all([
      this.reviews.list({
        customerId: customer.id,
        pagination: { limit: 50, page: 1, skip: 0 },
        sort: { direction: "desc", field: "createdAt" },
      }),
      this.bookings.list({
        customerId: customer.id,
        pagination: {
          limit: CUSTOMER_ELIGIBLE_REVIEW_LIMIT,
          page: 1,
          skip: 0,
        },
        sort: { direction: "desc", field: "scheduledAt" },
        status: "COMPLETED",
      }),
    ]);

    const bookingsById = new Map(
      completed.items.map((booking) => [booking.id, booking]),
    );

    for (const review of ownedReviews.items) {
      if (review.bookingId === null || bookingsById.has(review.bookingId)) {
        continue;
      }

      const booking = await this.bookings.findById(review.bookingId);

      if (booking !== null) {
        bookingsById.set(booking.id, booking);
      }
    }

    const reviewedBookingIds = new Set(
      ownedReviews.items
        .map((review) => review.bookingId)
        .filter((id): id is string => id !== null),
    );

    return {
      eligibleBookings: completed.items
        .filter((booking) => !reviewedBookingIds.has(booking.id))
        .map((booking) => ({
          id: booking.id,
          scheduledAt:
            booking.scheduledAt === null
              ? null
              : booking.scheduledAt.toISOString(),
          service: booking.service,
          status: "COMPLETED" as const,
        })),
      reviews: ownedReviews.items
        .filter((review) => review.bookingId !== null)
        .map((review) =>
          toCustomerReviewView(
            review,
            review.bookingId === null
              ? null
              : (bookingsById.get(review.bookingId) ?? null),
          ),
        ),
    };
  }

  public async createForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    input: { bookingId: string; content: string; rating: number },
  ): Promise<CustomerReviewView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.requireSessionCustomer(identity);
    const booking = await this.requireOwnedCompletedBooking(
      customer.id,
      input.bookingId,
    );
    const existing = await this.reviews.findByBookingId(booking.id);

    if (existing !== null) {
      throw new ConflictError("You've already reviewed this booking.");
    }

    try {
      const created = await this.reviews.create({
        bookingId: booking.id,
        content: requireText(input.content, "content"),
        customerId: customer.id,
        customerName: customer.name,
        isActive: false,
        isFeatured: false,
        rating: requireRating(input.rating),
      });

      return toCustomerReviewView(created, booking);
    } catch {
      const raced = await this.reviews.findByBookingId(booking.id);

      if (raced !== null) {
        throw new ConflictError("You've already reviewed this booking.");
      }

      throw new ConflictError("This review could not be saved.");
    }
  }

  public async updateForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    id: string,
    input: { content?: string; rating?: number },
  ): Promise<CustomerReviewView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.requireSessionCustomer(identity);
    const review = await this.requireOwnedCustomerReview(customer.id, id);
    const updated = await this.reviews.update(review.id, {
      content:
        input.content === undefined
          ? undefined
          : requireText(input.content, "content"),
      rating:
        input.rating === undefined ? undefined : requireRating(input.rating),
    });

    if (updated === null) {
      throw reviewNotFound();
    }

    return toCustomerReviewView(
      updated,
      await this.loadBooking(updated.bookingId),
    );
  }

  public async hideForCustomer(
    actor: Actor,
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerReviewView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.requireSessionCustomer(identity);
    const review = await this.requireOwnedCustomerReview(customer.id, id);

    if (!review.isActive) {
      return toCustomerReviewView(
        review,
        await this.loadBooking(review.bookingId),
      );
    }

    const updated = await this.reviews.update(review.id, { isActive: false });

    if (updated === null) {
      throw reviewNotFound();
    }

    return toCustomerReviewView(
      updated,
      await this.loadBooking(updated.bookingId),
    );
  }

  private async requireSessionCustomer(
    identity: SessionCustomerIdentity,
  ): Promise<{ id: string; name: string }> {
    const customer = await this.customers.findByUserId(identity.id);

    if (customer === null) {
      throw bookingNotFound();
    }

    return customer;
  }

  private async requireOwnedCompletedBooking(
    customerId: string,
    bookingId: string,
  ): Promise<BookingRecord> {
    const booking = await this.bookings.findById(bookingId);

    if (booking === null || booking.customerId !== customerId) {
      throw bookingNotFound();
    }

    if (booking.status !== "COMPLETED") {
      throw new ConflictError("This booking is not ready for a review.");
    }

    return booking;
  }

  private async requireOwnedCustomerReview(
    customerId: string,
    id: string,
  ): Promise<ReviewRecord> {
    const review = await this.reviews.findById(id);

    if (review === null || review.customerId !== customerId) {
      throw reviewNotFound();
    }

    return review;
  }

  private async loadBooking(
    bookingId: string | null,
  ): Promise<BookingRecord | null> {
    if (bookingId === null) {
      return null;
    }

    return this.bookings.findById(bookingId);
  }

  private assertCustomerActor(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): void {
    if (actor.id !== identity.id || actor.role !== "CUSTOMER") {
      throw new AuthorizationError();
    }
  }
}

function toCustomerReviewView(
  review: ReviewRecord,
  booking: BookingRecord | null,
): CustomerReviewView {
  return {
    bookingId: review.bookingId ?? booking?.id ?? "",
    content: review.content,
    createdAt: review.createdAt.toISOString(),
    id: review.id,
    rating: review.rating,
    serviceName: booking?.service?.name ?? null,
    status: review.isActive ? "published" : "pending",
  };
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field, issue: "This field is required." },
    ]);
  }

  return trimmed;
}

function requireRating(rating: number): number {
  if (!Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX) {
    throw new ValidationError("Validation failed.", [
      { field: "rating", issue: "Enter a rating from 1 to 5." },
    ]);
  }

  return rating;
}

function isAdminViewer(actor: Actor | undefined): boolean {
  return actor !== undefined && isAdminActor(actor);
}
