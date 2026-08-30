import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_ERROR_CODES,
  HTTP_STATUS,
} from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import {
  createDomainHarness,
  InMemoryCleanerInvitationGateway,
} from "../domain/in-memory-domain.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);

const adminUser = {
  email: "admin@neatly.example",
  id: "cladmin000000000000000001",
  lastLoginAt: null,
  name: "Neatly Admin",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

interface Envelope<T> {
  data: T;
  error: { code: string; message: string; requestId?: string } | null;
  success: boolean;
}

function withAuth(
  input: Parameters<typeof dispatchApi>[0] = {},
): Parameters<typeof dispatchApi>[0] {
  return {
    ...input,
    headers: {
      "content-type": "application/json",
      "x-session-token": "session-token-value",
      ...input.headers,
    },
  };
}

function withId(path: string, id: string): string {
  return path.replace(":id", id);
}

describe("Admin APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(adminUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("rejects unauthenticated and non-admin dashboard access", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.adminDashboard,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue({
        ...adminUser,
        role: "CUSTOMER",
      }),
    } as never);

    const forbidden = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminDashboard }),
    );
    const body = parseJsonBody(forbidden.body) as Envelope<null>;
    expect(forbidden.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(body.error?.code).toBe(API_ERROR_CODES.FORBIDDEN);
    expect(body.error?.requestId).toBeDefined();
  });

  it("returns live dashboard metrics and the admin profile", async (): Promise<void> => {
    const dashboard = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminDashboard }),
    );
    const dashboardBody = parseJsonBody(dashboard.body) as Envelope<{
      bookings: { total: number };
      customers: { total: number };
      recentCustomers: unknown[];
    }>;

    expect(dashboard.statusCode).toBe(HTTP_STATUS.OK);
    expect(dashboardBody.data.bookings.total).toBe(0);
    expect(dashboardBody.data.customers.total).toBe(0);
    expect(dashboardBody.data).not.toHaveProperty("revenue");

    const me = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminMe }),
    );
    const meBody = parseJsonBody(me.body) as Envelope<{
      user: { id: string; passwordHash?: string };
    }>;
    expect(meBody.data.user.id).toBe(adminUser.id);
    expect(meBody.data.user).not.toHaveProperty("passwordHash");
  });

  it("creates, lists, updates, and deactivates customers without mass assignment", async (): Promise<void> => {
    const created = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "ada@neatly.example",
          name: "Ada Customer",
          role: "ADMIN",
        }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    expect(created.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const valid = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "ada@neatly.example",
          name: "Ada Customer",
          phone: "555-0100",
        }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    const validBody = parseJsonBody(valid.body) as Envelope<{
      customer: {
        bookingCount: number;
        email: string;
        id: string;
        passwordHash?: string;
        status: string;
      };
    }>;
    expect(valid.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(validBody.data.customer.email).toBe("ada@neatly.example");
    expect(validBody.data.customer.status).toBe("ACTIVE");
    expect(validBody.data.customer.bookingCount).toBe(0);
    expect(validBody.data.customer).not.toHaveProperty("passwordHash");

    const listed = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.adminCustomers}?search=ada&page=1&limit=20`,
      }),
    );
    const listedBody = parseJsonBody(listed.body) as Envelope<{
      items: unknown[];
      pagination: { total: number };
    }>;
    expect(listedBody.data.items).toHaveLength(1);
    expect(listedBody.data.pagination.total).toBe(1);

    const updated = await dispatchApi(
      withAuth({
        body: JSON.stringify({ name: "Ada Updated" }),
        method: "PATCH",
        url: withId(API_PATHS.adminCustomer, validBody.data.customer.id),
      }),
    );
    const updatedBody = parseJsonBody(updated.body) as Envelope<{
      customer: { name: string };
    }>;
    expect(updatedBody.data.customer.name).toBe("Ada Updated");

    const deactivated = await dispatchApi(
      withAuth({
        body: JSON.stringify({ status: "INACTIVE" }),
        method: "PATCH",
        url: withId(API_PATHS.adminCustomerStatus, validBody.data.customer.id),
      }),
    );
    const deactivatedBody = parseJsonBody(deactivated.body) as Envelope<{
      customer: { status: string };
    }>;
    expect(deactivatedBody.data.customer.status).toBe("INACTIVE");

    const detail = await dispatchApi(
      withAuth({
        method: "GET",
        url: withId(API_PATHS.adminCustomer, validBody.data.customer.id),
      }),
    );
    const detailBody = parseJsonBody(detail.body) as Envelope<{
      customer: { id: string; status: string };
    }>;
    expect(detail.statusCode).toBe(HTTP_STATUS.OK);
    expect(detailBody.data.customer.status).toBe("INACTIVE");

    const missing = await dispatchApi(
      withAuth({
        method: "GET",
        url: withId(API_PATHS.adminCustomer, "clmissing0000000000000001"),
      }),
    );
    expect(missing.statusCode).toBe(HTTP_STATUS.NOT_FOUND);

    const invalidId = await dispatchApi(
      withAuth({
        method: "GET",
        url: withId(API_PATHS.adminCustomer, "not-a-cuid"),
      }),
    );
    expect(invalidId.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const deleted = await dispatchApi(
      withAuth({
        method: "DELETE",
        url: withId(API_PATHS.adminCustomer, validBody.data.customer.id),
      }),
    );
    expect(deleted.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
  });

  it("rejects invalid customer pagination and sort fields", async (): Promise<void> => {
    const pagination = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.adminCustomers}?limit=500`,
      }),
    );
    expect(pagination.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const sort = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.adminCustomers}?sort=passwordHash`,
      }),
    );
    expect(sort.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("manages cleaners, catalog offerings, bookings, reviews, and notifications", async (): Promise<void> => {
    const invitations = new InMemoryCleanerInvitationGateway();
    mockedDomain.mockReturnValue(
      createDomainHarness(undefined, invitations) as never,
    );

    const customer = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "ada@neatly.example",
          name: "Ada",
        }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    const customerId = (
      parseJsonBody(customer.body) as Envelope<{ customer: { id: string } }>
    ).data.customer.id;

    const cleaner = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "mia@neatly.example",
          name: "Mia Cleaner",
          phone: "555-0100",
        }),
        method: "POST",
        url: API_PATHS.adminCleaners,
      }),
    );
    const cleanerId = (
      parseJsonBody(cleaner.body) as Envelope<{ cleaner: { id: string } }>
    ).data.cleaner.id;
    const invitationToken = [...invitations.tokens.keys()][0] ?? "";
    const activated = await dispatchApi({
      body: JSON.stringify({
        password: "correct-horse-battery-staple",
        token: invitationToken,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.cleanerActivate,
    });
    expect(activated.statusCode).toBe(HTTP_STATUS.OK);

    const service = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          fullDescription: "A complete residential clean.",
          name: "Home Refresh",
          shortDescription: "Weekly tidy",
        }),
        method: "POST",
        url: API_PATHS.adminServices,
      }),
    );
    const serviceId = (
      parseJsonBody(service.body) as Envelope<{ service: { id: string } }>
    ).data.service.id;

    const booking = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          customerId,
          serviceId,
        }),
        method: "POST",
        url: API_PATHS.adminBookings,
      }),
    );
    const bookingBody = parseJsonBody(booking.body) as Envelope<{
      booking: {
        id: string;
        status: string;
        customer: { name: string } | null;
      };
    }>;
    expect(booking.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(bookingBody.data.booking.status).toBe("PENDING");
    expect(bookingBody.data.booking.customer?.name).toBe("Ada");

    const assigned = await dispatchApi(
      withAuth({
        body: JSON.stringify({ cleanerId }),
        method: "PATCH",
        url: withId(API_PATHS.adminBookingAssign, bookingBody.data.booking.id),
      }),
    );
    const assignedBody = parseJsonBody(assigned.body) as Envelope<{
      booking: { status: string };
    }>;
    expect(assignedBody.data.booking.status).toBe("ASSIGNED");

    const invalidStatus = await dispatchApi(
      withAuth({
        body: JSON.stringify({ status: "COMPLETED" }),
        method: "PATCH",
        url: withId(API_PATHS.adminBookingStatus, bookingBody.data.booking.id),
      }),
    );
    expect(invalidStatus.statusCode).toBe(HTTP_STATUS.CONFLICT);

    const harness = getDomainServices();
    const reviewRecord = await harness.reviews.create(
      { id: adminUser.id, role: "ADMIN" },
      {
        content: "Spotless kitchen.",
        customerName: "Ada",
        rating: 5,
      },
    );
    const hidden = await dispatchApi(
      withAuth({
        method: "POST",
        url: withId(API_PATHS.adminReviewHide, reviewRecord.id),
      }),
    );
    const hiddenBody = parseJsonBody(hidden.body) as Envelope<{
      review: { isActive: boolean };
    }>;
    expect(hiddenBody.data.review.isActive).toBe(false);

    const notification = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          message: "A quote arrived.",
          recipientId: adminUser.id,
          title: "New quote",
        }),
        method: "POST",
        url: API_PATHS.adminNotifications,
      }),
    );
    const notificationBody = parseJsonBody(notification.body) as Envelope<{
      notification: { id: string; isRead: boolean };
    }>;
    expect(notification.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(notificationBody.data.notification.isRead).toBe(false);

    const read = await dispatchApi(
      withAuth({
        method: "PATCH",
        url: withId(
          API_PATHS.adminNotificationRead,
          notificationBody.data.notification.id,
        ),
      }),
    );
    const readBody = parseJsonBody(read.body) as Envelope<{
      notification: { isRead: boolean };
    }>;
    expect(readBody.data.notification.isRead).toBe(true);

    const otherRecipient = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          message: "Staff ping.",
          recipientId: "clother000000000000000001",
          title: "Other inbox",
        }),
        method: "POST",
        url: API_PATHS.adminNotifications,
      }),
    );
    expect(otherRecipient.statusCode).toBe(HTTP_STATUS.CREATED);

    const listedNotifications = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminNotifications }),
    );
    const listedNotificationBody = parseJsonBody(
      listedNotifications.body,
    ) as Envelope<{ items: { recipientId: string }[] }>;
    expect(listedNotificationBody.data.items).toHaveLength(1);
    expect(listedNotificationBody.data.items[0]?.recipientId).toBe(
      adminUser.id,
    );

    const archived = await dispatchApi(
      withAuth({
        method: "POST",
        url: withId(API_PATHS.adminServiceArchive, serviceId),
      }),
    );
    const archivedBody = parseJsonBody(archived.body) as Envelope<{
      service: { isActive: boolean };
    }>;
    expect(archivedBody.data.service.isActive).toBe(false);
  });

  it("returns empty settings when no row exists and upserts on update", async (): Promise<void> => {
    const missing = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminSettings }),
    );
    const missingBody = parseJsonBody(missing.body) as Envelope<{
      settings: { businessName: string; phone: string };
    }>;
    expect(missing.statusCode).toBe(HTTP_STATUS.OK);
    expect(missingBody.data.settings.businessName).toBe("Neatly");
    expect(missingBody.data.settings.phone).toBe("");

    const created = await dispatchApi(
      withAuth({
        body: JSON.stringify({ tagline: "Trusted home cleaning" }),
        method: "PATCH",
        url: API_PATHS.adminSettings,
      }),
    );
    const createdBody = parseJsonBody(created.body) as Envelope<{
      settings: { tagline: string };
    }>;
    expect(created.statusCode).toBe(HTTP_STATUS.OK);
    expect(createdBody.data.settings.tagline).toBe("Trusted home cleaning");

    const harness = createDomainHarness();
    harness.store.settings = {
      address: "1 Harbour Street",
      businessName: "Neatly",
      defaultSeoDesc: "Calm home cleaning.",
      defaultSeoTitle: "Neatly",
      email: "hello@neatly.example",
      notificationEmail: "ops@neatly.example",
      phone: "555-0100",
      serviceAreas: ["Downtown"],
      socialLinks: null,
      tagline: "Clean, minimal, high-trust",
      updatedAt: new Date(),
      workingHours: { friday: "9-17" },
    };
    mockedDomain.mockReturnValue(harness as never);

    const found = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.adminSettings }),
    );
    const foundBody = parseJsonBody(found.body) as Envelope<{
      settings: { businessName: string };
    }>;
    expect(found.statusCode).toBe(HTTP_STATUS.OK);
    expect(foundBody.data.settings.businessName).toBe("Neatly");

    const updated = await dispatchApi(
      withAuth({
        body: JSON.stringify({ tagline: "Trusted home cleaning" }),
        method: "PATCH",
        url: API_PATHS.adminSettings,
      }),
    );
    const updatedBody = parseJsonBody(updated.body) as Envelope<{
      settings: { tagline: string };
    }>;
    expect(updated.statusCode).toBe(HTTP_STATUS.OK);
    expect(updatedBody.data.settings.tagline).toBe("Trusted home cleaning");
  });

  it("rejects unauthenticated and non-admin access across Admin resources", async (): Promise<void> => {
    const missingId = "clmissing0000000000000001";
    const protectedGets = [
      API_PATHS.admin,
      API_PATHS.adminMe,
      API_PATHS.adminDashboard,
      API_PATHS.adminCustomers,
      withId(API_PATHS.adminCustomer, missingId),
      API_PATHS.adminCleaners,
      withId(API_PATHS.adminCleaner, missingId),
      API_PATHS.adminServices,
      withId(API_PATHS.adminService, missingId),
      API_PATHS.adminBookings,
      withId(API_PATHS.adminBooking, missingId),
      API_PATHS.adminReviews,
      withId(API_PATHS.adminReview, missingId),
      API_PATHS.adminNotifications,
      API_PATHS.adminNotificationStream,
      API_PATHS.adminSettings,
    ];

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    for (const url of protectedGets) {
      const response = await dispatchApi({ method: "GET", url });
      expect(response.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    }

    const unauthenticatedPost = await dispatchApi({
      body: JSON.stringify({ name: "Ada", email: "ada@neatly.example" }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.adminCustomers,
    });
    expect(unauthenticatedPost.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue({
        ...adminUser,
        role: "CUSTOMER",
      }),
    } as never);

    for (const url of protectedGets) {
      const response = await dispatchApi(withAuth({ method: "GET", url }));
      expect(response.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    }

    const forbiddenPost = await dispatchApi(
      withAuth({
        body: JSON.stringify({ name: "Ada", email: "ada@neatly.example" }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    expect(forbiddenPost.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("rejects invalid enums, unknown body fields, and malformed queries", async (): Promise<void> => {
    const unknownField = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "ada@neatly.example",
          name: "Ada",
          passwordHash: "secret",
        }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    expect(unknownField.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const missingName = await dispatchApi(
      withAuth({
        body: JSON.stringify({ email: "ada@neatly.example" }),
        method: "POST",
        url: API_PATHS.adminCustomers,
      }),
    );
    expect(missingName.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const malformedPage = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.adminCustomers}?page=abc`,
      }),
    );
    expect(malformedPage.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const invalidStatus = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.adminBookings}?status=DONE`,
      }),
    );
    expect(invalidStatus.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const serviceWithActive = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          fullDescription: "A complete residential clean.",
          isActive: false,
          name: "Home Refresh",
          shortDescription: "Weekly tidy",
        }),
        method: "POST",
        url: API_PATHS.adminServices,
      }),
    );
    expect(serviceWithActive.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
