/** @vitest-environment jsdom */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Testimonials } from "@/components/sections/testimonials";
import { TESTIMONIAL_FRAME_HOLD_MS } from "@/components/sections/testimonials/testimonial-animation";
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
      screen.getByText(landingTestimonials.emptyMessage),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyAttribution),
    ).toBeInTheDocument();
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

  it("renders a featured story and only the fields that exist", (): void => {
    const featured = fixtureStories[0];

    render(<Testimonials testimonials={[featured]} />);

    expect(screen.getByText(featured.quote)).toBeInTheDocument();
    expect(screen.getByText(featured.name)).toBeInTheDocument();
    expect(screen.getByText("Residential cleaning")).toBeInTheDocument();
    expect(screen.queryByText("Westside")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: firstSlot?.alt }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous testimonial" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Show photograph 01 of 03" }),
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
