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
  it("renders four pending figures without invented counts", (): void => {
    render(<TrustIndicators />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingTrustIndicators.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(landingTrustIndicators.pendingValue),
    ).toHaveLength(landingTrustIndicators.items.length);

    for (const item of landingTrustIndicators.items) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
  });
});

describe("FeaturedWork", (): void => {
  it("renders brand photography tiles and the CMS empty notice", (): void => {
    render(<FeaturedWork />);

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
    }
  });
});
