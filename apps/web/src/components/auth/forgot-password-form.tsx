"use client";

import { Button, Input } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useState,
} from "react";
import {
  AuthEntrance,
  AuthEntranceItem,
} from "@/components/auth/auth-entrance";
import {
  AuthField,
  AuthFormBanner,
  AuthTextLink,
} from "@/components/auth/auth-field";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { AuthStatus } from "@/components/auth/auth-status";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import {
  AUTH_PILL_INPUT_CLASS_NAME,
  authForgotPasswordCopy,
  authFormPaths,
} from "@/config/auth-ui";
import {
  authFormBannerMessage,
  collectFieldErrors,
} from "@/lib/auth/form-errors";
import { forgotPasswordSchema } from "@/lib/validations/auth.schema";
import { emptyForgotPasswordFormValues } from "@/lib/validations/auth-form.schema";
import { requestPasswordReset } from "@/services/auth-form.service";
import type {
  AuthFormBannerCode,
  ForgotPasswordFormData,
  ForgotPasswordFormState,
  ForgotPasswordSubmitHandler,
} from "@/types/auth-form";

const FORGOT_PASSWORD_FIELDS = ["email"] as const;

interface ForgotPasswordFormProps {
  onSubmit?: ForgotPasswordSubmitHandler;
}

export function ForgotPasswordForm({
  onSubmit = requestPasswordReset,
}: ForgotPasswordFormProps): ReactElement {
  const instanceId = useId();
  const emailId = `${instanceId}-email`;
  const emailErrorId = `${instanceId}-email-error`;
  const bannerId = `${instanceId}-banner`;
  const [fields, setFields] = useState<ForgotPasswordFormData>({
    ...emptyForgotPasswordFormValues,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<(typeof FORGOT_PASSWORD_FIELDS)[number], string>>
  >({});
  const [status, setStatus] = useState<ForgotPasswordFormState>("idle");
  const [banner, setBanner] = useState<AuthFormBannerCode | null>(null);
  const isSubmitting = status === "submitting";
  const bannerMessage = banner === null ? null : authFormBannerMessage(banner);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setFields({ email: event.target.value });
  }

  function handleTryAnotherEmail(): void {
    setStatus("idle");
    setBanner(null);
    setFieldErrors({});
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsed = forgotPasswordSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, FORGOT_PASSWORD_FIELDS));
      setBanner(null);
      return;
    }

    setFieldErrors({});
    setBanner(null);
    setStatus("submitting");

    try {
      const result = await onSubmit(parsed.data);

      if (result.status === "error") {
        setBanner(result.code);
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch {
      setBanner("UNEXPECTED_ERROR");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <AuthEntrance>
        <AuthEntranceItem className="mb-8">
          <BrandLink className="text-foreground focus-visible:ring-offset-background" />
        </AuthEntranceItem>
        <AuthEntranceItem delay="short">
          <AuthStatus
            action={
              <>
                <Button
                  onClick={handleTryAnotherEmail}
                  type="button"
                  variant="link"
                >
                  {authForgotPasswordCopy.successAction}
                </Button>
                <AuthTextLink href={authFormPaths.login}>
                  {authForgotPasswordCopy.backToLogin}
                </AuthTextLink>
              </>
            }
            message={authForgotPasswordCopy.successDescription}
            title={authForgotPasswordCopy.successHeading}
            titleId={authForgotPasswordCopy.successHeadingId}
            tone="success"
          />
        </AuthEntranceItem>
      </AuthEntrance>
    );
  }

  return (
    <AuthEntrance>
      <AuthFormHeader
        description={authForgotPasswordCopy.description}
        heading={authForgotPasswordCopy.heading}
        headingId={authForgotPasswordCopy.headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <form
          aria-describedby={bannerMessage === null ? undefined : bannerId}
          aria-labelledby={authForgotPasswordCopy.headingId}
          className="flex flex-col gap-5"
          method="post"
          noValidate
          onSubmit={(event): void => {
            void handleSubmit(event);
          }}
        >
          <AuthFormBanner id={bannerId} message={bannerMessage} />
          <AuthField
            error={fieldErrors.email}
            errorId={emailErrorId}
            htmlFor={emailId}
            label={authForgotPasswordCopy.emailLabel}
          >
            <Input
              aria-describedby={
                fieldErrors.email === undefined ? undefined : emailErrorId
              }
              aria-invalid={fieldErrors.email !== undefined}
              autoComplete="email"
              className={AUTH_PILL_INPUT_CLASS_NAME}
              disabled={isSubmitting}
              id={emailId}
              inputMode="email"
              name="email"
              onChange={handleChange}
              placeholder={authForgotPasswordCopy.emailPlaceholder}
              type="email"
              value={fields.email}
            />
          </AuthField>
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            label={authForgotPasswordCopy.submit}
            submittingLabel={authForgotPasswordCopy.submitting}
          />
        </form>
      </AuthEntranceItem>
      <AuthEntranceItem className="mt-8" delay="medium">
        <p className="text-center text-body-small text-muted-foreground">
          <AuthTextLink href={authFormPaths.login}>
            {authForgotPasswordCopy.backToLogin}
          </AuthTextLink>
        </p>
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
