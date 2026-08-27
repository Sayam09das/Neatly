/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  landingCtas,
  landingFooter,
  landingNavLinks,
  landingServices,
} from "@/config/landing";

describe("SiteFooter", (): void => {
  it("renders brand, nav, services, and contact without invented social links", (): void => {
    render(<SiteFooter />);

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
        name: landingFooter.contactHeading,
      }),
    ).toBeInTheDocument();

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

    expect(screen.getByText(landingFooter.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(landingFooter.hoursLabel)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: landingFooter.placeholderContact.email,
      }),
    ).toHaveAttribute(
      "href",
      `mailto:${landingFooter.placeholderContact.email}`,
    );
    expect(
      screen.getByRole("link", {
        name: landingFooter.placeholderContact.phone,
      }),
    ).toHaveAttribute("href", `tel:${landingFooter.placeholderContact.phone}`);
    expect(screen.getByText(landingFooter.copyright)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /facebook/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /instagram/i }),
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
      screen.getByRole("link", {
        name: landingFooter.placeholderContact.email,
      }),
    ).toBeInTheDocument();
  });
});
