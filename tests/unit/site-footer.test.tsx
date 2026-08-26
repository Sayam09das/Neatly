/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/sections/site-footer";
import {
  landingFooter,
  landingNavLinks,
  landingServices,
} from "@/config/landing";

describe("SiteFooter", (): void => {
  it("renders four columns from live nav and services without invented social links", (): void => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Neatly" }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingFooter.tagline)).toBeInTheDocument();
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

    expect(
      screen.getByRole("link", {
        name: landingFooter.placeholderContact.email,
      }),
    ).toHaveAttribute(
      "href",
      `mailto:${landingFooter.placeholderContact.email}`,
    );
    expect(
      screen.getByText(landingFooter.placeholderContact.phone),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: landingFooter.placeholderContact.phone,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /facebook/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /instagram/i }),
    ).not.toBeInTheDocument();
  });
});
