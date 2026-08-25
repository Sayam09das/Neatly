/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingPage } from "@/components/landing-page";
import {
  landingHero,
  landingStatistics,
  landingTestimonials,
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
  });

  it("renders the PRD section headings in conversion order", (): void => {
    render(<LandingPage />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual([
      "Trust, stated plainly",
      "Why Neatly",
      "Services",
      "Featured work",
      "How it works",
      "By the numbers",
      "Customer reviews",
      "Ready for a clear quote?",
      "From the journal",
      "Email notes",
      "Neatly",
    ]);
  });
});

describe("landing content", (): void => {
  it("does not invent ratings, counts, or testimonials", (): void => {
    expect(landingHero.trustSignals.join(" ")).not.toMatch(/\d/);
    expect(landingStatistics.slots.some((slot) => "value" in slot)).toBe(false);
    expect(landingTestimonials.emptyMessage).toMatch(/never be invented/i);
  });
});
