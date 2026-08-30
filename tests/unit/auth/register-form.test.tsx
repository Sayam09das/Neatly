/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "@/components/auth/register-form";
import {
  authFormPaths,
  authRegisterCopy,
  authSocialCopy,
} from "@/config/auth-ui";
import { PASSWORD_STRENGTH_LABELS } from "@/lib/auth/password-strength";
import type { AuthFormSubmitResult } from "@/types/auth-form";

const validPassword = "correct-horse-battery-staple";

describe("RegisterForm", (): void => {
  it("exposes accessible labels and a sign-in link", (): void => {
    render(<RegisterForm />);

    expect(
      screen.getByLabelText(authRegisterCopy.nameLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(authRegisterCopy.emailLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(authRegisterCopy.passwordLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(authRegisterCopy.confirmPasswordLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authRegisterCopy.loginAction }),
    ).toHaveAttribute("href", authFormPaths.login);
    const google = screen.getByRole("button", { name: authSocialCopy.google });
    const apple = screen.getByRole("button", { name: authSocialCopy.apple });
    const facebook = screen.getByRole("button", {
      name: authSocialCopy.facebook,
    });
    const submit = screen.getByRole("button", {
      name: authRegisterCopy.submit,
    });

    expect(google).toBeInTheDocument();
    expect(apple).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();
    expect(
      submit.compareDocumentPosition(google) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("validates required fields on empty submit", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<RegisterForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: authRegisterCopy.submit }),
    );

    expect(await screen.findByText("Enter a name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects mismatched passwords", async (): Promise<void> => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authRegisterCopy.nameLabel),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.confirmPasswordLabel),
      "different-password-value",
    );
    await user.click(
      screen.getByRole("button", { name: authRegisterCopy.submit }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("toggles password visibility and shows strength labels", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    const password = screen.getByLabelText(authRegisterCopy.passwordLabel);
    await user.type(password, "abc");
    expect(screen.getByText(PASSWORD_STRENGTH_LABELS.weak)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("enters a loading state for a valid form without claiming success", async (): Promise<void> => {
    const user = userEvent.setup();
    let resolveSubmit: ((result: AuthFormSubmitResult) => void) | undefined;
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    render(<RegisterForm mode="admin" onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authRegisterCopy.nameLabel),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.confirmPasswordLabel),
      validPassword,
    );
    await user.click(
      screen.getByRole("button", { name: authRegisterCopy.submit }),
    );

    const loadingButton = await screen.findByRole("button", {
      name: authRegisterCopy.submitting,
    });
    expect(loadingButton).toBeDisabled();
    expect(screen.queryByText("account created")).not.toBeInTheDocument();

    resolveSubmit?.({ status: "ok" });

    await waitFor((): void => {
      expect(
        screen.getByRole("button", { name: authRegisterCopy.submit }),
      ).toBeEnabled();
    });
    expect(onSubmit).toHaveBeenCalledWith({
      email: "ada@neatly.example",
      name: "Ada Lovelace",
      password: validPassword,
    });
  });

  it("assigns successHref after a successful submit", async (): Promise<void> => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { assign },
    });
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(
      <RegisterForm
        mode="admin"
        onSubmit={onSubmit}
        successHref="/dashboard"
      />,
    );

    await user.type(
      screen.getByLabelText(authRegisterCopy.nameLabel),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.confirmPasswordLabel),
      validPassword,
    );
    await user.click(
      screen.getByRole("button", { name: authRegisterCopy.submit }),
    );

    await waitFor((): void => {
      expect(assign).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("sends customers to verify-email after register", async (): Promise<void> => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { assign },
    });
    const onSubmit = vi.fn(
      async (): Promise<AuthFormSubmitResult> => ({ status: "ok" }),
    );

    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(authRegisterCopy.nameLabel),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.emailLabel),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.passwordLabel),
      validPassword,
    );
    await user.type(
      screen.getByLabelText(authRegisterCopy.confirmPasswordLabel),
      validPassword,
    );
    await user.click(
      screen.getByRole("button", { name: authRegisterCopy.submit }),
    );

    await waitFor((): void => {
      expect(assign).toHaveBeenCalledWith(
        "/verify-email?email=ada%40neatly.example",
      );
    });
  });

  it("shows a frontend-only notice for social registration", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.click(
      screen.getByRole("button", { name: authSocialCopy.apple }),
    );

    expect(
      await screen.findByText(authSocialCopy.unavailable),
    ).toBeInTheDocument();
    expect(screen.queryByText("account created")).not.toBeInTheDocument();
  });
});
