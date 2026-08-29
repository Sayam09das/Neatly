import { randomUUID } from "node:crypto";
import { resolvePagination } from "../../../apps/server/src/lib/domain/list.ts";
import type {
  PaginationQuery,
  SortQuery,
} from "../../../apps/server/src/lib/query.ts";
import type { BookingRepository } from "../../../apps/server/src/repositories/booking.repository.ts";
import type { CatalogRepository } from "../../../apps/server/src/repositories/catalog.repository.ts";
import type { CleanerRepository } from "../../../apps/server/src/repositories/cleaner.repository.ts";
import type { CustomerRepository } from "../../../apps/server/src/repositories/customer.repository.ts";
import type { NotificationRepository } from "../../../apps/server/src/repositories/notification.repository.ts";
import type { QuoteRepository } from "../../../apps/server/src/repositories/quote.repository.ts";
import type { ReviewRepository } from "../../../apps/server/src/repositories/review.repository.ts";
import type { SettingsRepository } from "../../../apps/server/src/repositories/settings.repository.ts";
import type { UserRepository } from "../../../apps/server/src/repositories/user.repository.ts";
import { AdminService } from "../../../apps/server/src/services/admin/admin.service.ts";
import { BookingService } from "../../../apps/server/src/services/bookings/booking.service.ts";
import type {
  BookingListQuery,
  BookingRecord,
  CreateBookingInput,
  UpdateBookingInput,
} from "../../../apps/server/src/services/bookings/booking.types.ts";
import { CatalogService } from "../../../apps/server/src/services/catalog/catalog.service.ts";
import {
  type CatalogListQuery,
  type CatalogRecord,
  type CreateCatalogInput,
  catalogRecordMatchesSearch,
  type UpdateCatalogInput,
} from "../../../apps/server/src/services/catalog/catalog.types.ts";
import { CleanerService } from "../../../apps/server/src/services/cleaners/cleaner.service.ts";
import type {
  CleanerListQuery,
  CleanerRecord,
  CreateCleanerInput,
  UpdateCleanerInput,
} from "../../../apps/server/src/services/cleaners/cleaner.types.ts";
import { CustomerService } from "../../../apps/server/src/services/customers/customer.service.ts";
import type {
  CreateCustomerInput,
  CustomerListQuery,
  CustomerRecord,
  UpdateCustomerInput,
} from "../../../apps/server/src/services/customers/customer.types.ts";
import { DashboardService } from "../../../apps/server/src/services/dashboard/dashboard.service.ts";
import { NotificationService } from "../../../apps/server/src/services/notifications/notification.service.ts";
import type {
  CreateNotificationInput,
  NotificationListQuery,
  NotificationRecord,
} from "../../../apps/server/src/services/notifications/notification.types.ts";
import { QuoteService } from "../../../apps/server/src/services/quotes/quote.service.ts";
import type {
  CreateQuoteRequestInput,
  QuoteRequestRecord,
} from "../../../apps/server/src/services/quotes/quote.types.ts";
import { ReviewService } from "../../../apps/server/src/services/reviews/review.service.ts";
import type {
  CreateReviewInput,
  ReviewListQuery,
  ReviewRecord,
  UpdateReviewInput,
} from "../../../apps/server/src/services/reviews/review.types.ts";
import { SettingsService } from "../../../apps/server/src/services/settings/settings.service.ts";
import type {
  SettingsRecord,
  UpdateSettingsInput,
} from "../../../apps/server/src/services/settings/settings.types.ts";
import { UserService } from "../../../apps/server/src/services/users/user.service.ts";
import type {
  UpdateUserProfileInput,
  UserListQuery,
  UserProfile,
} from "../../../apps/server/src/services/users/user.types.ts";

