/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Newsletter } from "@/components/sections/newsletter";
import { landingCtas, landingNewsletter } from "@/config/landing";

describe("Newsletter", (): void => {
  it("renders a live capture form and does not invent a public subscriber list", (): void => {
    render(<Newsletter />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingNewsletter.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingNewsletter.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingNewsletter.description)).toBeInTheDocument();
    expect(screen.getByLabelText(landingNewsletter.inputLabel)).toBeEnabled();
    expect(
      screen.getByRole("button", { name: landingCtas.subscribe.label }),
    ).toBeEnabled();
    expect(screen.getByText(landingNewsletter.consent)).toBeInTheDocument();
    expect(screen.queryByText(/not connected yet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/@example\.test/i)).not.toBeInTheDocument();
    expect(landingNewsletter.image.src).toContain("newsletter");
  });
});
