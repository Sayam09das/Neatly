/** @vitest-environment jsdom */

import { describe, expect, it, vi } from "vitest";
import { ADMIN_API_PATHS } from "@/config/admin-api";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { listAdminBookings } from "@/lib/admin/bookings";
import { listAdminCleaners } from "@/lib/admin/cleaners";
import { listAdminCustomers } from "@/lib/admin/customers";
import {
  getAdminDashboard,
  toAdminDashboardViewModel,
} from "@/lib/admin/dashboard";
import { listAdminNotifications } from "@/lib/admin/notifications";
import { buildAdminSearchParams } from "@/lib/admin/query";
import { listAdminReviews } from "@/lib/admin/reviews";
import { listAdminServices } from "@/lib/admin/services";
import { handleAdminApiFailure } from "@/lib/admin/session";
import { getAdminSettings } from "@/lib/admin/settings";
import { adminRequest, parseAdminApiResponse } from "@/lib/api/admin-request";
import { ADMIN_BOOKING_STATUS_ALL } from "@/types/admin-booking";

vi.mock("@/lib/api/admin-request", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/api/admin-request")>();

  return {
    ...actual,
    adminRequest: vi.fn(),
  };
});

const mockedAdminRequest = vi.mocked(adminRequest);

function listPayload(items: readonly unknown[] = []): {
  items: readonly unknown[];
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
} {
  return {
    items,
    pagination: {
      limit: 20,
      page: 1,
      total: items.length,
      totalPages: items.length === 0 ? 0 : 1,
    },
  };
}

describe("parseAdminApiResponse", (): void => {
  it("parses success, empty, and documented error statuses", (): void => {
    expect(
      parseAdminApiResponse(200, { success: true, data: { ok: true } }),
    ).toEqual({
      data: { ok: true },
      ok: true,
      status: 200,
    });
    expect(parseAdminApiResponse(204, null)).toEqual({
      data: undefined,
      ok: true,
      status: 204,
    });
    expect(parseAdminApiResponse(400, null)).toMatchObject({
      code: "INVALID_INPUT",
      ok: false,
    });
    expect(parseAdminApiResponse(401, null)).toMatchObject({
      code: "UNAUTHORIZED",
      forbidden: false,
      ok: false,
      unauthorized: true,
    });
    expect(parseAdminApiResponse(403, null)).toMatchObject({
      code: "FORBIDDEN",
      forbidden: true,
      unauthorized: false,
    });
    expect(parseAdminApiResponse(404, null)).toMatchObject({
      code: "NOT_FOUND",
      ok: false,
    });
    expect(parseAdminApiResponse(409, null)).toMatchObject({
      code: "CONFLICT",
      ok: false,
    });
    expect(parseAdminApiResponse(422, null)).toMatchObject({
      code: "INVALID_INPUT",
      ok: false,
    });
    expect(parseAdminApiResponse(429, null)).toMatchObject({
      code: "RATE_LIMITED",
      ok: false,
    });
    expect(parseAdminApiResponse(500, null)).toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Unable to complete this request. Please try again.",
    });
  });
});

describe("buildAdminSearchParams", (): void => {
  it("omits empty, blank, and undefined values", (): void => {
    const params = buildAdminSearchParams({
      filters: {
        createdTo: "",
        status: "ACTIVE",
        unreadOnly: true,
      },
      limit: 20,
      page: 2,
      search: "  john  ",
    });

    expect(params.toString()).toBe(
      "page=2&limit=20&search=john&status=ACTIVE&unreadOnly=true",
    );
  });
});

