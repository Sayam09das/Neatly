/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthErrorFallback } from "@/components/auth/auth-error-fallback";
import { AuthStatus } from "@/components/auth/auth-status";
import { authErrorCopy, authFormPaths } from "@/config/auth-ui";

describe("AuthStatus", (): void => {
  it("announces success, error, info, and loading states", (): void => {
    const { rerender } = render(
      <AuthStatus message="Ready." title="All set" tone="success" />,
    );

    expect(
      screen.getByRole("heading", { name: "All set" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Ready.");

    rerender(
      <AuthStatus
        message="Try again."
        title="Unable to continue"
        tone="error"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Unable to continue" }),
    ).toBeInTheDocument();

    rerender(
      <AuthStatus message="Please wait." title="Checking" tone="loading" />,
    );
    expect(
      screen.getByRole("heading", { name: "Checking" }),
    ).toBeInTheDocument();
  });
});

describe("AuthErrorFallback", (): void => {
  it("keeps the error generic and offers retry plus login", async (): Promise<void> => {
    const user = userEvent.setup();
    const reset = vi.fn();

    render(<AuthErrorFallback reset={reset} />);

    expect(
      screen.getByRole("heading", { name: authErrorCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/stack/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authErrorCopy.backToLogin }),
    ).toHaveAttribute("href", authFormPaths.login);

    await user.click(
      screen.getByRole("button", { name: authErrorCopy.action }),
    );
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