export class InMemoryDomainStore {
  public readonly bookings = new Map<string, BookingRecord>();
  public readonly catalog = new Map<string, CatalogRecord>();
  public readonly cleaners = new Map<string, CleanerRecord>();
  public readonly customers = new Map<string, CustomerRecord>();
  public readonly notifications = new Map<string, NotificationRecord>();
  public readonly quotes = new Map<string, QuoteRequestRecord>();
  public readonly reviews = new Map<string, ReviewRecord>();
  public settings: SettingsRecord | null = null;
  public readonly users = new Map<string, UserProfile>();
}

export interface DomainHarness {
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
  store: InMemoryDomainStore;
  users: UserService;
}

export function createDomainHarness(now?: () => Date): DomainHarness {
  const store = new InMemoryDomainStore();
  const customerRepo = new InMemoryCustomerRepository(store);
  const cleanerRepo = new InMemoryCleanerRepository(store);
  const catalogRepo = new InMemoryCatalogRepository(store);
  const quoteRepo = new InMemoryQuoteRepository(store);
  const bookingRepo = new InMemoryBookingRepository(store);
  const reviewRepo = new InMemoryReviewRepository(store);
  const notificationRepo = new InMemoryNotificationRepository(store);
  const userRepo = new InMemoryUserRepository(store);
  const settingsRepo = new InMemorySettingsRepository(store);

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
  const notifications = new NotificationService(notificationRepo, now);
  const users = new UserService(userRepo);
  const settings = new SettingsService(settingsRepo);
  const dashboard = new DashboardService(
    customerRepo,
    cleanerRepo,
    catalogRepo,
    bookingRepo,
    reviewRepo,
  );
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
    store,
    users,
  };
}

export class InMemoryCustomerRepository implements CustomerRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<CustomerRecord | null> {
    const row = this.store.customers.get(id);
    return row === undefined ? null : withCustomerCount(this.store, row);
  }

  public async findByEmail(email: string): Promise<CustomerRecord | null> {
    return (
      [...this.store.customers.values()].find((row) => row.email === email) ??
      null
    );
  }

  public async findByUserId(userId: string): Promise<CustomerRecord | null> {
    return (
      [...this.store.customers.values()].find((row) => row.userId === userId) ??
      null
    );
  }

  public async create(input: CreateCustomerInput): Promise<CustomerRecord> {
    const now = new Date();
    const row: CustomerRecord = {
      address: input.address ?? null,
      avatarMediaId: input.avatarMediaId ?? null,
      bookingCount: 0,
      createdAt: now,
      email: input.email,
      id: createId(),
      name: input.name,
      phone: input.phone ?? null,
      status: "ACTIVE",
      updatedAt: now,
      userId: input.userId ?? null,
    };
    this.store.customers.set(row.id, row);
    return row;
  }

  public async update(
    id: string,
    input: UpdateCustomerInput & { status?: CustomerRecord["status"] },
  ): Promise<CustomerRecord | null> {
    const current = this.store.customers.get(id);

    if (current === undefined) {
      return null;
    }

    const row: CustomerRecord = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.customers.set(id, row);
    return row;
  }

  public async list(
    query: CustomerListQuery,
  ): Promise<{ items: CustomerRecord[]; total: number }> {
    const search = query.search?.trim().toLowerCase();
    const filtered = [...this.store.customers.values()].filter((row) => {
      if (query.status !== undefined && row.status !== query.status) {
        return false;
      }

      if (
        query.createdFrom !== undefined &&
        row.createdAt < query.createdFrom
      ) {
        return false;
      }

      if (query.createdTo !== undefined && row.createdAt > query.createdTo) {
        return false;
      }

      if (search === undefined || search === "") {
        return true;
      }

      return (
        row.email.toLowerCase().includes(search) ||
        row.name.toLowerCase().includes(search)
      );
    });

    return page(
      filtered.map((row) => withCustomerCount(this.store, row)),
      query,
      (left, right) =>
        compareValues(
          valueByField(left, query.sort?.field, "createdAt"),
          valueByField(right, query.sort?.field, "createdAt"),
          query.sort,
          "desc",
        ),
    );
  }

  public async countTotal(): Promise<number> {
    return this.store.customers.size;
  }

  public async countByStatus(
    status: CustomerRecord["status"],
  ): Promise<number> {
    return countWhere(
      [...this.store.customers.values()],
      (row) => row.status === status,
    );
  }
}

