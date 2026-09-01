/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsPage } from "@/components/testimonials-page";
import {
  LANDING_PROCESS_HREF,
  LANDING_REVIEWS_HREF,
  type LandingTestimonial,
  landingFinalCta,
  landingTestimonials,
  navbarCta,
} from "@/config/landing";

const firstSlot = landingTestimonials.emptySlots[0];

describe("TestimonialsPage", (): void => {
  it("exposes one h1 and the empty reviews state without fabricated quotes", (): void => {
    render(
      <TestimonialsPage
        reviews={{
          items: [],
          status: "success",
        }}
      />,
    );

    expect(firstSlot).toBeDefined();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: landingTestimonials.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingTestimonials.intro)).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyHeading),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFinalCta.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: navbarCta.label })[0],
    ).toHaveAttribute("href", navbarCta.href);
    expect(
      screen.getAllByRole("link", { name: "How It Works" })[0],
    ).toHaveAttribute("href", LANDING_PROCESS_HREF);
    expect(screen.getAllByRole("link", { name: "Reviews" })[0]).toHaveAttribute(
      "href",
      LANDING_REVIEWS_HREF,
    );
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
  }, 15000);

  it("renders published reviews instead of reserved empty copy", (): void => {
    const review = {
      date: "August 2026",
      featured: true,
      id: "fixture-1",
      name: "Fixture reviewer one",
      quote: "Fixture quote one for architecture tests only.",
      rating: 5,
      service: "Residential",
    } as const satisfies LandingTestimonial;

    render(
      <TestimonialsPage
        reviews={{
          items: [review],
          status: "success",
        }}
      />,
    );

    expect(screen.getByText(review.quote)).toBeInTheDocument();
    expect(screen.getByText(review.name)).toBeInTheDocument();
    expect(
      screen.queryByText(landingTestimonials.emptyMessage),
    ).not.toBeInTheDocument();
  });
});
