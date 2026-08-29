/** @vitest-environment jsdom */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/hero";
import { HERO_FRAME_COUNT } from "@/components/sections/hero/hero-animation";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import { heroQuoteForm, landingCtas, landingHero } from "@/config/landing";

function getPrimaryQuoteForm(): HTMLElement {
  const form = screen.getAllByRole("form")[0];

  if (form === undefined) {
    throw new Error("Hero quote form was not rendered.");
  }

  return form;
}

describe("Hero", (): void => {
  it("renders one h1, the quote CTA, and an accessible quote form", (): void => {
    render(<Hero />);
    const form = getPrimaryQuoteForm();

    expect(
      screen.getByRole("heading", { level: 1, name: landingHero.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingCtas.primary.label }),
    ).toHaveAttribute("href", landingCtas.primary.href);
    expect(
      screen.getByRole("link", { name: landingHero.secondaryActionLabel }),
    ).toHaveAttribute("href", landingCtas.secondary.href);
    expect(
      within(form).getByLabelText(heroQuoteForm.fields.fullName.label),
    ).toBeInTheDocument();
    expect(
      within(form).getByLabelText(heroQuoteForm.fields.email.label),
    ).toBeInTheDocument();
    expect(
      within(form).getByLabelText(heroQuoteForm.fields.service.label),
    ).toBeInTheDocument();
    expect(
      within(form).getByLabelText(heroQuoteForm.fields.message.label),
    ).toBeInTheDocument();
    expect(
      within(form).getByRole("button", { name: heroQuoteForm.submitLabel }),
    ).toBeEnabled();
  });

  it("can point the secondary action at the customer account route", (): void => {
    render(
      <Hero
        secondaryAction={{
          href: CUSTOMER_PATHS.dashboard,
          label: customerSurfaceCopy.dashboard.title,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: customerSurfaceCopy.dashboard.title }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboard);
    expect(
      screen.queryByRole("link", { name: landingHero.secondaryActionLabel }),
    ).not.toBeInTheDocument();
  });

  it("renders all four cinematic frame slots", (): void => {
    const { container } = render(<Hero />);
    const frames = container.querySelectorAll("[data-hero-frame]");

    expect(landingHero.frames).toHaveLength(HERO_FRAME_COUNT);
    expect(frames).toHaveLength(HERO_FRAME_COUNT);
    for (const [index, frame] of landingHero.frames.entries()) {
      const src =
        frames[index]?.querySelector("img")?.getAttribute("src") ?? "";
      expect(decodeURIComponent(src)).toContain(frame.src);
    }
  });

  it("shows field errors and does not pretend the request was sent", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Hero />);
    const form = getPrimaryQuoteForm();

    await user.click(
      within(form).getByRole("button", { name: heroQuoteForm.submitLabel }),
    );

    expect(within(form).getByText("Enter your name.")).toBeInTheDocument();
    expect(
      screen.queryByText(/received|thank you|sent/i),
    ).not.toBeInTheDocument();
  });

  it("points valid submissions at the full quote page instead of a fake success", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<Hero />);
    const form = getPrimaryQuoteForm();

    await user.type(
      within(form).getByLabelText(heroQuoteForm.fields.fullName.label),
      "Alex Rivera",
    );
    await user.type(
      within(form).getByLabelText(heroQuoteForm.fields.email.label),
      "alex@example.com",
    );
    await user.selectOptions(
      within(form).getByLabelText(heroQuoteForm.fields.service.label),
      "residential",
    );
    await user.click(
      within(form).getByRole("button", { name: heroQuoteForm.submitLabel }),
    );

    expect(
      within(form).getByText(heroQuoteForm.unavailableMessage, {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: landingCtas.primary.label })[0],
    ).toHaveAttribute("href", "/quote");
  });

  it("keeps the quote form in document flow instead of overlaying the headline", (): void => {
    const { container } = render(<Hero />);
    const cards = Array.from(
      container.querySelectorAll("[data-slot='hero-quote-form']"),
    );

    expect(cards.length).toBeGreaterThanOrEqual(1);
    for (const card of cards) {
      expect(card.className).not.toMatch(/\babsolute\b|\bfixed\b/);
    }
  });

  it("still renders the headline, first frame, and form when reduced motion is preferred", (): void => {
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

    const { container } = render(<Hero />);
    const firstFrame = container.querySelector("[data-hero-frame='1']");

    expect(
      screen.getByRole("heading", { level: 1, name: landingHero.heading }),
    ).toBeInTheDocument();
    expect(firstFrame).not.toBeNull();
    expect(firstFrame).toHaveStyle({ opacity: "1" });
    expect(
      within(getPrimaryQuoteForm()).getByLabelText(
        heroQuoteForm.fields.fullName.label,
      ),
    ).toBeInTheDocument();
    expect(
      within(getPrimaryQuoteForm()).getByRole("button", {
        name: heroQuoteForm.submitLabel,
      }),
    ).toBeEnabled();
  });
});
