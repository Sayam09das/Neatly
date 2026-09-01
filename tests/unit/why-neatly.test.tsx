/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhyNeatly } from "@/components/sections/why-neatly";
import { landingWhyNeatly } from "@/config/landing";

const unsupportedWhyClaims = [
  "best cleaning",
  "#1 cleaning",
  "10,000+",
  "500+",
  "background-checked",
  "100% insured",
  "same-day",
];

describe("WhyNeatly", (): void => {
  it("renders the editorial heading, four workflow features, and existing CTAs", (): void => {
    const { container } = render(<WhyNeatly />);

    expect(
      screen.getByRole("heading", { level: 2, name: landingWhyNeatly.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingWhyNeatly.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingWhyNeatly.intro)).toBeInTheDocument();

    for (const feature of landingWhyNeatly.features) {
      expect(screen.getByText(feature.index)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: feature.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(feature.body)).toBeInTheDocument();
    }

    expect(container.querySelectorAll("[data-why-feature]")).toHaveLength(
      landingWhyNeatly.features.length,
    );
    expect(container.querySelectorAll("[data-why-feature-icon]")).toHaveLength(
      landingWhyNeatly.features.length,
    );
    expect(container.querySelectorAll("[data-why-card]")).toHaveLength(0);
    expect(container.querySelectorAll("[data-why-metric-item]")).toHaveLength(
      0,
    );
    expect(container.querySelectorAll("img")).toHaveLength(0);

    expect(
      screen.getByRole("link", { name: landingWhyNeatly.primaryCta.label }),
    ).toHaveAttribute("href", landingWhyNeatly.primaryCta.href);
    expect(
      screen.getByRole("link", { name: landingWhyNeatly.secondaryCta.label }),
    ).toHaveAttribute("href", landingWhyNeatly.secondaryCta.href);
  });

  it("keeps quote and process CTAs keyboard-accessible", (): void => {
    render(<WhyNeatly />);

    const quoteCta = screen.getByRole("link", {
      name: landingWhyNeatly.primaryCta.label,
    });
    const processCta = screen.getByRole("link", {
      name: landingWhyNeatly.secondaryCta.label,
    });

    quoteCta.focus();
    expect(quoteCta).toHaveFocus();
    processCta.focus();
    expect(processCta).toHaveFocus();
  });

  it("does not publish unsupported business claims", (): void => {
    const { container } = render(<WhyNeatly />);
    const copy = (container.textContent ?? "").toLowerCase();

    for (const claim of unsupportedWhyClaims) {
      expect(copy).not.toContain(claim);
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
        name: landingWhyNeatly.features[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingWhyNeatly.primaryCta.label }),
    ).toBeInTheDocument();
  });
});