export class InMemoryCleanerRepository implements CleanerRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<CleanerRecord | null> {
    return this.store.cleaners.get(id) ?? null;
  }

  public async findByEmail(email: string): Promise<CleanerRecord | null> {
    return (
      [...this.store.cleaners.values()].find((row) => row.email === email) ??
      null
    );
  }

  public async findByUserId(userId: string): Promise<CleanerRecord | null> {
    return (
      [...this.store.cleaners.values()].find((row) => row.userId === userId) ??
      null
    );
  }

  public async create(input: CreateCleanerInput): Promise<CleanerRecord> {
    const now = new Date();
    const row: CleanerRecord = {
      createdAt: now,
      email: input.email ?? null,
      id: createId(),
      name: input.name,
      phone: input.phone ?? null,
      status: "ACTIVE",
      updatedAt: now,
      userId: input.userId ?? null,
    };
    this.store.cleaners.set(row.id, row);
    return row;
  }

  public async update(
    id: string,
    input: UpdateCleanerInput & { status?: CleanerRecord["status"] },
  ): Promise<CleanerRecord | null> {
    const current = this.store.cleaners.get(id);

    if (current === undefined) {
      return null;
    }

    const row: CleanerRecord = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.cleaners.set(id, row);
    return row;
  }

  public async list(
    query: CleanerListQuery,
  ): Promise<{ items: CleanerRecord[]; total: number }> {
    const search = query.search?.trim().toLowerCase();
    const filtered = [...this.store.cleaners.values()].filter((row) => {
      if (query.status !== undefined && row.status !== query.status) {
        return false;
      }

      if (search === undefined || search === "") {
        return true;
      }

      return (
        (row.email ?? "").toLowerCase().includes(search) ||
        row.name.toLowerCase().includes(search)
      );
    });

    return page(filtered, query, (left, right) =>
      compareValues(
        valueByField(left, query.sort?.field, "createdAt"),
        valueByField(right, query.sort?.field, "createdAt"),
        query.sort,
        "desc",
      ),
    );
  }

  public async countTotal(): Promise<number> {
    return this.store.cleaners.size;
  }

  public async countByStatus(status: CleanerRecord["status"]): Promise<number> {
    return countWhere(
      [...this.store.cleaners.values()],
      (row) => row.status === status,
    );
  }
}

