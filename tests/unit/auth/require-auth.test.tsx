/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RequireAuth } from "@/components/auth/require-auth";
import {
  authFormPaths,
  authRequiredCopy,
  authSessionLoadingCopy,
} from "@/config/auth-ui";

describe("RequireAuth", (): void => {
  it("shows a loading state while the frontend session is unknown", (): void => {
    render(
      <RequireAuth status="unknown">
        <p>Protected content</p>
      </RequireAuth>,
    );

    expect(
      screen.getByRole("heading", { name: authSessionLoadingCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("routes unauthenticated visitors toward login", (): void => {
    render(
      <RequireAuth status="unauthenticated">
        <p>Protected content</p>
      </RequireAuth>,
    );

    expect(
      screen.getByRole("heading", { name: authRequiredCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authRequiredCopy.action }),
    ).toHaveAttribute("href", authFormPaths.login);
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", (): void => {
    render(
      <RequireAuth status="authenticated">
        <p>Protected content</p>
      </RequireAuth>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
