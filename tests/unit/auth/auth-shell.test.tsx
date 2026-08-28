/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthShell } from "@/components/auth/auth-shell";
import {
  authLegalLinks,
  authLoginVisual,
  authPanelCopy,
} from "@/config/auth-ui";

describe("AuthShell", (): void => {
  it("renders a main landmark and legal links without marketing chrome", (): void => {
    render(
      <AuthShell image={authLoginVisual}>
        <p>Form slot</p>
      </AuthShell>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Form slot")).toBeInTheDocument();
    expect(screen.getByText(authPanelCopy.headline)).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    for (const link of authLegalLinks) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });

  it("omits the visual panel in compact mode", (): void => {
    render(
      <AuthShell>
        <p>Compact form</p>
      </AuthShell>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Compact form")).toBeInTheDocument();
    expect(screen.queryByText(authPanelCopy.headline)).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
