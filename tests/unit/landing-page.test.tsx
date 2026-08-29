/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import {
  landingCtas,
  landingHowItWorks,
  landingServices,
  landingStatistics,
  landingTestimonials,
  landingTrustIndicators,
  landingTrustProof,
  landingWhyNeatly,
} from "@/config/landing";

describe("LandingPage architecture", (): void => {
  it("exposes one h1 and the required landmarks", (): void => {
    render(<LandingPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(
      screen
        .getByRole("main")
        .querySelectorAll("[data-closing-band-media] img"),
    ).toHaveLength(1);
    expect(
      screen.getByRole("main").querySelector("footer"),
    ).toBeInTheDocument();
  }, 15000);

  it("renders the PRD section headings in conversion order", (): void => {
    render(<LandingPage />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual([
      landingWhyNeatly.heading,
      landingServices.heading,
      "Trust, stated plainly",
      "Featured work",
      landingHowItWorks.heading,
      landingTrustProof.heading,
      "By the numbers",
      landingTestimonials.heading,
      "Ready for a clear quote?",
      "From the journal",
      "Email notes",
      "Neatly",
    ]);
  }, 15000);
});

describe("landing content", (): void => {
  it("renders verified trust metrics and clear testimonials standards", (): void => {
    expect(
      landingWhyNeatly.metrics.every(
        (metric) => typeof metric.value === "number",
      ),
    ).toBe(true);
    expect(
      landingTrustIndicators.items.every(
        (item) => typeof item.value === "number",
      ),
    ).toBe(true);
    expect(
      landingStatistics.slots.every((slot) => typeof slot.value === "number"),
    ).toBe(true);
    expect(landingTestimonials.intro).toMatch(/never be invented/i);
    expect(landingTestimonials.items).toHaveLength(0);
  });

  it("uses existing public routes and omits unpublished marketing indexes", (): void => {
    render(<LandingPage />);

    expect(
      screen.getAllByRole("link", { name: landingCtas.primary.label })[0],
    ).toHaveAttribute("href", landingCtas.primary.href);
    expect(
      screen.getAllByRole("link", { name: landingCtas.secondary.label })[0],
    ).toHaveAttribute("href", landingCtas.secondary.href);
    expect(document.querySelector('a[href="/portfolio"]')).toBeNull();
    expect(document.querySelector('a[href="/blog"]')).toBeNull();
    expect(document.querySelector('a[href="/contact"]')).toBeNull();
  }, 15000);

  it("adds a customer account action without exposing admin navigation", (): void => {
    render(
      <LandingPage
        session={{
          identity: { email: "ada@neatly.example", name: "Ada" },
          role: "CUSTOMER",
        }}
      />,
    );

    expect(
      screen.getAllByRole("link", {
        name: customerSurfaceCopy.dashboard.title,
      }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", {
        name: customerSurfaceCopy.dashboard.title,
      })[0],
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboard);
    expect(
      screen.queryByRole("link", { name: "Admin" }),
    ).not.toBeInTheDocument();
  }, 15000);
});
