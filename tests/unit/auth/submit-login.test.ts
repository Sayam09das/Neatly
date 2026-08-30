import { describe, expect, it, vi } from "vitest";
import { AUTH_ADMIN_HOME_PATH, AUTH_CUSTOMER_HOME_PATH } from "@/config/auth";
import {
  adminPostLoginPath,
  customerPostLoginPath,
  resolveCustomerLoginDestination,
  submitAdminLogin,
} from "@/lib/auth/submit-login";

describe("adminPostLoginPath", (): void => {
  it("accepts a same-origin admin next path and rejects others", (): void => {
    expect(adminPostLoginPath("?next=%2Fadmin%2Fbookings")).toBe(
      "/admin/bookings",
    );
    expect(adminPostLoginPath("?next=%2Fdashboard%2Fbookings")).toBe(
      "/dashboard/bookings",
    );
    expect(adminPostLoginPath("?next=https://example.com")).toBe(
      AUTH_ADMIN_HOME_PATH,
    );
    expect(adminPostLoginPath("?next=%2Flogin")).toBe(AUTH_ADMIN_HOME_PATH);
    expect(adminPostLoginPath("?next=%2Fdashboard%2F..%2Fadmin")).toBe(
      AUTH_ADMIN_HOME_PATH,
    );
  });
});

describe("customerPostLoginPath", (): void => {
  it("accepts a same-origin customer next path and rejects others", (): void => {
    expect(customerPostLoginPath("?next=%2Fdashboard%2Fbookings")).toBe(
      "/dashboard/bookings",
    );
    expect(customerPostLoginPath("?next=%2Fbooking")).toBe("/booking");
    expect(
      customerPostLoginPath("?next=%2Fservices%2Fdeep-cleaning%2Fapply"),
    ).toBe("/services/deep-cleaning/apply");
    expect(
      customerPostLoginPath(
        "?next=%2Fdashboard%2Fservices%2Fdeep-cleaning%2Fapply",
      ),
    ).toBe("/dashboard/services/deep-cleaning/apply");
    expect(customerPostLoginPath("?next=%2Fcleaner")).toBe("/cleaner");
    expect(customerPostLoginPath("?next=%2Fcleaner%2Fjobs")).toBe(
      "/cleaner/jobs",
    );
    expect(
      customerPostLoginPath("?next=%2Fquote%3Fservice%3Ddeep-cleaning"),
    ).toBe("/quote?service=deep-cleaning");
    expect(customerPostLoginPath("?next=%2Fadmin%2Fbookings")).toBe(
      AUTH_CUSTOMER_HOME_PATH,
    );
    expect(customerPostLoginPath("?next=https://example.com")).toBe(
      AUTH_CUSTOMER_HOME_PATH,
    );
  });
});

describe("resolveCustomerLoginDestination", (): void => {
  it("sends admin operators to the admin dashboard", async (): Promise<void> => {
    await expect(resolveCustomerLoginDestination("", "ADMIN")).resolves.toBe(
      AUTH_ADMIN_HOME_PATH,
    );
    await expect(
      resolveCustomerLoginDestination("?next=%2Fadmin%2Fbookings", "ADMIN"),
    ).resolves.toBe("/admin/bookings");
  });
});

describe("submitAdminLogin", (): void => {
  it("returns the authenticated role on success", async (): Promise<void> => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<{
          data: { user: { role: string } };
          success: true;
        }> => ({
          data: { user: { role: "ADMIN" } },
          success: true,
        }),
        ok: true,
      }),
    );

    const result = await submitAdminLogin({
      email: "neatlyadmin@test.com",
      password: "correct-horse-battery-staple",
    });

    expect(result).toEqual({
      role: "ADMIN",
      status: "ok",
    });
    vi.unstubAllGlobals();
  });

  it("maps a failed login envelope to invalid credentials", async (): Promise<void> => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<{
          error: { code: string };
          success: false;
        }> => ({
          error: { code: "INVALID_CREDENTIALS" },
          success: false,
        }),
        ok: false,
      }),
    );

    const result = await submitAdminLogin({
      email: "ada@neatly.example",
      password: "wrong-password",
    });

    expect(result).toEqual({
      code: "INVALID_CREDENTIALS",
      status: "error",
    });
    vi.unstubAllGlobals();
  });

  it("maps an unverified customer login to EMAIL_UNVERIFIED", async (): Promise<void> => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async (): Promise<{
          error: { code: string };
          success: false;
        }> => ({
          error: { code: "EMAIL_UNVERIFIED" },
          success: false,
        }),
        ok: false,
      }),
    );

    const result = await submitAdminLogin({
      email: "sayam@neatly.example",
      password: "correct-horse-battery-staple",
    });

    expect(result).toEqual({
      code: "EMAIL_UNVERIFIED",
      status: "error",
    });
    vi.unstubAllGlobals();
  });
});
