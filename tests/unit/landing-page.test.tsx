/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";
import {
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
  });

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
  });
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
});
