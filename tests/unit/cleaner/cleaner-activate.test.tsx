/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CleanerActivateForm } from "@/components/cleaner/activate/cleaner-activate-form";
import { cleanerActivateCopy } from "@/config/cleaner";

describe("Cleaner activation", (): void => {
  it("shows an invalid invitation without revealing token details", (): void => {
    render(<CleanerActivateForm token={null} />);
    expect(
      screen.getByText(cleanerActivateCopy.invalidHeading),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cleanerActivateCopy.invalidDescription),
    ).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("tokenHash");
  });
});
