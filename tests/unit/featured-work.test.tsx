/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedWork } from "@/components/sections/work";
import { landingCtas, landingFeaturedWork } from "@/config/landing";

describe("FeaturedWork", (): void => {
  it("renders the editorial gallery without a broken portfolio index link", (): void => {
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
    expect(
      screen.queryByRole("link", { name: landingCtas.viewWork.label }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/portfolio"]')).toBeNull();
  });
});
