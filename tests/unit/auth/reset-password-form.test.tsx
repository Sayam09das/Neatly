/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authFormPaths, authResetPasswordCopy } from "@/config/auth-ui";
import type { ResetPasswordSubmitResult } from "@/types/auth-form";

const validPassword = "correct-horse-battery-staple";

describe("ResetPasswordForm", (): void => {
  it("exposes password fields, visibility toggles, and a login link", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<ResetPasswordForm />);

    const password = screen.getByLabelText(authResetPasswordCopy.passwordLabel);
    expect(
      screen.getByLabelText(authResetPasswordCopy.confirmPasswordLabel),
    ).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAttribute("autocomplete", "new-password");
    expect(
      screen.getByRole("link", { name: authResetPasswordCopy.backToLogin }),
    ).toHaveAttribute("href", authFormPaths.login);

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("validates required passwords and mismatches", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<ResetPasswordSubmitResult> => ({ status: "ok" }),
    );

    render(<ResetPasswordForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: authResetPasswordCopy.submit }),
    );
    expect(
      await screen.findByText("Use at least 12 characters."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(
      screen.getByLabelText(authResetPasswordCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authResetPasswordCopy.confirmPasswordLabel),
      "different-password-value",
    );
    await user.click(
      screen.getByRole("button", { name: authResetPasswordCopy.submit }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows loading without claiming success for an unconnected ok result", async (): Promise<void> => {
    const user = userEvent.setup();
    let resolveSubmit:
      | ((result: ResetPasswordSubmitResult) => void)
      | undefined;
    const onSubmit = vi.fn(
      async (): Promise<ResetPasswordSubmitResult> =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<ResetPasswordForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authResetPasswordCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authResetPasswordCopy.confirmPasswordLabel),
      validPassword,
    );
    await user.click(
      screen.getByRole("button", { name: authResetPasswordCopy.submit }),
    );

    const loading = await screen.findByRole("button", {
      name: authResetPasswordCopy.submitting,
    });
    expect(loading).toBeDisabled();

    resolveSubmit?.({ status: "ok" });

    await waitFor((): void => {
      expect(
        screen.getByRole("button", { name: authResetPasswordCopy.submit }),
      ).toBeEnabled();
    });
    expect(
      screen.queryByText(authResetPasswordCopy.successHeading),
    ).not.toBeInTheDocument();
  });

  it("shows success only when the submit contract returns updated", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<ResetPasswordSubmitResult> => ({
        status: "updated",
      }),
    );

    render(<ResetPasswordForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authResetPasswordCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authResetPasswordCopy.confirmPasswordLabel),
      validPassword,
    );
    await user.click(
      screen.getByRole("button", { name: authResetPasswordCopy.submit }),
    );

    expect(
      await screen.findByRole("heading", {
        name: authResetPasswordCopy.successHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: authResetPasswordCopy.continueToLogin,
      }),
    ).toHaveAttribute("href", authFormPaths.login);
  });

  it("renders invalid and expired link states without a form", (): void => {
    const { rerender } = render(<ResetPasswordForm linkView="invalid" />);

    expect(
      screen.getByRole("heading", {
        name: authResetPasswordCopy.invalidHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(authResetPasswordCopy.passwordLabel),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authResetPasswordCopy.requestNewLink }),
    ).toHaveAttribute("href", authFormPaths.forgotPassword);

    rerender(<ResetPasswordForm linkView="expired" />);
    expect(
      screen.getByRole("heading", {
        name: authResetPasswordCopy.expiredHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/token/i)).not.toBeInTheDocument();
  });
});