describe("Admin API clients", (): void => {
  it("maps list query state onto backend search parameters", async (): Promise<void> => {
    mockedAdminRequest.mockResolvedValue({
      data: listPayload(),
      ok: true,
      status: 200,
    });

    await listAdminCustomers(
      {
        joinedFrom: "2026-01-01",
        joinedTo: "",
        page: 2,
        query: "john",
        status: "ACTIVE",
      },
      { signal: new AbortController().signal },
    );
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.customers}?page=2&limit=20&search=john&createdFrom=2026-01-01&status=ACTIVE`,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    await listAdminBookings({
      cleanerId: "",
      customerId: "cus_1",
      page: 1,
      query: "",
      scheduledFrom: "2026-02-01",
      scheduledTo: "",
      serviceId: "",
      status: ADMIN_BOOKING_STATUS_ALL,
    });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.bookings}?page=1&limit=20&customerId=cus_1&scheduledFrom=2026-02-01`,
      expect.any(Object),
    );

    await listAdminBookings({
      cleanerId: "",
      customerId: "",
      page: 3,
      query: "morning",
      scheduledFrom: "",
      scheduledTo: "",
      serviceId: "svc_1",
      status: "PENDING",
    });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.bookings}?page=3&limit=20&search=morning&serviceId=svc_1&status=PENDING`,
      expect.any(Object),
    );

    await listAdminServices({ page: 1, query: "deep", status: "active" });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.services}?page=1&limit=20&search=deep&active=true`,
      expect.any(Object),
    );

    await listAdminReviews({
      category: "RESIDENTIAL",
      createdFrom: "",
      createdTo: "",
      page: 1,
      query: "",
      rating: "5",
      status: "inactive",
    });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.reviews}?page=1&limit=20&active=false&category=RESIDENTIAL&rating=5`,
      expect.any(Object),
    );

    await listAdminNotifications({
      page: 1,
      query: "ignored-by-backend",
      readState: "unread",
    });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.notifications}?page=1&limit=20&unreadOnly=true`,
      expect.any(Object),
    );

    await listAdminCleaners({ page: 1, query: "maya", status: "ACTIVE" });
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      `${ADMIN_API_PATHS.cleaners}?page=1&limit=20&search=maya&status=ACTIVE`,
      expect.any(Object),
    );

    await getAdminDashboard();
    expect(mockedAdminRequest).toHaveBeenLastCalledWith(
      ADMIN_API_PATHS.dashboard,
      {},
    );
  });

  it("maps customer, booking, and dashboard payloads without inventing fields", async (): Promise<void> => {
    mockedAdminRequest.mockResolvedValueOnce({
      data: listPayload([
        {
          bookingCount: 2,
          createdAt: "2026-03-01T12:00:00.000Z",
          email: "ada@neatly.test",
          id: "cus_1",
          name: "Ada Lovelace",
          phone: null,
          status: "ACTIVE",
        },
      ]),
      ok: true,
      status: 200,
    });

    const customers = await listAdminCustomers({
      joinedFrom: "",
      joinedTo: "",
      page: 1,
      query: "",
      status: "",
    });

    expect(customers).toMatchObject({
      data: {
        customers: [
          {
            email: "ada@neatly.test",
            id: "cus_1",
            name: "Ada Lovelace",
            statusLabel: "Active",
          },
        ],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      ok: true,
    });

    mockedAdminRequest.mockResolvedValueOnce({
      data: listPayload([
        {
          cleaner: { id: "cln_1", name: "Priya" },
          cleanerId: "cln_1",
          customer: { id: "cus_1", name: "Ada Lovelace" },
          customerId: "cus_1",
          id: "bkg_1",
          scheduledAt: "2026-04-01T09:00:00.000Z",
          service: { id: "svc_1", name: "Kitchen reset" },
          serviceId: "svc_1",
          status: "CONFIRMED",
        },
      ]),
      ok: true,
      status: 200,
    });

    const bookings = await listAdminBookings({
      cleanerId: "",
      customerId: "",
      page: 1,
      query: "",
      scheduledFrom: "",
      scheduledTo: "",
      serviceId: "",
      status: ADMIN_BOOKING_STATUS_ALL,
    });

    expect(bookings).toMatchObject({
      data: {
        bookings: [
          {
            cleanerName: "Priya",
            customerName: "Ada Lovelace",
            id: "bkg_1",
            serviceName: "Kitchen reset",
            status: "CONFIRMED",
          },
        ],
      },
      ok: true,
    });

    mockedAdminRequest.mockResolvedValueOnce({
      data: listPayload([
        {
          email: "maya@neatly.test",
          id: "cln_1",
          name: "Maya Chen",
          phone: null,
          status: "ACTIVE",
        },
      ]),
      ok: true,
      status: 200,
    });
    const cleaners = await listAdminCleaners({
      page: 1,
      query: "",
      status: "",
    });
    expect(cleaners).toMatchObject({
      data: {
        cleaners: [{ id: "cln_1", name: "Maya Chen", statusLabel: "Active" }],
      },
      ok: true,
    });

    const view = toAdminDashboardViewModel({
      bookings: {
        assigned: 0,
        cancelled: 0,
        completed: 0,
        confirmed: 1,
        inProgress: 0,
        pending: 2,
        total: 3,
      },
      cleaners: { active: 1, total: 1 },
      customers: { active: 4, total: 5 },
      recentBookings: [],
      recentCustomers: [],
      reviews: { active: 2, total: 2 },
      services: { active: 3, total: 3 },
    });

    expect(view.metrics.customers).toEqual({
      status: "success",
      supportingText: "4 active",
      value: "5",
    });
    expect(JSON.stringify(view)).not.toContain("%");
    expect(JSON.stringify(view)).not.toContain("revenue");
  });

  it("treats missing site settings as an empty read, not an error", async (): Promise<void> => {
    mockedAdminRequest.mockResolvedValueOnce({
      code: "NOT_FOUND",
      forbidden: false,
      message: "Not found",
      ok: false,
      status: 404,
      unauthorized: false,
    });

    await expect(getAdminSettings()).resolves.toEqual({
      data: null,
      ok: true,
      status: 200,
    });
  });
});

describe("handleAdminApiFailure", (): void => {
  it("sends expired Admin sessions to the existing login route", (): void => {
    const assign = vi.fn();

    vi.stubGlobal("location", {
      assign,
      origin: "https://neatly.test",
      pathname: "/admin/customers",
      search: "?page=2",
    });

    handleAdminApiFailure({
      code: "UNAUTHORIZED",
      forbidden: false,
      message: "Session expired",
      ok: false,
      status: 401,
      unauthorized: true,
    });

    expect(assign).toHaveBeenCalledWith(
      `https://neatly.test${AUTH_ADMIN_LOGIN_PATH}?next=%2Fadmin%2Fcustomers%3Fpage%3D2`,
    );

    assign.mockClear();
    handleAdminApiFailure({
      code: "FORBIDDEN",
      forbidden: true,
      message: "Forbidden",
      ok: false,
      status: 403,
      unauthorized: false,
    });
    expect(assign).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