export class InMemoryCatalogRepository implements CatalogRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<CatalogRecord | null> {
    return this.store.catalog.get(id) ?? null;
  }

  public async findBySlug(slug: string): Promise<CatalogRecord | null> {
    return (
      [...this.store.catalog.values()].find((row) => row.slug === slug) ?? null
    );
  }

  public async create(
    input: CreateCatalogInput & { slug: string },
  ): Promise<CatalogRecord> {
    const now = new Date();
    const row: CatalogRecord = {
      benefits: input.benefits ?? [],
      coverImageAlt: null,
      coverImageUrl: null,
      coverMediaId: input.coverMediaId ?? null,
      createdAt: now,
      excludedTasks: input.excludedTasks ?? [],
      faqs: input.faqs ?? null,
      fullDescription: input.fullDescription,
      id: createId(),
      includedTasks: input.includedTasks ?? [],
      isActive: true,
      isFeatured: input.isFeatured ?? false,
      name: input.name,
      seoDescription: input.seoDescription ?? null,
      seoTitle: input.seoTitle ?? null,
      shortDescription: input.shortDescription,
      slug: input.slug,
      sortOrder: input.sortOrder ?? 0,
      updatedAt: now,
    };
    this.store.catalog.set(row.id, row);
    return row;
  }

  public async update(
    id: string,
    input: UpdateCatalogInput & { isActive?: boolean },
  ): Promise<CatalogRecord | null> {
    const current = this.store.catalog.get(id);

    if (current === undefined) {
      return null;
    }

    const row: CatalogRecord = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.catalog.set(id, row);
    return row;
  }

  public async list(
    query: CatalogListQuery,
  ): Promise<{ items: CatalogRecord[]; total: number }> {
    const search = query.search ?? "";
    const filtered = [...this.store.catalog.values()].filter((row) => {
      if (query.active !== undefined && row.isActive !== query.active) {
        return false;
      }

      return catalogRecordMatchesSearch(row, search);
    });

    return page(filtered, query, (left, right) =>
      compareValues(
        valueByField(left, query.sort?.field, "sortOrder"),
        valueByField(right, query.sort?.field, "sortOrder"),
        query.sort,
        "asc",
      ),
    );
  }

  public async countTotal(): Promise<number> {
    return this.store.catalog.size;
  }

  public async countActive(): Promise<number> {
    return countWhere([...this.store.catalog.values()], (row) => row.isActive);
  }
}

export class InMemoryQuoteRepository implements QuoteRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<QuoteRequestRecord | null> {
    return this.store.quotes.get(id) ?? null;
  }

  public async create(
    input: CreateQuoteRequestInput,
  ): Promise<QuoteRequestRecord> {
    const now = new Date();
    const row: QuoteRequestRecord = {
      additionalNotes: input.additionalNotes ?? null,
      approximateSize: input.approximateSize,
      bathrooms: input.bathrooms ?? null,
      bedrooms: input.bedrooms ?? null,
      createdAt: now,
      email: input.email,
      frequency: input.frequency,
      fullName: input.fullName,
      id: createId(),
      phone: input.phone,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      propertyType: input.propertyType,
      serviceAddress: input.serviceAddress,
      serviceId: input.serviceId ?? null,
      serviceType: input.serviceType,
      status: "NEW",
      updatedAt: now,
    };
    this.store.quotes.set(row.id, row);
    return row;
  }
}

