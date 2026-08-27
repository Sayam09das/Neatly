/** @vitest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
      expect(screen.getByRole("img", { name: tile.alt })).toBeInTheDocument();
      expect(screen.getByText(tile.label)).toBeInTheDocument();
    }

    expect(container.querySelectorAll("[data-work-tile]")).toHaveLength(
      landingFeaturedWork.tiles.length,
    );
    expect(
      screen.getByRole("region", { name: "Featured work photographs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next work photograph" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous work photograph" }),
    ).toBeDisabled();
  });

  it("scrolls the photograph track when Next is pressed", (): void => {
    const { container } = render(<FeaturedWork />);
    const gallery = container.querySelector("[data-work-gallery]");

    expect(gallery).toBeInstanceOf(HTMLElement);

    if (!(gallery instanceof HTMLElement)) {
      return;
    }

    Object.defineProperty(gallery, "clientWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(gallery, "scrollWidth", {
      configurable: true,
      value: 2400,
    });
    Object.defineProperty(gallery, "scrollLeft", {
      configurable: true,
      value: 0,
      writable: true,
    });

    const firstItem = gallery.querySelector("li");

    if (firstItem instanceof HTMLElement) {
      firstItem.getBoundingClientRect = (): DOMRect =>
        ({
          bottom: 200,
          height: 200,
          left: 0,
          right: 400,
          toJSON: (): string => "",
          top: 0,
          width: 400,
          x: 0,
          y: 0,
        }) as DOMRect;
    }

    const scrollTo = vi.fn();
    gallery.scrollTo = scrollTo as typeof gallery.scrollTo;

    fireEvent.click(
      screen.getByRole("button", { name: "Next work photograph" }),
    );

    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ left: expect.any(Number) }),
    );
    const options = scrollTo.mock.calls[0]?.[0] as { left: number } | undefined;
    expect(options?.left).toBeGreaterThan(0);
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
      screen.getByRole("img", { name: landingFeaturedWork.tiles[0]?.alt }),
    ).toBeInTheDocument();
  });
});

describe("HowItWorks", (): void => {
  it("renders the three PRD process steps", (): void => {
    render(<HowItWorks />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingHowItWorks.heading,
      }),
    ).toBeInTheDocument();

    for (const step of landingHowItWorks.steps) {
      expect(screen.getByText(step.number)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: step.image.alt }),
      ).toBeInTheDocument();
    }
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
