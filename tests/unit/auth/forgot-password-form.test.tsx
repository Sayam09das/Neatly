/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  AUTH_FORM_BANNER_COPY,
  authForgotPasswordCopy,
  authFormPaths,
} from "@/config/auth-ui";
import type { AuthFormSubmitResult } from "@/types/auth-form";

describe("ForgotPasswordForm", (): void => {
  it("exposes an email label and a login link", (): void => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByLabelText(authForgotPasswordCopy.emailLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authForgotPasswordCopy.backToLogin }),
    ).toHaveAttribute("href", authFormPaths.login);
  });

  it("validates email before submitting", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: authForgotPasswordCopy.submit }),
    );

    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("enters a loading state and keeps the email value", async (): Promise<void> => {
    const user = userEvent.setup();
    let resolveSubmit: ((result: AuthFormSubmitResult) => void) | undefined;
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authForgotPasswordCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.click(
      screen.getByRole("button", { name: authForgotPasswordCopy.submit }),
    );

    const loading = await screen.findByRole("button", {
      name: authForgotPasswordCopy.submitting,
    });
    expect(loading).toBeDisabled();
    expect(
      screen.getByLabelText(authForgotPasswordCopy.emailLabel),
    ).toHaveValue("ada@neatly.example");

    resolveSubmit?.({ status: "ok" });

    expect(
      await screen.findByRole("heading", {
        name: authForgotPasswordCopy.successHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(authForgotPasswordCopy.successDescription),
    ).toBeInTheDocument();
    expect(screen.queryByText("email sent")).not.toBeInTheDocument();
  });

  it("shows a generic error without revealing accounts", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({
        code: "RATE_LIMITED",
        status: "error",
      }),
    );

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authForgotPasswordCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.click(
      screen.getByRole("button", { name: authForgotPasswordCopy.submit }),
    );

    expect(
      await screen.findByText(AUTH_FORM_BANNER_COPY.RATE_LIMITED),
    ).toBeInTheDocument();
  });

  it("returns to the form from the success state", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<ForgotPasswordForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authForgotPasswordCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.click(
      screen.getByRole("button", { name: authForgotPasswordCopy.submit }),
    );

    await screen.findByRole("heading", {
      name: authForgotPasswordCopy.successHeading,
    });
    await user.click(
      screen.getByRole("button", {
        name: authForgotPasswordCopy.successAction,
      }),
    );

    expect(
      screen.getByRole("heading", { name: authForgotPasswordCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authForgotPasswordCopy.backToLogin }),
    ).toHaveAttribute("href", authFormPaths.login);
  });
});
