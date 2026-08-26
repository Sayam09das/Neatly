/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { landingWhyNeatly } from "@/config/landing";

describe("WhyNeatly", (): void => {
  it("renders the editorial heading, three benefit cards, and four metric slots", (): void => {
    const { container } = render(<WhyNeatly />);

    expect(
      screen.getByRole("heading", { level: 2, name: landingWhyNeatly.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingWhyNeatly.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingWhyNeatly.intro)).toBeInTheDocument();

    for (const benefit of landingWhyNeatly.benefits) {
      expect(screen.getByText(benefit.index)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: benefit.title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: benefit.image.alt }),
      ).toHaveAttribute("src", expect.stringContaining("why_use"));
    }

    for (const metric of landingWhyNeatly.metrics) {
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    }

    expect(container.querySelectorAll("[data-why-card]")).toHaveLength(
      landingWhyNeatly.benefits.length,
    );
    expect(container.querySelectorAll("[data-why-metric-item]")).toHaveLength(
      landingWhyNeatly.metrics.length,
    );
    expect(container.querySelectorAll("[data-why-metric-accent]")).toHaveLength(
      landingWhyNeatly.metrics.length,
    );
  });

  it("renders published numeric trust figures and suffixes", (): void => {
    const { container } = render(<WhyNeatly />);

    expect(container.textContent).toMatch(/0%/);
    expect(container.textContent).toMatch(/0\+/);
    for (const metric of landingWhyNeatly.metrics) {
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    }
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

    render(<WhyNeatly />);

    expect(
      screen.getByRole("heading", { level: 2, name: landingWhyNeatly.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingWhyNeatly.benefits[0].title,
      }),
    ).toBeInTheDocument();
  });
});
