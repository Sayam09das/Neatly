/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Testimonials } from "@/components/sections/testimonials";
import type { LandingTestimonial } from "@/config/landing";
import { landingTestimonials } from "@/config/landing";

const fixtureStories = [
  {
    id: "fixture-1",
    name: "Fixture reviewer one",
    quote: "Fixture quote one for architecture tests only.",
    service: "Residential cleaning",
  },
  {
    id: "fixture-2",
    name: "Fixture reviewer two",
    quote: "Fixture quote two for architecture tests only.",
    location: "Westside",
  },
] as const satisfies ReadonlyArray<LandingTestimonial>;

describe("Testimonials", (): void => {
  it("renders the editorial empty state without fabricated reviews", (): void => {
    render(<Testimonials />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTestimonials.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingTestimonials.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingTestimonials.intro)).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyAttribution),
    ).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Reserved featured review positions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next testimonial" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
    expect(screen.queryByText(/stars?/i)).not.toBeInTheDocument();
    expect(landingTestimonials.items).toHaveLength(0);
  });

  it("renders a featured story and only the fields that exist", (): void => {
    const featured = fixtureStories[0];

    render(<Testimonials testimonials={[featured]} />);

    expect(screen.getByText(featured.quote)).toBeInTheDocument();
    expect(screen.getByText(featured.name)).toBeInTheDocument();
    expect(screen.getByText("Residential cleaning")).toBeInTheDocument();
    expect(screen.queryByText("Westside")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous testimonial" }),
    ).not.toBeInTheDocument();
  });

  it("moves between published stories with keyboard-accessible controls", async (): Promise<void> => {
    const user = userEvent.setup();
    const first = fixtureStories[0];
    const second = fixtureStories[1];

    render(<Testimonials testimonials={fixtureStories} />);

    expect(screen.getByText(first.quote)).toBeInTheDocument();
    expect(screen.queryByText(second.quote)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next testimonial" }));

    expect(screen.getByText(second.quote)).toBeInTheDocument();
    expect(screen.getByText(second.name)).toBeInTheDocument();
    expect(screen.getByText("Westside")).toBeInTheDocument();
    expect(screen.queryByText("Residential cleaning")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Show story 01 of 02" }),
    );

    expect(screen.getByText(first.quote)).toBeInTheDocument();
  });
});
