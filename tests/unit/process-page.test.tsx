/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProcessPage } from "@/components/process-page";
import {
  LANDING_PROCESS_HREF,
  LANDING_REVIEWS_HREF,
  landingFinalCta,
  landingHowItWorks,
  navbarCta,
} from "@/config/landing";

describe("ProcessPage", (): void => {
  it("exposes one h1, the workflow, and conversion landmarks", (): void => {
    render(<ProcessPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: landingHowItWorks.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingHowItWorks.intro)).toBeInTheDocument();
    expect(landingHowItWorks.steps).toHaveLength(7);

    for (const step of landingHowItWorks.steps) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFinalCta.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: navbarCta.label })[0],
    ).toHaveAttribute("href", navbarCta.href);
    expect(
      screen.getAllByRole("link", { name: "How It Works" })[0],
    ).toHaveAttribute("href", LANDING_PROCESS_HREF);
    expect(screen.getAllByRole("link", { name: "Reviews" })[0]).toHaveAttribute(
      "href",
      LANDING_REVIEWS_HREF,
    );
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
  }, 15000);
});
