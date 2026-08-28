/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/login-form";
import {
  AUTH_FORM_BANNER_COPY,
  authFormPaths,
  authLoginCopy,
  authSocialCopy,
} from "@/config/auth-ui";
import type { AuthFormSubmitResult } from "@/types/auth-form";

describe("LoginForm", (): void => {
  it("exposes accessible labels and navigation links", (): void => {
    render(<LoginForm />);

    expect(screen.getByLabelText(authLoginCopy.emailLabel)).toBeInTheDocument();
    expect(
      screen.getByLabelText(authLoginCopy.passwordLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authLoginCopy.forgotPassword }),
    ).toHaveAttribute("href", authFormPaths.forgotPassword);
    expect(
      screen.getByRole("link", { name: authLoginCopy.registerAction }),
    ).toHaveAttribute("href", authFormPaths.register);
    expect(
      screen.getByRole("button", { name: authSocialCopy.google }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: authSocialCopy.apple }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: authSocialCopy.facebook }),
    ).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: authLoginCopy.submit });
    const google = screen.getByRole("button", { name: authSocialCopy.google });
    expect(
      submit.compareDocumentPosition(google) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("shows email and password validation on empty submit", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: authLoginCopy.submit }),
    );

    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without submitting", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authLoginCopy.emailLabel),
      "not-an-email",
    );
    await user.type(
      screen.getByLabelText(authLoginCopy.passwordLabel),
      "secret",
    );
    await user.click(
      screen.getByRole("button", { name: authLoginCopy.submit }),
    );

    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("toggles password visibility without using a text label in the field", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const password = screen.getByLabelText(authLoginCopy.passwordLabel);
    expect(password).toHaveAttribute("type", "password");
    expect(screen.queryByText("Show password")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("enters a loading state and retains values on valid submit", async (): Promise<void> => {
    const user = userEvent.setup();
    let resolveSubmit: ((result: AuthFormSubmitResult) => void) | undefined;
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authLoginCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authLoginCopy.passwordLabel),
      "a-private-password",
    );
    await user.click(
      screen.getByRole("button", { name: authLoginCopy.submit }),
    );

    const loadingButton = await screen.findByRole("button", {
      name: authLoginCopy.submitting,
    });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText(authLoginCopy.emailLabel)).toHaveValue(
      "ada@neatly.example",
    );
    expect(screen.queryByText("Login successful")).not.toBeInTheDocument();

    resolveSubmit?.({ status: "ok" });

    await waitFor((): void => {
      expect(
        screen.getByRole("button", { name: authLoginCopy.submit }),
      ).toBeEnabled();
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("can render a prepared backend error without inventing success", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({
        code: "INVALID_CREDENTIALS",
        status: "error",
      }),
    );

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authLoginCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authLoginCopy.passwordLabel),
      "a-private-password",
    );
    await user.click(
      screen.getByRole("button", { name: authLoginCopy.submit }),
    );

    expect(
      await screen.findByText(AUTH_FORM_BANNER_COPY.INVALID_CREDENTIALS),
    ).toBeInTheDocument();
    expect(screen.queryByText("Login successful")).not.toBeInTheDocument();
  });

  it("shows a frontend-only notice for social sign-in", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSocialSubmit = vi.fn(
      async (): Promise<{ status: "unavailable" }> => ({
        status: "unavailable",
      }),
    );

    render(<LoginForm onSocialSubmit={onSocialSubmit} />);

    await user.click(
      screen.getByRole("button", { name: authSocialCopy.google }),
    );

    expect(
      await screen.findByText(authSocialCopy.unavailable),
    ).toBeInTheDocument();
    expect(onSocialSubmit).toHaveBeenCalledWith("google");
    expect(screen.queryByText("Login successful")).not.toBeInTheDocument();
  });
});
