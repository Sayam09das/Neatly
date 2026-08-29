/** @vitest-environment jsdom */

import { describe, expect, it, vi } from "vitest";
import { AUTH_LOGIN_ALIAS_PATH } from "@/config/auth";
import { requestAdminLogout } from "@/lib/api/admin-request";
import {
  clearCustomerCache,
  subscribeCustomerCacheClear,
} from "@/lib/customer/cache";
import { customerQueryKey, customerQueryKeys } from "@/lib/customer/query-keys";
import { signOutCustomer } from "@/lib/customer/session";

vi.mock("@/lib/api/admin-request", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/api/admin-request")>();

  return {
    ...actual,
    requestAdminLogout: vi.fn(),
  };
});

describe("customer cache ownership", (): void => {
  it("scopes query keys to the session user and rejects empty identity", (): void => {
    expect(customerQueryKeys.bookings("user_1")).toEqual([
      "customer",
      "user_1",
      "bookings",
    ]);
    expect(customerQueryKey("user_1", "profile")).not.toEqual(
      customerQueryKey("user_2", "profile"),
    );
    expect(() => customerQueryKey("", "profile")).toThrow();
  });

  it("clears customer cache listeners on logout", async (): Promise<void> => {
    const listener = vi.fn();
    const unsubscribe = subscribeCustomerCacheClear(listener);
    vi.mocked(requestAdminLogout).mockResolvedValue({
      data: { signedOut: true },
      ok: true,
      status: 200,
    });

    const assign = vi.fn();
    vi.stubGlobal("window", {
      location: {
        assign,
      },
    });

    await signOutCustomer();

    expect(requestAdminLogout).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith(AUTH_LOGIN_ALIAS_PATH);

    unsubscribe();
    clearCustomerCache();
    expect(listener).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
