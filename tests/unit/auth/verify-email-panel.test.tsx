/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";
import { AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS } from "@/config/auth";
import {
  AUTH_FORM_BANNER_COPY,
  authFormPaths,
  authVerifyEmailCopy,
} from "@/config/auth-ui";
import type { ResendVerificationResult } from "@/types/auth-form";

describe("VerifyEmailPanel", (): void => {
  it("renders the inbox copy and a login link", (): void => {
    render(<VerifyEmailPanel />);

    expect(
      screen.getByRole("heading", { name: authVerifyEmailCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(authVerifyEmailCopy.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: authVerifyEmailCopy.resend }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: authVerifyEmailCopy.backToLogin }),
    ).toHaveAttribute("href", authFormPaths.login);
  });

  it("masks a provided email and never invents one", (): void => {
    render(<VerifyEmailPanel email="ada@neatly.example" />);

    expect(
      screen.getByText(
        authVerifyEmailCopy.inboxWithEmail("a***@neatly.example"),
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("ada@neatly.example")).not.toBeInTheDocument();
  });

  it("shows sending, sent, and cooldown states after resend", async (): Promise<void> => {
    const user = userEvent.setup();
    let resolveResend: ((result: ResendVerificationResult) => void) | undefined;
    const onResend = vi.fn(
      async (): Promise<ResendVerificationResult> =>
        new Promise((resolve) => {
          resolveResend = resolve;
        }),
    );

    render(<VerifyEmailPanel onResend={onResend} />);

    await user.click(
      screen.getByRole("button", { name: authVerifyEmailCopy.resend }),
    );

    const sending = await screen.findByRole("button", {
      name: authVerifyEmailCopy.sending,
    });
    expect(sending).toBeDisabled();

    resolveResend?.({ status: "sent" });

    expect(
      await screen.findByText(authVerifyEmailCopy.sent),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: authVerifyEmailCopy.cooldown(
          AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS,
        ),
      }),
    ).toBeDisabled();
  });

  it("shows a generic error without tokens", async (): Promise<void> => {
    const user = userEvent.setup();
    const onResend = vi.fn(
      async (): Promise<ResendVerificationResult> => ({
        code: "NETWORK_ERROR",
        status: "error",
      }),
    );

    render(<VerifyEmailPanel onResend={onResend} />);

    await user.click(
      screen.getByRole("button", { name: authVerifyEmailCopy.resend }),
    );

    expect(
      await screen.findByText(AUTH_FORM_BANNER_COPY.NETWORK_ERROR),
    ).toBeInTheDocument();
  });

  it("renders expired, verified, and already-verified views", (): void => {
    const { rerender } = render(<VerifyEmailPanel initialView="expired" />);

    expect(
      screen.getByRole("heading", {
        name: authVerifyEmailCopy.expiredHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: authVerifyEmailCopy.resend }),
    ).toBeInTheDocument();

    rerender(<VerifyEmailPanel initialView="verified" />);
    expect(
      screen.getByRole("heading", {
        name: authVerifyEmailCopy.verifiedHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: authVerifyEmailCopy.resend }),
    ).not.toBeInTheDocument();

    rerender(<VerifyEmailPanel initialView="already-verified" />);
    expect(
      screen.getByRole("heading", {
        name: authVerifyEmailCopy.alreadyVerifiedHeading,
      }),
    ).toBeInTheDocument();
  });
});
