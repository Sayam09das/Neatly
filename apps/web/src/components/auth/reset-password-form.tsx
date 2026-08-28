"use client";

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
import { AuthFormBanner, AuthTextLink } from "@/components/auth/auth-field";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthStatus } from "@/components/auth/auth-status";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordStrengthHint } from "@/components/auth/password-strength-hint";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { authFormPaths, authResetPasswordCopy } from "@/config/auth-ui";
import {
  authFormBannerMessage,
  collectFieldErrors,
} from "@/lib/auth/form-errors";
import { getPasswordStrength } from "@/lib/auth/password-strength";
import {
  emptyResetPasswordFormValues,
  resetPasswordFormSchema,
} from "@/lib/validations/auth-form.schema";
import { resetPassword } from "@/services/auth-form.service";
import type {
  AuthFormBannerCode,
  ResetLinkView,
  ResetPasswordFormData,
  ResetPasswordFormState,
  ResetPasswordSubmitHandler,
} from "@/types/auth-form";

const RESET_PASSWORD_FIELDS = ["password", "confirmPassword"] as const;

interface ResetPasswordFormProps {
  linkView?: ResetLinkView | null;
  onSubmit?: ResetPasswordSubmitHandler;
}

export function ResetPasswordForm({
  linkView = null,
  onSubmit = resetPassword,
}: ResetPasswordFormProps): ReactElement {
  const instanceId = useId();
  const passwordId = `${instanceId}-password`;
  const confirmId = `${instanceId}-confirm`;
  const passwordErrorId = `${instanceId}-password-error`;
  const confirmErrorId = `${instanceId}-confirm-error`;
  const strengthId = `${instanceId}-strength`;
  const bannerId = `${instanceId}-banner`;
  const [fields, setFields] = useState<ResetPasswordFormData>({
    ...emptyResetPasswordFormValues,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<(typeof RESET_PASSWORD_FIELDS)[number], string>>
  >({});
  const [status, setStatus] = useState<ResetPasswordFormState>("idle");
  const [banner, setBanner] = useState<AuthFormBannerCode | null>(null);
  const isSubmitting = status === "submitting";
  const bannerMessage = banner === null ? null : authFormBannerMessage(banner);
  const passwordStrength = getPasswordStrength(fields.password);
  const passwordDescribedBy = [
    fieldErrors.password === undefined ? undefined : passwordErrorId,
    passwordStrength === null ? undefined : strengthId,
  ]
    .filter((value): value is string => value !== undefined)
    .join(" ");

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const parsed = resetPasswordFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, RESET_PASSWORD_FIELDS));
      setBanner(null);
      return;
    }

    setFieldErrors({});
    setBanner(null);
    setStatus("submitting");

    try {
      const result = await onSubmit({ password: parsed.data.password });

      if (result.status === "error") {
        setBanner(result.code);
        setStatus("idle");
        return;
      }

      if (result.status === "updated") {
        setStatus("success");
        return;
      }

      setStatus("idle");
    } catch {
      setBanner("UNEXPECTED_ERROR");
      setStatus("idle");
    }
  }

  if (linkView === "invalid" || linkView === "expired") {
    const isExpired = linkView === "expired";

    return (
      <AuthEntrance>
        <AuthEntranceItem className="mb-8">
          <BrandLink className="text-foreground focus-visible:ring-offset-background" />
        </AuthEntranceItem>
        <AuthEntranceItem delay="short">
          <AuthStatus
            action={
              <>
                <AuthTextLink href={authFormPaths.forgotPassword}>
                  {authResetPasswordCopy.requestNewLink}
                </AuthTextLink>
                <AuthTextLink href={authFormPaths.login}>
                  {authResetPasswordCopy.backToLogin}
                </AuthTextLink>
              </>
            }
            live={false}
            message={
              isExpired
                ? authResetPasswordCopy.expiredDescription
                : authResetPasswordCopy.invalidDescription
            }
            title={
              isExpired
                ? authResetPasswordCopy.expiredHeading
                : authResetPasswordCopy.invalidHeading
            }
            titleId="reset-password-link-heading"
            tone="error"
          />
        </AuthEntranceItem>
      </AuthEntrance>
    );
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
              <AuthTextLink href={authFormPaths.login}>
                {authResetPasswordCopy.continueToLogin}
              </AuthTextLink>
            }
            message={authResetPasswordCopy.successDescription}
            title={authResetPasswordCopy.successHeading}
            titleId={authResetPasswordCopy.successHeadingId}
            tone="success"
          />
        </AuthEntranceItem>
      </AuthEntrance>
    );
  }

  return (
    <AuthEntrance>
      <AuthFormHeader
        description={authResetPasswordCopy.description}
        heading={authResetPasswordCopy.heading}
        headingId={authResetPasswordCopy.headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <form
          aria-describedby={bannerMessage === null ? undefined : bannerId}
          aria-labelledby={authResetPasswordCopy.headingId}
          className="flex flex-col gap-5"
          method="post"
          noValidate
          onSubmit={(event): void => {
            void handleSubmit(event);
          }}
        >
          <AuthFormBanner id={bannerId} message={bannerMessage} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <AuthPasswordField
                aria-describedby={
                  passwordDescribedBy === "" ? undefined : passwordDescribedBy
                }
                autoComplete="new-password"
                disabled={isSubmitting}
                error={fieldErrors.password}
                errorId={passwordErrorId}
                hideLabel="Hide password"
                htmlFor={passwordId}
                id={passwordId}
                label={authResetPasswordCopy.passwordLabel}
                name="password"
                onChange={handleChange}
                placeholder={authResetPasswordCopy.passwordPlaceholder}
                showLabel="Show password"
                value={fields.password}
              />
              <PasswordStrengthHint
                id={strengthId}
                strength={passwordStrength}
              />
            </div>
            <AuthPasswordField
              aria-describedby={
                fieldErrors.confirmPassword === undefined
                  ? undefined
                  : confirmErrorId
              }
              autoComplete="new-password"
              disabled={isSubmitting}
              error={fieldErrors.confirmPassword}
              errorId={confirmErrorId}
              hideLabel="Hide confirm password"
              htmlFor={confirmId}
              id={confirmId}
              label={authResetPasswordCopy.confirmPasswordLabel}
              name="confirmPassword"
              onChange={handleChange}
              placeholder={authResetPasswordCopy.confirmPasswordPlaceholder}
              showLabel="Show confirm password"
              value={fields.confirmPassword}
            />
          </div>
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            label={authResetPasswordCopy.submit}
            submittingLabel={authResetPasswordCopy.submitting}
          />
        </form>
      </AuthEntranceItem>
      <AuthEntranceItem className="mt-8" delay="medium">
        <p className="text-center text-body-small text-muted-foreground">
          <AuthTextLink href={authFormPaths.login}>
            {authResetPasswordCopy.backToLogin}
          </AuthTextLink>
        </p>
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
