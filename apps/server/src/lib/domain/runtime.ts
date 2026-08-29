import { PrismaBookingRepository } from "../../repositories/booking.repository.ts";
import { PrismaCatalogRepository } from "../../repositories/catalog.repository.ts";
import { PrismaCleanerRepository } from "../../repositories/cleaner.repository.ts";
import { PrismaCustomerRepository } from "../../repositories/customer.repository.ts";
import { PrismaNotificationRepository } from "../../repositories/notification.repository.ts";
import { PrismaQuoteRepository } from "../../repositories/quote.repository.ts";
import { PrismaReviewRepository } from "../../repositories/review.repository.ts";
import { PrismaSettingsRepository } from "../../repositories/settings.repository.ts";
import { PrismaUserRepository } from "../../repositories/user.repository.ts";
import { AdminService } from "../../services/admin/admin.service.ts";
import { BookingService } from "../../services/bookings/booking.service.ts";
import { CatalogService } from "../../services/catalog/catalog.service.ts";
import { CleanerService } from "../../services/cleaners/cleaner.service.ts";
import { CustomerService } from "../../services/customers/customer.service.ts";
import { DashboardService } from "../../services/dashboard/dashboard.service.ts";
import { NotificationService } from "../../services/notifications/notification.service.ts";
import { QuoteService } from "../../services/quotes/quote.service.ts";
import { ReviewService } from "../../services/reviews/review.service.ts";
import { SettingsService } from "../../services/settings/settings.service.ts";
import { UserService } from "../../services/users/user.service.ts";

export interface DomainServices {
  admin: AdminService;
  bookings: BookingService;
  catalog: CatalogService;
  cleaners: CleanerService;
  customers: CustomerService;
  dashboard: DashboardService;
  notifications: NotificationService;
  quotes: QuoteService;
  reviews: ReviewService;
  settings: SettingsService;
  users: UserService;
}

let domainServices: DomainServices | undefined;

export function getDomainServices(): DomainServices {
  if (domainServices === undefined) {
    domainServices = createPrismaDomainServices();
  }

  return domainServices;
}

export function createPrismaDomainServices(): DomainServices {
  const customerRepo = new PrismaCustomerRepository();
  const cleanerRepo = new PrismaCleanerRepository();
  const catalogRepo = new PrismaCatalogRepository();
  const bookingRepo = new PrismaBookingRepository();
  const quoteRepo = new PrismaQuoteRepository();
  const reviewRepo = new PrismaReviewRepository();
  const notificationRepo = new PrismaNotificationRepository();
  const userRepo = new PrismaUserRepository();
  const settingsRepo = new PrismaSettingsRepository();

  const customers = new CustomerService(customerRepo);
  const cleaners = new CleanerService(cleanerRepo);
  const catalog = new CatalogService(catalogRepo);
  const quotes = new QuoteService(quoteRepo, catalogRepo);
  const bookings = new BookingService(
    bookingRepo,
    customerRepo,
    cleanerRepo,
    catalogRepo,
    quoteRepo,
  );
  const reviews = new ReviewService(reviewRepo);
  const notifications = new NotificationService(notificationRepo);
  const users = new UserService(userRepo);
  const dashboard = new DashboardService(
    customerRepo,
    cleanerRepo,
    catalogRepo,
    bookingRepo,
    reviewRepo,
  );
  const settings = new SettingsService(settingsRepo);
  const admin = new AdminService(
    customers,
    cleaners,
    catalog,
    bookings,
    reviews,
    dashboard,
  );

  return {
    admin,
    bookings,
    catalog,
    cleaners,
    customers,
    dashboard,
    notifications,
    quotes,
    reviews,
    settings,
    users,
  };
}