export class InMemoryBookingRepository implements BookingRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<BookingRecord | null> {
    return this.store.bookings.get(id) ?? null;
  }

  public async findByQuoteRequestId(
    quoteRequestId: string,
  ): Promise<BookingRecord | null> {
    return (
      [...this.store.bookings.values()].find(
        (row) => row.quoteRequestId === quoteRequestId,
      ) ?? null
    );
  }

  public async create(
    input: CreateBookingInput & { status?: BookingRecord["status"] },
  ): Promise<BookingRecord> {
    const now = new Date();
    const row: BookingRecord = {
      cleaner: party(this.store.cleaners.get(input.cleanerId ?? "")),
      cleanerId: input.cleanerId ?? null,
      createdAt: now,
      customer: party(this.store.customers.get(input.customerId)),
      customerId: input.customerId,
      id: createId(),
      notes: input.notes ?? null,
      quoteRequestId: input.quoteRequestId ?? null,
      scheduledAt: input.scheduledAt ?? null,
      service: party(this.store.catalog.get(input.serviceId)),
      serviceAddress: input.serviceAddress ?? null,
      serviceId: input.serviceId,
      status: input.status ?? "PENDING",
      updatedAt: now,
    };
    this.store.bookings.set(row.id, row);
    return row;
  }

  public async update(
    id: string,
    input: UpdateBookingInput,
  ): Promise<BookingRecord | null> {
    const current = this.store.bookings.get(id);

    if (current === undefined) {
      return null;
    }

    const row: BookingRecord = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.bookings.set(id, row);
    return row;
  }

  public async compareAndUpdate(
    id: string,
    expectedStatus: BookingRecord["status"],
    data: UpdateBookingInput & {
      cleanerId?: string | null;
      status: BookingRecord["status"];
    },
  ): Promise<BookingRecord | null> {
    const current = this.store.bookings.get(id);

    if (current === undefined || current.status !== expectedStatus) {
      return null;
    }

    const row: BookingRecord = withBookingParties(this.store, {
      ...current,
      ...omitUndefined(data),
      updatedAt: new Date(),
    });
    this.store.bookings.set(id, row);
    return row;
  }

  public async list(
    query: BookingListQuery,
  ): Promise<{ items: BookingRecord[]; total: number }> {
    const search = query.search?.trim().toLowerCase();
    const filtered = [...this.store.bookings.values()].filter((row) => {
      if (query.cleanerId !== undefined && row.cleanerId !== query.cleanerId) {
        return false;
      }

      if (
        query.customerId !== undefined &&
        row.customerId !== query.customerId
      ) {
        return false;
      }

      if (query.serviceId !== undefined && row.serviceId !== query.serviceId) {
        return false;
      }

      if (query.status !== undefined && row.status !== query.status) {
        return false;
      }

      if (query.excludeStatuses?.includes(row.status)) {
        return false;
      }

      if (
        query.scheduledFrom !== undefined &&
        (row.scheduledAt === null || row.scheduledAt < query.scheduledFrom)
      ) {
        return false;
      }

      if (
        query.scheduledTo !== undefined &&
        (row.scheduledAt === null || row.scheduledAt > query.scheduledTo)
      ) {
        return false;
      }

      if (search === undefined || search === "") {
        return true;
      }

      return (
        row.id.toLowerCase().includes(search) ||
        (row.customerId ?? "").toLowerCase().includes(search) ||
        (row.service?.name ?? "").toLowerCase().includes(search)
      );
    });

    return page(filtered, query, (left, right) =>
      compareValues(
        valueByField(left, query.sort?.field, "createdAt"),
        valueByField(right, query.sort?.field, "createdAt"),
        query.sort,
        "desc",
      ),
    );
  }

  public async listRecent(limit: number): Promise<BookingRecord[]> {
    return [...this.store.bookings.values()]
      .sort(
        (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
      )
      .slice(0, limit);
  }

  public async countTotal(): Promise<number> {
    return this.store.bookings.size;
  }

  public async countByStatus(status: BookingRecord["status"]): Promise<number> {
    return countWhere(
      [...this.store.bookings.values()],
      (row) => row.status === status,
    );
  }
}

export class InMemoryReviewRepository implements ReviewRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<ReviewRecord | null> {
    return this.store.reviews.get(id) ?? null;
  }

  public async create(input: CreateReviewInput): Promise<ReviewRecord> {
    const now = new Date();
    const row: ReviewRecord = {
      avatarMediaId: input.avatarMediaId ?? null,
      content: input.content,
      createdAt: now,
      customerName: input.customerName,
      customerRole: input.customerRole ?? null,
      id: createId(),
      isActive: true,
      isFeatured: input.isFeatured ?? false,
      rating: input.rating,
      serviceCategory: input.serviceCategory ?? null,
      sortOrder: input.sortOrder ?? 0,
      updatedAt: now,
    };
    this.store.reviews.set(row.id, row);
    return row;
  }

  public async update(
    id: string,
    input: UpdateReviewInput & { isActive?: boolean },
  ): Promise<ReviewRecord | null> {
    const current = this.store.reviews.get(id);

    if (current === undefined) {
      return null;
    }

    const row: ReviewRecord = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.reviews.set(id, row);
    return row;
  }

  public async list(
    query: ReviewListQuery,
  ): Promise<{ items: ReviewRecord[]; total: number }> {
    const search = query.search?.trim().toLowerCase();
    const filtered = [...this.store.reviews.values()].filter((row) => {
      if (query.active !== undefined && row.isActive !== query.active) {
        return false;
      }

      if (
        query.category !== undefined &&
        row.serviceCategory !== query.category
      ) {
        return false;
      }

      if (query.rating !== undefined && row.rating !== query.rating) {
        return false;
      }

      if (
        query.createdFrom !== undefined &&
        row.createdAt < query.createdFrom
      ) {
        return false;
      }

      if (query.createdTo !== undefined && row.createdAt > query.createdTo) {
        return false;
      }

      if (search === undefined || search === "") {
        return true;
      }

      return (
        row.content.toLowerCase().includes(search) ||
        row.customerName.toLowerCase().includes(search)
      );
    });

    return page(filtered, query, (left, right) =>
      compareValues(
        valueByField(left, query.sort?.field, "createdAt"),
        valueByField(right, query.sort?.field, "createdAt"),
        query.sort,
        "desc",
      ),
    );
  }

  public async countTotal(): Promise<number> {
    return this.store.reviews.size;
  }

  public async countActive(): Promise<number> {
    return countWhere([...this.store.reviews.values()], (row) => row.isActive);
  }
}

