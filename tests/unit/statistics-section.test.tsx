/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Statistics } from "@/components/sections/statistics";
import { landingStatistics } from "@/config/landing";

describe("Statistics", (): void => {
  it("renders the heading, intro, and three labeled counters", (): void => {
    const { container } = render(<Statistics />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingStatistics.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingStatistics.intro)).toBeInTheDocument();

    for (const slot of landingStatistics.slots) {
      expect(
        screen.getByRole("heading", { level: 3, name: slot.label }),
      ).toBeInTheDocument();
      expect(screen.getByText(slot.body)).toBeInTheDocument();
      expect(typeof slot.value).toBe("number");
    }

    expect(container.querySelectorAll("[data-statistics-item]")).toHaveLength(
      landingStatistics.slots.length,
    );
    expect(container.querySelectorAll("[data-statistics-accent]")).toHaveLength(
      landingStatistics.slots.length,
    );
  });

  it("renders count-up start figures and suffixes", (): void => {
    const { container } = render(<Statistics />);

    expect(container.textContent).toMatch(/0\+/);
    expect(container.textContent).toMatch(/0%/);
  });

  it("still renders content when reduced motion is preferred", (): void => {
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

    const firstSlot = landingStatistics.slots[0];

    if (firstSlot === undefined) {
      throw new Error("Statistics slots are missing.");
    }

    render(<Statistics />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingStatistics.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: firstSlot.label,
      }),
    ).toBeInTheDocument();
  });
});
