import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_HOME_PATH, AUTH_REGISTER_ALIAS_PATH } from "@/config/auth";
import { CUSTOMER_LOGIN_PATH, customerNavbarCopy } from "@/config/customer";
import { customerFooterAccountLinks } from "@/config/customer-nav";
import { landingFooter, navbarCta } from "@/config/landing";
import { getCustomerFooterUtilityNav } from "@/lib/customer/footer";

describe("customer footer presentation", (): void => {
  it("keeps guest support on real auth and quote routes", (): void => {
    const utility = getCustomerFooterUtilityNav(null, "public");

    expect(utility).not.toBeNull();
    expect(utility?.heading).toBe(landingFooter.supportHeading);
    expect(utility?.links.map((item) => item.href)).toEqual([
      CUSTOMER_LOGIN_PATH,
      AUTH_REGISTER_ALIAS_PATH,
      navbarCta.href,
    ]);
    expect(utility?.links.some((item) => item.href === "#")).toBe(false);
  });

  it("exposes account routes for customers and never guest login", (): void => {
    const utility = getCustomerFooterUtilityNav(
      {
        identity: { email: "ada@neatly.example", name: "Ada" },
        role: "CUSTOMER",
      },
      "account",
    );

    expect(utility?.heading).toBe(landingFooter.accountHeading);
    expect(utility?.links).toEqual(customerFooterAccountLinks);
    expect(
      utility?.links.some(
        (item) => item.label === customerNavbarCopy.loginLabel,
      ),
    ).toBe(false);
  });

  it("does not treat an admin visitor as a customer", (): void => {
    const utility = getCustomerFooterUtilityNav(
      {
        identity: { email: "ops@neatly.example", name: "Ops" },
        role: "ADMIN",
      },
      "public",
    );

    expect(utility?.heading).toBe(landingFooter.supportHeading);
    expect(utility?.links[0]).toEqual({
      href: AUTH_ADMIN_HOME_PATH,
      label: customerNavbarCopy.adminLabel,
    });
    expect(utility?.links.some((item) => item.label === "Dashboard")).toBe(
      false,
    );
  });
});