export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<NotificationRecord | null> {
    return this.store.notifications.get(id) ?? null;
  }

  public async create(
    input: CreateNotificationInput,
  ): Promise<NotificationRecord> {
    const row: NotificationRecord = {
      createdAt: new Date(),
      id: createId(),
      isRead: false,
      message: input.message,
      readAt: null,
      recipientId: input.recipientId,
      relatedHref: input.relatedHref ?? null,
      relatedLabel: input.relatedLabel ?? null,
      title: input.title,
    };
    this.store.notifications.set(row.id, row);
    return row;
  }

  public async list(
    query: NotificationListQuery,
  ): Promise<{ items: NotificationRecord[]; total: number }> {
    const filtered = [...this.store.notifications.values()].filter((row) => {
      if (row.recipientId !== query.recipientId) {
        return false;
      }

      return query.unreadOnly !== true || !row.isRead;
    });

    return page(filtered, query, (left, right) =>
      compareValues(left.createdAt, right.createdAt, query.sort, "desc"),
    );
  }

  public async markRead(
    id: string,
    readAt: Date,
  ): Promise<NotificationRecord | null> {
    const current = this.store.notifications.get(id);

    if (current === undefined) {
      return null;
    }

    const row: NotificationRecord = {
      ...current,
      isRead: true,
      readAt,
    };
    this.store.notifications.set(id, row);
    return row;
  }

  public async markAllRead(recipientId: string, readAt: Date): Promise<number> {
    let count = 0;

    for (const row of this.store.notifications.values()) {
      if (row.recipientId === recipientId && !row.isRead) {
        this.store.notifications.set(row.id, {
          ...row,
          isRead: true,
          readAt,
        });
        count += 1;
      }
    }

    return count;
  }

  public async deleteById(id: string): Promise<boolean> {
    return this.store.notifications.delete(id);
  }
}

export class InMemoryUserRepository implements UserRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async findById(id: string): Promise<UserProfile | null> {
    return this.store.users.get(id) ?? null;
  }

  public async listAdminIds(): Promise<readonly string[]> {
    return [...this.store.users.values()]
      .filter(
        (row) =>
          row.status === "ACTIVE" &&
          (row.role === "ADMIN" ||
            row.role === "SUPER_ADMIN" ||
            row.role === "CONTENT_MANAGER" ||
            row.role === "STAFF"),
      )
      .map((row) => row.id);
  }

  public async update(
    id: string,
    input: UpdateUserProfileInput & { status?: UserProfile["status"] },
  ): Promise<UserProfile | null> {
    const current = this.store.users.get(id);

    if (current === undefined) {
      return null;
    }

    const row: UserProfile = {
      ...current,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.users.set(id, row);
    return row;
  }

  public async list(
    query: UserListQuery,
  ): Promise<{ items: UserProfile[]; total: number }> {
    const search = query.search?.trim().toLowerCase();
    const filtered = [...this.store.users.values()].filter((row) => {
      if (query.status !== undefined && row.status !== query.status) {
        return false;
      }

      if (search === undefined || search === "") {
        return true;
      }

      return (
        row.email.toLowerCase().includes(search) ||
        row.name.toLowerCase().includes(search)
      );
    });

    return page(filtered, query, (left, right) =>
      compareValues(
        valueByField(left, query.sort?.field, "createdAt"),
        valueByField(right, query.sort?.field, "createdAt"),
        query.sort,
        "desc",
      ),
    );
  }
}

