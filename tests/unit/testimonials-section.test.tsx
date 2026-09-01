/** @vitest-environment jsdom */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Testimonials } from "@/components/sections/testimonials";
import { TESTIMONIAL_FRAME_HOLD_MS } from "@/components/sections/testimonials/testimonial-animation";
import { TestimonialsSkeleton } from "@/components/sections/testimonials/testimonials-skeleton";
import type { LandingTestimonial } from "@/config/landing";
import { landingTestimonials } from "@/config/landing";

const fixtureStories = [
  {
    date: "August 2026",
    featured: true,
    id: "fixture-1",
    name: "Fixture reviewer one",
    quote: "Fixture quote one for architecture tests only.",
    rating: 5,
    service: "Residential",
  },
  {
    id: "fixture-2",
    location: "Westside",
    name: "Fixture reviewer two",
    quote: "Fixture quote two for architecture tests only.",
    rating: 4,
  },
] as const satisfies ReadonlyArray<LandingTestimonial>;

const firstSlot = landingTestimonials.emptySlots[0];
const secondSlot = landingTestimonials.emptySlots[1];

describe("Testimonials", (): void => {
  it("renders the editorial empty state without fabricated reviews", (): void => {
    const { container } = render(<Testimonials />);

    expect(firstSlot).toBeDefined();
    expect(secondSlot).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTestimonials.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingTestimonials.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingTestimonials.intro)).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyHeading),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyAttribution),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingTestimonials.emptyCta.label }),
    ).toHaveAttribute("href", landingTestimonials.emptyCta.href);
    expect(container.querySelectorAll("img")).toHaveLength(
      landingTestimonials.emptySlots.length,
    );
    expect(screen.getByRole("img", { name: firstSlot?.alt })).toHaveAttribute(
      "src",
      expect.stringContaining("01_slot"),
    );
    expect(
      screen.queryByRole("img", { name: secondSlot?.alt }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyMediaLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Reserved story photographs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show photograph 01 of 03" }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Show photograph 02 of 03" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show photograph 03 of 03" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next photograph" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next testimonial" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
    expect(screen.queryByText(/stars?/i)).not.toBeInTheDocument();
    expect(landingTestimonials.items).toHaveLength(0);
  });

  it("can render the section heading as the page h1", (): void => {
    render(<Testimonials headingLevel="h1" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: landingTestimonials.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: landingTestimonials.heading,
      }),
    ).not.toBeInTheDocument();
  });

  it("crossfades reserved photographs from the 01 02 03 controls", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<Testimonials />);

    await user.click(
      screen.getByRole("button", { name: "Show photograph 02 of 03" }),
    );

    expect(screen.getByRole("img", { name: secondSlot?.alt })).toHaveAttribute(
      "src",
      expect.stringContaining("02_slot"),
    );
    expect(
      screen.queryByRole("img", { name: firstSlot?.alt }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show photograph 02 of 03" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("auto-advances reserved photographs", (): void => {
    vi.useFakeTimers();

    try {
      render(<Testimonials />);

      expect(
        screen.getByRole("img", { name: firstSlot?.alt }),
      ).toBeInTheDocument();

      act((): void => {
        vi.advanceTimersByTime(TESTIMONIAL_FRAME_HOLD_MS);
      });

      expect(
        screen.getByRole("img", { name: secondSlot?.alt }),
      ).toHaveAttribute("src", expect.stringContaining("02_slot"));
      expect(
        screen.getByRole("button", { name: "Show photograph 02 of 03" }),
      ).toHaveAttribute("aria-current", "true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders a featured review from real fields without reserved portraits", (): void => {
    const featured = fixtureStories[0];

    render(<Testimonials testimonials={[featured]} />);

    expect(screen.getByText(featured.quote)).toBeInTheDocument();
    expect(screen.getByText(featured.name)).toBeInTheDocument();
    expect(screen.getByText("Residential")).toBeInTheDocument();
    expect(screen.getByText("August 2026")).toBeInTheDocument();
    expect(screen.getByText("5 out of 5 stars")).toBeInTheDocument();
    expect(screen.queryByText("Westside")).not.toBeInTheDocument();
    expect(screen.getByText("FO")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous testimonial" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Show photograph 01 of 03" }),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="featured-review"]'),
    ).not.toBeNull();
  });

  it("shows published reviews in a static grid without inventing a featured card", (): void => {
    const first = fixtureStories[0];
    const second = fixtureStories[1];

    render(
      <Testimonials testimonials={[{ ...first, featured: false }, second]} />,
    );

    expect(screen.getByText(first.quote)).toBeInTheDocument();
    expect(screen.getByText(second.quote)).toBeInTheDocument();
    expect(screen.getByText(second.name)).toBeInTheDocument();
    expect(screen.getByText("Westside")).toBeInTheDocument();
    expect(screen.getByText("4 out of 5 stars")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next testimonial" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="featured-review"]')).toBeNull();
    expect(
      screen.queryByRole("link", { name: landingTestimonials.emptyCta.label }),
    ).not.toBeInTheDocument();
  });

  it("renders a calm fallback when public reviews cannot be loaded", (): void => {
    render(<Testimonials status="error" />);

    expect(
      screen.getByText(landingTestimonials.errorMessage),
    ).toBeInTheDocument();
    expect(screen.queryByText(/api error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingTestimonials.emptyCta.label }),
    ).toHaveAttribute("href", landingTestimonials.emptyCta.href);
  });

  it("keeps the loading skeleton layout-stable and unlabeled as an error", (): void => {
    render(<TestimonialsSkeleton />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByText(landingTestimonials.loadingLabel),
    ).toBeInTheDocument();
    expect(screen.queryByText(/api error/i)).not.toBeInTheDocument();
  });
});
