import { type Actor, requireAdminActor } from "../../lib/domain/actor.ts";
import type { BookingRepository } from "../../repositories/booking.repository.ts";
import type { CatalogRepository } from "../../repositories/catalog.repository.ts";
import type { CleanerRepository } from "../../repositories/cleaner.repository.ts";
import type { CustomerRepository } from "../../repositories/customer.repository.ts";
import type { ReviewRepository } from "../../repositories/review.repository.ts";
import type { DashboardMetrics } from "./dashboard.types.ts";

const RECENT_BOOKING_LIMIT = 8;

export class DashboardService {
  private readonly bookings: BookingRepository;
  private readonly catalog: CatalogRepository;
  private readonly cleaners: CleanerRepository;
  private readonly customers: CustomerRepository;
  private readonly reviews: ReviewRepository;

  public constructor(
    customers: CustomerRepository,
    cleaners: CleanerRepository,
    catalog: CatalogRepository,
    bookings: BookingRepository,
    reviews: ReviewRepository,
  ) {
    this.customers = customers;
    this.cleaners = cleaners;
    this.catalog = catalog;
    this.bookings = bookings;
    this.reviews = reviews;
  }

  public async getMetrics(actor: Actor): Promise<DashboardMetrics> {
    requireAdminActor(actor);

    const [
      customerTotal,
      customerActive,
      cleanerTotal,
      cleanerActive,
      serviceTotal,
      serviceActive,
      reviewTotal,
      reviewActive,
      bookingTotal,
      pending,
      confirmed,
      assigned,
      inProgress,
      completed,
      cancelled,
      recentBookings,
    ] = await Promise.all([
      this.customers.countTotal(),
      this.customers.countByStatus("ACTIVE"),
      this.cleaners.countTotal(),
      this.cleaners.countByStatus("ACTIVE"),
      this.catalog.countTotal(),
      this.catalog.countActive(),
      this.reviews.countTotal(),
      this.reviews.countActive(),
      this.bookings.countTotal(),
      this.bookings.countByStatus("PENDING"),
      this.bookings.countByStatus("CONFIRMED"),
      this.bookings.countByStatus("ASSIGNED"),
      this.bookings.countByStatus("IN_PROGRESS"),
      this.bookings.countByStatus("COMPLETED"),
      this.bookings.countByStatus("CANCELLED"),
      this.bookings.listRecent(RECENT_BOOKING_LIMIT),
    ]);

    return {
      bookings: {
        assigned,
        cancelled,
        completed,
        confirmed,
        inProgress,
        pending,
        total: bookingTotal,
      },
      cleaners: { active: cleanerActive, total: cleanerTotal },
      customers: { active: customerActive, total: customerTotal },
      recentBookings,
      reviews: { active: reviewActive, total: reviewTotal },
      services: { active: serviceActive, total: serviceTotal },
    };
  }
}
