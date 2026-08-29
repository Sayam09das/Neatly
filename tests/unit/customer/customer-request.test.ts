import { afterEach, describe, expect, it, vi } from "vitest";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import { parseJsonApiResponse } from "@/lib/api/envelope";
import {
  assertCustomerRequestPath,
  CustomerRequestError,
  customerRequest,
} from "@/lib/customer/request";

describe("assertCustomerRequestPath", (): void => {
  it("allows customer API paths and rejects admin or identity query params", (): void => {
    expect(() => {
      assertCustomerRequestPath(CUSTOMER_API_PATHS.profile);
    }).not.toThrow();
    expect(() => {
      assertCustomerRequestPath("/api/v1/admin/bookings");
    }).toThrow(CustomerRequestError);
    expect(() => {
      assertCustomerRequestPath(
        `${CUSTOMER_API_PATHS.bookings}?customerId=someone-else`,
      );
    }).toThrow(CustomerRequestError);
    expect(() => {
      assertCustomerRequestPath(`${CUSTOMER_API_PATHS.profile}?userId=user_2`);
    }).toThrow(CustomerRequestError);
  });
});

describe("parseJsonApiResponse", (): void => {
  it("maps documented HTTP statuses to safe customer-facing codes", (): void => {
    expect(
      parseJsonApiResponse(200, { success: true, data: { id: "c1" } }),
    ).toEqual({
      data: { id: "c1" },
      ok: true,
      status: 200,
    });
    expect(parseJsonApiResponse(401, null)).toMatchObject({
      code: "UNAUTHORIZED",
      ok: false,
      unauthorized: true,
    });
    expect(parseJsonApiResponse(403, null)).toMatchObject({
      code: "FORBIDDEN",
      forbidden: true,
    });
    expect(parseJsonApiResponse(404, null)).toMatchObject({
      code: "NOT_FOUND",
    });
    expect(parseJsonApiResponse(409, null)).toMatchObject({
      code: "CONFLICT",
    });
    expect(parseJsonApiResponse(422, null)).toMatchObject({
      code: "INVALID_INPUT",
    });
    expect(parseJsonApiResponse(429, null)).toMatchObject({
      code: "RATE_LIMITED",
    });
    expect(parseJsonApiResponse(500, null)).toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Unable to complete this request. Please try again.",
      ok: false,
    });
  });
});

describe("customerRequest", (): void => {
  afterEach((): void => {
    vi.unstubAllGlobals();
  });

  it("sends same-origin JSON requests without inventing payloads", async (): Promise<void> => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async (): Promise<unknown> => ({
        data: { name: "Ada" },
        success: true,
      }),
      status: 200,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await customerRequest<{ name: string }>(
      CUSTOMER_API_PATHS.profile,
    );

    expect(result).toEqual({
      data: { name: "Ada" },
      ok: true,
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      CUSTOMER_API_PATHS.profile,
      expect.objectContaining({
        cache: "no-store",
        credentials: "same-origin",
      }),
    );
  });
});
