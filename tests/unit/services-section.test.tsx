/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesSection } from "@/components/sections/services";
import { landingCtas, landingServices } from "@/config/landing";

describe("ServicesSection", (): void => {
  it("renders the editorial heading, three service cards, and explore CTA", (): void => {
    const { container } = render(<ServicesSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingServices.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingServices.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(landingServices.intro)).toBeInTheDocument();

    for (const service of landingServices.items) {
      expect(screen.getByText(service.number)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: service.title }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: service.image.alt }),
      ).toHaveAttribute("src", expect.stringContaining("Services"));
      expect(
        screen.getByRole("link", { name: `View ${service.title}` }),
      ).toHaveAttribute("href", service.href);
    }

    expect(container.querySelectorAll("[data-service-card]")).toHaveLength(
      landingServices.items.length,
    );
    expect(
      screen.getByRole("link", { name: landingCtas.secondary.label }),
    ).toHaveAttribute("href", landingCtas.secondary.href);
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

    render(<ServicesSection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingServices.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingServices.items[0].title,
      }),
    ).toBeInTheDocument();
  });
});
