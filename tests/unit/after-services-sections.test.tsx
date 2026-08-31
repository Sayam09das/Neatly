/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorks } from "@/components/sections/process";
import { TrustIndicators } from "@/components/sections/trust";
import { FeaturedWork } from "@/components/sections/work";
import {
  landingFeaturedWork,
  landingHowItWorks,
  landingTrustIndicators,
} from "@/config/landing";

describe("TrustIndicators", (): void => {
  it("renders four trust indicator items and headings", (): void => {
    render(<TrustIndicators />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTrustIndicators.heading,
      }),
    ).toBeInTheDocument();

    for (const item of landingTrustIndicators.items) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
      expect(typeof item.value).toBe("number");
    }
  });
});

describe("FeaturedWork", (): void => {
  it("renders brand photography tiles and the CMS empty notice", (): void => {
    const { container } = render(<FeaturedWork />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFeaturedWork.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(landingFeaturedWork.emptyMessage),
    ).toBeInTheDocument();

    for (const tile of landingFeaturedWork.tiles) {
      expect(
        screen.getAllByRole("img", { name: tile.alt }).length,
      ).toBeGreaterThan(0);
      expect(screen.getAllByText(tile.label).length).toBeGreaterThan(0);
    }

    expect(
      container.querySelectorAll("[data-work-tile]").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("region", { name: "Featured work photographs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next work photograph" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Previous work photograph" }),
    ).toBeEnabled();
  });

  it("keeps photograph controls available for swipe and keyboard use", (): void => {
    render(<FeaturedWork />);

    expect(
      screen.getByRole("button", { name: "Next work photograph" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Previous work photograph" }),
    ).toBeEnabled();
    expect(
      screen.getByText(
        `01 / ${String(landingFeaturedWork.tiles.length).padStart(2, "0")}`,
      ),
    ).toBeInTheDocument();
  });

  it("still renders the gallery when reduced motion is preferred", (): void => {
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

    render(<FeaturedWork />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFeaturedWork.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", {
        name: landingFeaturedWork.tiles[0]?.alt,
      }).length,
    ).toBeGreaterThan(0);
  });
});

describe("HowItWorks", (): void => {
  it("renders the five customer journey steps", (): void => {
    render(<HowItWorks />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingHowItWorks.heading,
      }),
    ).toBeInTheDocument();
    expect(landingHowItWorks.steps).toHaveLength(5);

    for (const step of landingHowItWorks.steps) {
      expect(screen.getByText(step.number)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("img", { name: landingHowItWorks.image.alt }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingHowItWorks.primaryCta.label }),
    ).toHaveAttribute("href", landingHowItWorks.primaryCta.href);
    expect(
      screen.getByRole("link", { name: landingHowItWorks.secondaryCta.label }),
    ).toHaveAttribute("href", landingHowItWorks.secondaryCta.href);
    expect(
      screen.getByRole("link", { name: "Explore Services" }),
    ).toHaveAttribute("href", landingHowItWorks.secondaryCta.href);
    expect(
      screen.getByRole("link", { name: "Request a Quote" }),
    ).toHaveAttribute("href", landingHowItWorks.steps[1]?.cta.href);
    expect(
      screen.queryByRole("link", {
        name: landingHowItWorks.quotesCta.label,
      }),
    ).not.toBeInTheDocument();
  });

  it("adds a quotes CTA for signed-in customers", (): void => {
    render(<HowItWorks quotesHref={landingHowItWorks.quotesCta.href} />);

    expect(
      screen.getByRole("link", { name: landingHowItWorks.quotesCta.label }),
    ).toHaveAttribute("href", landingHowItWorks.quotesCta.href);
  });

  it("still renders the process when reduced motion is preferred", (): void => {
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

    const firstStep = landingHowItWorks.steps[0];

    if (firstStep === undefined) {
      throw new Error("How it works steps are missing.");
    }

    render(<HowItWorks />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingHowItWorks.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: firstStep.title,
      }),
    ).toBeInTheDocument();
  });
});
