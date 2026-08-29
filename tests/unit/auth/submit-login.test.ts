import { describe, expect, it, vi } from "vitest";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import { adminPostLoginPath, submitAdminLogin } from "@/lib/auth/submit-login";

describe("adminPostLoginPath", (): void => {
  it("accepts a same-origin admin next path and rejects others", (): void => {
    expect(adminPostLoginPath("?next=%2Fadmin%2Fbookings")).toBe(
      "/admin/bookings",
    );
    expect(adminPostLoginPath("?next=https://example.com")).toBe(
      AUTH_ADMIN_HOME_PATH,
    );
    expect(adminPostLoginPath("?next=%2Flogin")).toBe(AUTH_ADMIN_HOME_PATH);
  });
});

describe("submitAdminLogin", (): void => {
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
});