export class InMemorySettingsRepository implements SettingsRepository {
  private readonly store: InMemoryDomainStore;

  public constructor(store: InMemoryDomainStore) {
    this.store = store;
  }

  public async find(): Promise<SettingsRecord | null> {
    return this.store.settings;
  }

  public async update(
    input: UpdateSettingsInput,
  ): Promise<SettingsRecord | null> {
    if (this.store.settings === null) {
      return null;
    }

    const row: SettingsRecord = {
      ...this.store.settings,
      ...omitUndefined(input),
      updatedAt: new Date(),
    };
    this.store.settings = row;
    return row;
  }
}

function page<T>(
  items: readonly T[],
  query: { pagination?: PaginationQuery },
  compare: (left: T, right: T) => number,
): { items: T[]; total: number } {
  const pagination = resolvePagination(query.pagination);
  const sorted = [...items].sort(compare);
  return {
    items: sorted.slice(pagination.skip, pagination.skip + pagination.limit),
    total: sorted.length,
  };
}

function compareValues(
  left: Date | number | string | null,
  right: Date | number | string | null,
  sort: SortQuery | undefined,
  defaultDirection: "asc" | "desc",
): number {
  const direction = (sort?.direction ?? defaultDirection) === "asc" ? 1 : -1;
  const leftValue = toSortKey(left);
  const rightValue = toSortKey(right);

  if (leftValue < rightValue) {
    return -1 * direction;
  }

  if (leftValue > rightValue) {
    return 1 * direction;
  }

  return 0;
}

function valueByField(
  row: object,
  field: string | undefined,
  fallback: string,
): Date | number | string | null {
  const key = field ?? fallback;
  const value = (row as Record<string, unknown>)[key];

  if (
    value instanceof Date ||
    typeof value === "number" ||
    typeof value === "string" ||
    value === null
  ) {
    return value;
  }

  return "";
}

function toSortKey(value: Date | number | string | null): number | string {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (value === null) {
    return "";
  }

  return value;
}

function countWhere<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
): number {
  return items.filter(predicate).length;
}

function createId(): string {
  return `c${randomUUID().replaceAll("-", "").slice(0, 24)}`;
}

function omitUndefined<T extends object>(input: T): Partial<T> {
  const entries = Object.entries(input).filter(
    ([, value]) => value !== undefined,
  );
  return Object.fromEntries(entries) as Partial<T>;
}

function withCustomerCount(
  store: InMemoryDomainStore,
  row: CustomerRecord,
): CustomerRecord {
  return {
    ...row,
    bookingCount: [...store.bookings.values()].filter(
      (booking) => booking.customerId === row.id,
    ).length,
  };
}

function party(
  row: { id: string; name: string } | undefined,
): { id: string; name: string } | null {
  return row === undefined ? null : { id: row.id, name: row.name };
}

function withBookingParties(
  store: InMemoryDomainStore,
  row: BookingRecord,
): BookingRecord {
  return {
    ...row,
    cleaner: party(
      row.cleanerId === null ? undefined : store.cleaners.get(row.cleanerId),
    ),
    customer: party(
      row.customerId === null ? undefined : store.customers.get(row.customerId),
    ),
    service: party(
      row.serviceId === null ? undefined : store.catalog.get(row.serviceId),
    ),
  };
}
