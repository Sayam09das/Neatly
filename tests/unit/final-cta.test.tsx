/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinalCta } from "@/components/sections/final-cta";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import { landingFinalCta } from "@/config/landing";

describe("FinalCta", (): void => {
  it("keeps the quote route as the primary action", (): void => {
    render(<FinalCta />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFinalCta.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingFinalCta.primaryCta.label }),
    ).toHaveAttribute("href", landingFinalCta.primaryCta.href);
    expect(
      screen.getByRole("link", { name: landingFinalCta.secondaryCta.label }),
    ).toHaveAttribute("href", landingFinalCta.secondaryCta.href);
    expect(
      screen.queryByRole("link", {
        name: customerSurfaceCopy.dashboard.title,
      }),
    ).not.toBeInTheDocument();
  });

  it("adds a quiet customer account link when provided", (): void => {
    render(
      <FinalCta
        accountCta={{
          href: CUSTOMER_PATHS.dashboard,
          label: customerSurfaceCopy.dashboard.title,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: landingFinalCta.primaryCta.label }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.quote);
    expect(
      screen.getByRole("link", { name: customerSurfaceCopy.dashboard.title }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboard);
  });
});
