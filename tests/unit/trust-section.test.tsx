/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustSection } from "@/components/sections/proof";
import { landingTrustProof } from "@/config/landing";

describe("TrustSection", (): void => {
  it("renders the editorial heading, photograph, and four PRD trust principles", (): void => {
    render(<TrustSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTrustProof.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingTrustProof.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingTrustProof.intro)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: landingTrustProof.image.alt }),
    ).toHaveAttribute("src", expect.stringContaining("trust"));

    for (const item of landingTrustProof.items) {
      expect(screen.getByText(item.number)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(item.body)).toBeInTheDocument();
    }

    expect(screen.queryByText("%")).not.toBeInTheDocument();
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

    const firstItem = landingTrustProof.items[0];

    if (firstItem === undefined) {
      throw new Error("Trust proof items are missing.");
    }

    render(<TrustSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTrustProof.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: firstItem.title }),
    ).toBeInTheDocument();
  });
});
