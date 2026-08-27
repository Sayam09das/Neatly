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
    expect(screen.getByText(aboutHero.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: aboutHero.image.alt }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: aboutStory.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutStory.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: aboutStory.image.alt }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: aboutStandard.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutStandard.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: aboutProcess.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutProcess.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: aboutTeam.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutTeam.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: aboutTeam.image.alt }),
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
      .map(
        (heading) => heading.getAttribute("aria-label") ?? heading.textContent,
      );

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

  it("renders commitment principles from approved copy without invented claims", (): void => {
    render(<AboutPage />);

    expect(screen.getByText(aboutCommitment.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: aboutCommitment.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(aboutCommitment.intro)).toBeInTheDocument();

    const commitment = document.querySelector("#commitment");

    expect(commitment).not.toBeNull();

    for (const item of aboutCommitment.items) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
      expect(commitment).toHaveTextContent(item.number);
      expect(screen.getByText(item.body)).toBeInTheDocument();
    }

    expect(screen.queryByText(/years of experience/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/certified/i)).not.toBeInTheDocument();
  });
});
