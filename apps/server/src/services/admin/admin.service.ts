import type { BookingStatus } from "@prisma/client";
import type { Actor } from "../../lib/domain/actor.ts";
import type { ListResult } from "../../lib/domain/list.ts";
import type { BookingService } from "../bookings/booking.service.ts";
import type { BookingRecord } from "../bookings/booking.types.ts";
import type { CatalogService } from "../catalog/catalog.service.ts";
import type { CatalogRecord } from "../catalog/catalog.types.ts";
import type { CleanerService } from "../cleaners/cleaner.service.ts";
import type { CleanerRecord } from "../cleaners/cleaner.types.ts";
import type { CustomerService } from "../customers/customer.service.ts";
import type { CustomerRecord } from "../customers/customer.types.ts";
import type { DashboardService } from "../dashboard/dashboard.service.ts";
import type { DashboardMetrics } from "../dashboard/dashboard.types.ts";
import type { ReviewService } from "../reviews/review.service.ts";
import type { ReviewRecord } from "../reviews/review.types.ts";

export class AdminService {
  private readonly bookings: BookingService;
  private readonly catalog: CatalogService;
  private readonly cleaners: CleanerService;
  private readonly customers: CustomerService;
  private readonly dashboard: DashboardService;
  private readonly reviews: ReviewService;

  public constructor(
    customers: CustomerService,
    cleaners: CleanerService,
    catalog: CatalogService,
    bookings: BookingService,
    reviews: ReviewService,
    dashboard: DashboardService,
  ) {
    this.customers = customers;
    this.cleaners = cleaners;
    this.catalog = catalog;
    this.bookings = bookings;
    this.reviews = reviews;
    this.dashboard = dashboard;
  }

  public deactivateCustomer(actor: Actor, id: string): Promise<CustomerRecord> {
    return this.customers.deactivate(actor, id);
  }

  public deactivateCleaner(actor: Actor, id: string): Promise<CleanerRecord> {
    return this.cleaners.deactivate(actor, id);
  }

  public archiveService(actor: Actor, id: string): Promise<CatalogRecord> {
    return this.catalog.archive(actor, id);
  }

  public assignCleaner(
    actor: Actor,
    bookingId: string,
    cleanerId: string,
  ): Promise<BookingRecord> {
    return this.bookings.assignCleaner(actor, bookingId, cleanerId);
  }

  public changeBookingStatus(
    actor: Actor,
    bookingId: string,
    status: BookingStatus,
  ): Promise<BookingRecord> {
    return this.bookings.changeStatus(actor, bookingId, status);
  }

  public hideReview(actor: Actor, id: string): Promise<ReviewRecord> {
    return this.reviews.hide(actor, id);
  }

  public getMetrics(actor: Actor): Promise<DashboardMetrics> {
    return this.dashboard.getMetrics(actor);
  }

  public listCustomers(actor: Actor): Promise<ListResult<CustomerRecord>> {
    return this.customers.list(actor);
  }
}
