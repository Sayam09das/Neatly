"use client";

import { Button } from "@neatly/ui";
import { type ReactElement, useEffect, useId, useState } from "react";
import {
  AuthEntrance,
  AuthEntranceItem,
} from "@/components/auth/auth-entrance";
import { AuthFormBanner, AuthTextLink } from "@/components/auth/auth-field";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { AuthStatus } from "@/components/auth/auth-status";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS } from "@/config/auth";
import { authFormPaths, authVerifyEmailCopy } from "@/config/auth-ui";
import { authFormBannerMessage } from "@/lib/auth/form-errors";
import { getRemainingCooldownSeconds, maskEmail } from "@/lib/auth/mask-email";
import {
  resendVerification,
  submitVerifyEmail,
} from "@/services/auth-form.service";
import type {
  AuthFormBannerCode,
  ResendVerificationHandler,
  VerifyEmailView,
} from "@/types/auth-form";

const COOLDOWN_MS = AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS * 1000;

interface VerifyEmailPanelProps {
  email?: string;
  initialView?: VerifyEmailView;
  onResend?: ResendVerificationHandler;
  token?: string | null;
}

export function VerifyEmailPanel({
  email,
  initialView = "idle",
  onResend = resendVerification,
  token = null,
}: VerifyEmailPanelProps): ReactElement {
  const instanceId = useId();
  const bannerId = `${instanceId}-banner`;
  const maskedEmail = email === undefined ? null : maskEmail(email);
  const [tokenView, setTokenView] = useState<VerifyEmailView | null>(
    token !== null && token.trim() !== "" ? "verifying" : null,
  );
  const view = tokenView ?? initialView;
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "cooldown"
  >("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [banner, setBanner] = useState<AuthFormBannerCode | null>(null);
  const isSending = resendStatus === "sending";
  const bannerMessage = banner === null ? null : authFormBannerMessage(banner);
  const description =
    maskedEmail === null
      ? authVerifyEmailCopy.description
      : authVerifyEmailCopy.inboxWithEmail(maskedEmail);

  useEffect((): (() => void) | undefined => {
    if (token === null || token.trim() === "") {
      return undefined;
    }

    let cancelled = false;

    void submitVerifyEmail(token).then((result) => {
      if (cancelled) {
        return;
      }

      if (result.status === "ok") {
        setTokenView("verified");
        return;
      }

      if (result.code === "EXPIRED_LINK") {
        setTokenView("expired");
        return;
      }

      setTokenView("invalid");
    });

    return (): void => {
      cancelled = true;
    };
  }, [token]);

  useEffect((): (() => void) | undefined => {
    if (cooldownUntil === null) {
      return undefined;
    }

    const tick = (): void => {
      const remaining = getRemainingCooldownSeconds(Date.now(), cooldownUntil);
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setCooldownUntil(null);
        setResendStatus("idle");
      }
    };

    tick();
    const timer = window.setInterval(tick, 250);

    return (): void => {
      window.clearInterval(timer);
    };
  }, [cooldownUntil]);

  async function handleResend(): Promise<void> {
    if (isSending || cooldownUntil !== null) {
      return;
    }

    setBanner(null);
    setResendStatus("sending");

    try {
      const result = await onResend(email);

      if (result.status === "error") {
        setBanner(result.code);
        setResendStatus("idle");
        return;
      }

      setResendStatus("cooldown");
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      setSecondsLeft(AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS);
    } catch {
      setBanner("UNEXPECTED_ERROR");
      setResendStatus("idle");
    }
  }

  if (view === "verifying") {
    return (
      <VerifyEmailStatus
        message={authVerifyEmailCopy.verifyingDescription}
        title={authVerifyEmailCopy.verifyingHeading}
        tone="info"
      />
    );
  }

  if (view === "verified") {
    return (
      <VerifyEmailStatus
        actionLabel={authVerifyEmailCopy.continueToLogin}
        message={authVerifyEmailCopy.verifiedDescription}
        title={authVerifyEmailCopy.verifiedHeading}
        tone="success"
      />
    );
  }

  if (view === "already-verified") {
    return (
      <VerifyEmailStatus
        message={authVerifyEmailCopy.alreadyVerifiedDescription}
        title={authVerifyEmailCopy.alreadyVerifiedHeading}
        tone="info"
      />
    );
  }

  if (view === "invalid") {
    return (
      <VerifyEmailStatus
        message={authVerifyEmailCopy.invalidDescription}
        title={authVerifyEmailCopy.invalidHeading}
        tone="error"
      />
    );
  }

  const heading =
    view === "expired"
      ? authVerifyEmailCopy.expiredHeading
      : authVerifyEmailCopy.heading;
  const headingId =
    view === "expired"
      ? "verify-email-expired-heading"
      : authVerifyEmailCopy.headingId;
  const intro =
    view === "expired" ? authVerifyEmailCopy.expiredDescription : description;

  const resendLabel =
    cooldownUntil === null
      ? isSending
        ? authVerifyEmailCopy.sending
        : authVerifyEmailCopy.resend
      : authVerifyEmailCopy.cooldown(secondsLeft);

  return (
    <AuthEntrance>
      <AuthFormHeader
        description={intro}
        heading={heading}
        headingId={headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <div className="flex flex-col gap-5">
          <AuthFormBanner id={bannerId} message={bannerMessage} />
          {resendStatus === "cooldown" ? (
            <p aria-live="polite" className="text-body-small text-foreground">
              {authVerifyEmailCopy.sent}
            </p>
          ) : null}
          <Button
            className="w-full"
            disabled={isSending || cooldownUntil !== null}
            isLoading={isSending}
            onClick={(): void => {
              void handleResend();
            }}
            type="button"
            variant="secondary"
          >
            {isSending ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
                />
                {authVerifyEmailCopy.sending}
              </>
            ) : (
              resendLabel
            )}
          </Button>
        </div>
      </AuthEntranceItem>
      <AuthEntranceItem className="mt-8" delay="medium">
        <p className="text-center text-body-small text-muted-foreground">
          <AuthTextLink href={authFormPaths.login}>
            {authVerifyEmailCopy.backToLogin}
          </AuthTextLink>
        </p>
      </AuthEntranceItem>
    </AuthEntrance>
  );
}

interface VerifyEmailStatusProps {
  actionLabel?: string;
  message: string;
  title: string;
  tone: "success" | "error" | "info";
}

function VerifyEmailStatus({
  actionLabel = authVerifyEmailCopy.backToLogin,
  message,
  title,
  tone,
}: VerifyEmailStatusProps): ReactElement {
  return (
    <AuthEntrance>
      <AuthEntranceItem className="mb-8">
        <BrandLink className="text-foreground focus-visible:ring-offset-background" />
      </AuthEntranceItem>
      <AuthEntranceItem delay="short">
        <AuthStatus
          action={
            <AuthTextLink href={authFormPaths.login}>
              {actionLabel}
            </AuthTextLink>
          }
          live={false}
          message={message}
          title={title}
          titleId="verify-email-status-heading"
          tone={tone}
        />
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
