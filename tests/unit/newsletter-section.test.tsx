/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Newsletter } from "@/components/sections/newsletter";
import { landingCtas, landingNewsletter } from "@/config/landing";

describe("Newsletter", (): void => {
  it("renders a disabled capture form and does not invent a live list", (): void => {
    render(<Newsletter />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingNewsletter.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingNewsletter.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingNewsletter.description)).toBeInTheDocument();
    expect(screen.getByLabelText(landingNewsletter.inputLabel)).toBeDisabled();
    expect(
      screen.getByRole("button", { name: landingCtas.subscribe.label }),
    ).toBeDisabled();
    expect(
      screen.getByText(landingNewsletter.unavailableMessage),
    ).toBeInTheDocument();
    expect(screen.getByText(landingNewsletter.consent)).toBeInTheDocument();
    expect(landingNewsletter.image.src).toContain("newsletter");
  });
});
