/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutPage } from "@/components/about-page";
import {
  aboutCommitment,
  aboutCta,
  aboutHero,
  aboutProcess,
  aboutQuality,
  aboutStandard,
  aboutStory,
  aboutTeam,
  aboutWhy,
} from "@/config/about";
import { landingTestimonials } from "@/config/landing";

describe("AboutPage architecture", (): void => {
  it("exposes one h1 and the required landmarks", (): void => {
    render(<AboutPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 1, name: aboutHero.heading }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("renders the brand story headings in editorial order", (): void => {
    render(<AboutPage />);

    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual([
      aboutStory.heading,
      aboutStandard.heading,
      aboutProcess.heading,
      aboutTeam.heading,
      aboutCommitment.heading,
      aboutQuality.heading,
      aboutWhy.heading,
      landingTestimonials.heading,
      aboutCta.heading,
      "Email notes",
      "Neatly",
    ]);
  });

  it("keeps people and testimonials content-ready without invented names", (): void => {
    render(<AboutPage />);

    expect(screen.getByText(aboutTeam.emptyMessage)).toBeInTheDocument();
    expect(
      screen.getByText(landingTestimonials.emptyMessage),
    ).toBeInTheDocument();
    expect(landingTestimonials.items).toHaveLength(0);
    expect(screen.queryByText(/years of experience/i)).not.toBeInTheDocument();
  });

  it("renders process stages and standard principles from approved copy", (): void => {
    render(<AboutPage />);

    for (const step of aboutProcess.steps) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }

    for (const principle of aboutStandard.principles) {
      expect(
        screen.getByRole("heading", { level: 3, name: principle.title }),
      ).toBeInTheDocument();
    }
  });
});
