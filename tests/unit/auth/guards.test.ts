import { describe, expect, it } from "vitest";
import { requireRole } from "@/lib/auth/authorization";
import { AuthError } from "@/lib/auth/errors";
import { isSameOriginRequest } from "@/lib/auth/origin";
import { isProtectedAdminPath, isPublicAdminPath } from "@/lib/auth/paths";
import type { AuthUser } from "@/types/auth";

const siteUrl = "https://neatly.example";

function requestWith(headers: Record<string, string>): Request {
  return new Request("https://neatly.example/api/admin/auth/login", {
    method: "POST",
    headers,
  });
}

const adminUser: AuthUser = {
  id: "user_1",
  name: "Neatly Admin",
  email: "admin@neatly.example",
  role: "ADMIN",
  status: "ACTIVE",
  lastLoginAt: null,
};

describe("auth origin checks", (): void => {
  it("accepts a matching Origin and rejects a foreign Origin", (): void => {
    expect(
      isSameOriginRequest(
        requestWith({ origin: "https://neatly.example" }),
        siteUrl,
      ),
    ).toBe(true);
    expect(
      isSameOriginRequest(
        requestWith({ origin: "https://evil.example" }),
        siteUrl,
      ),
    ).toBe(false);
  });
});

describe("admin path protection", (): void => {
  it("keeps login and password-reset routes public", (): void => {
    expect(isPublicAdminPath("/admin/login")).toBe(true);
    expect(isPublicAdminPath("/admin/forgot-password")).toBe(true);
    expect(isPublicAdminPath("/admin/reset-password")).toBe(true);
    expect(isProtectedAdminPath("/admin/quotes")).toBe(true);
    expect(isPublicAdminPath("/admin/quotes")).toBe(false);
  });
});

describe("requireRole", (): void => {
  it("allows the matching role and rejects a weaker role", (): void => {
    expect(requireRole(adminUser, "ADMIN")).toEqual(adminUser);

    try {
      requireRole({ ...adminUser, role: "STAFF" }, "ADMIN");
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AuthError);
      if (!(error instanceof AuthError)) {
        return;
      }
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});
