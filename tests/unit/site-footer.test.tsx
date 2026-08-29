/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/sections/site-footer";
import { AUTH_ADMIN_HOME_PATH, AUTH_REGISTER_ALIAS_PATH } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerNavbarCopy,
} from "@/config/customer";
import { customerFooterAccountLinks } from "@/config/customer-nav";
import {
  landingCtas,
  landingFooter,
  landingNavLinks,
  landingServices,
} from "@/config/landing";

describe("SiteFooter", (): void => {
  it("renders brand, public nav, and support without invented contact or social links", (): void => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Neatly" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Neatly home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText(landingFooter.tagline)).toBeInTheDocument();
    expect(screen.getByText(landingFooter.socialPending)).toBeInTheDocument();
    expect(screen.getByText(landingFooter.quoteHint)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingCtas.primary.label }),
    ).toHaveAttribute("href", landingCtas.primary.href);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingFooter.exploreHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingFooter.servicesHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingFooter.supportHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: landingFooter.contactHeading,
      }),
    ).not.toBeInTheDocument();

    for (const item of landingNavLinks) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }

    for (const service of landingServices.items) {
      expect(screen.getByRole("link", { name: service.title })).toHaveAttribute(
        "href",
        service.href,
      );
    }

    expect(
      screen.getByRole("link", { name: customerNavbarCopy.loginLabel }),
    ).toHaveAttribute("href", CUSTOMER_LOGIN_PATH);
    expect(
      screen.getByRole("link", { name: landingFooter.registerLabel }),
    ).toHaveAttribute("href", AUTH_REGISTER_ALIAS_PATH);
    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("hello@neatly.com")).not.toBeInTheDocument();
    expect(screen.queryByText("+1 (800) 555-6328")).not.toBeInTheDocument();
    expect(screen.queryByText("100 Main Street")).not.toBeInTheDocument();
    expect(screen.getByText(landingFooter.copyright)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(
      screen.queryByRole("link", { name: /facebook/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /instagram/i }),
    ).not.toBeInTheDocument();
  });

  it("exposes account routes for an authenticated customer and hides guest auth links", (): void => {
    render(
      <SiteFooter
        session={{
          identity: { email: "ada@neatly.example", name: "Ada" },
          role: "CUSTOMER",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingFooter.accountHeading,
      }),
    ).toBeInTheDocument();

    for (const item of customerFooterAccountLinks) {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      CUSTOMER_PATHS.dashboard,
    );
    expect(
      screen.queryByRole("link", { name: customerNavbarCopy.loginLabel }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("ada@neatly.example")).not.toBeInTheDocument();
  });

  it("keeps admin visitors on public support without customer account links", (): void => {
    render(
      <SiteFooter
        session={{
          identity: { email: "ops@neatly.example", name: "Ops" },
          role: "ADMIN",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: customerNavbarCopy.adminLabel }),
    ).toHaveAttribute("href", AUTH_ADMIN_HOME_PATH);
    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: customerNavbarCopy.loginLabel }),
    ).not.toBeInTheDocument();
  });

  it("still renders the footer when reduced motion is preferred", (): void => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: query.includes("prefers-reduced-motion: reduce"),
          media: query,
          onchange: null,
          addEventListener: (): void => undefined,
          removeEventListener: (): void => undefined,
          addListener: (): void => undefined,
          removeListener: (): void => undefined,
          dispatchEvent: (): boolean => false,
        }) as MediaQueryList,
    });

    render(<SiteFooter />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Neatly" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerNavbarCopy.loginLabel }),
    ).toBeInTheDocument();
  });
});
