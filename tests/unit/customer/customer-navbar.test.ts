import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import { customerHeaderNavigation } from "@/config/customer-nav";
import { landingNavLinks } from "@/config/landing";
import {
  getAdminHomeHref,
  getCustomerInitials,
  getCustomerNavbarMode,
  getCustomerNavbarPresentation,
  toCustomerNavbarSession,
} from "@/lib/customer/navbar";
import type { AuthUser } from "@/types/auth";

const adminUser: AuthUser = {
  email: "ops@neatly.example",
  id: "user_admin_navbar",
  lastLoginAt: null,
  name: "Ops Lead",
  role: "ADMIN",
  status: "ACTIVE",
};

describe("customer navbar presentation", (): void => {
  it("exposes only name and email from the session user", (): void => {
    const session = toCustomerNavbarSession(adminUser);

    expect(session).toEqual({
      identity: { email: adminUser.email, name: adminUser.name },
      role: adminUser.role,
    });
    expect(JSON.stringify(session)).not.toContain(adminUser.id);
    expect(toCustomerNavbarSession(null)).toBeNull();
  });

  it("uses customer chrome on the account area regardless of admin role", (): void => {
    const session = toCustomerNavbarSession(adminUser);
    expect(getCustomerNavbarMode(session, "account")).toBe("customer");
    expect(getCustomerNavbarMode(session, "public")).toBe("admin");
    expect(getCustomerNavbarMode(null, "public")).toBe("guest");
    expect(
      getCustomerNavbarMode(
        {
          identity: { email: "ada@neatly.example", name: "Ada" },
          role: "CUSTOMER",
        },
        "public",
      ),
    ).toBe("customer");
  });

  it("keeps guest, admin, and customer actions on real routes", (): void => {
    const guest = getCustomerNavbarPresentation(null, "public");
    expect(guest.showLogin).toBe(true);
    expect(guest.showQuote).toBe(true);
    expect(guest.showUserMenu).toBe(false);
    expect(guest.primaryLinks).toEqual(landingNavLinks);

    const admin = getCustomerNavbarPresentation(
      toCustomerNavbarSession(adminUser),
      "public",
    );
    expect(admin.showAdmin).toBe(true);
    expect(admin.showLogin).toBe(false);
    expect(admin.accountLinks).toEqual([]);
    expect(getAdminHomeHref()).toBe(AUTH_ADMIN_HOME_PATH);

    const customer = getCustomerNavbarPresentation(
      {
        identity: { email: "ada@neatly.example", name: "Ada" },
        role: "CUSTOMER",
      },
      "account",
    );
    expect(customer.primaryLinks).toEqual(customerHeaderNavigation);
    expect(customer.showNotifications).toBe(true);
    expect(customer.showLogin).toBe(false);
    expect(customer.showQuote).toBe(false);
  });

  it("builds initials from identity without placeholder names", (): void => {
    expect(
      getCustomerInitials({
        email: "ada@neatly.example",
        name: "Ada Lovelace",
      }),
    ).toBe("AL");
    expect(
      getCustomerInitials({ email: "ada@neatly.example", name: "Ada" }),
    ).toBe("AD");
    expect(
      getCustomerInitials({ email: "ada@neatly.example", name: "  " }),
    ).toBe("A");
  });
});
