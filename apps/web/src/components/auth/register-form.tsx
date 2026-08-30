"use client";

import { Input } from "@neatly/ui";
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
  AuthSwitchPrompt,
} from "@/components/auth/auth-field";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthSocialActions } from "@/components/auth/auth-social-actions";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordStrengthHint } from "@/components/auth/password-strength-hint";
import { AUTH_VERIFY_EMAIL_ALIAS_PATH } from "@/config/auth";
import {
  AUTH_PILL_INPUT_CLASS_NAME,
  authFormPaths,
  authRegisterCopy,
  authSocialCopy,
} from "@/config/auth-ui";
import {
  authFormBannerMessage,
  collectFieldErrors,
} from "@/lib/auth/form-errors";
import { getPasswordStrength } from "@/lib/auth/password-strength";
import { submitAdminRegister } from "@/lib/auth/submit-register";
import {
  emptyRegisterFormValues,
  registerFormSchema,
} from "@/lib/validations/auth-form.schema";
import { registerUser, submitSocialAuth } from "@/services/auth-form.service";
import type {
  AuthFormBannerCode,
  AuthSocialProvider,
  AuthSocialSubmitHandler,
  RegisterFormData,
  RegisterFormState,
  RegisterFormSubmitHandler,
} from "@/types/auth-form";

const REGISTER_FIELDS = [
  "name",
  "email",
  "password",
  "confirmPassword",
] as const;

interface RegisterFormProps {
  mode?: "admin" | "customer";
  onSocialSubmit?: AuthSocialSubmitHandler;
  onSubmit?: RegisterFormSubmitHandler;
  resolveSuccessHref?: (email: string) => string;
  successHref?: string;
}

export function RegisterForm({
  mode = "customer",
  onSocialSubmit = submitSocialAuth,
  onSubmit,
  resolveSuccessHref,
  successHref,
}: RegisterFormProps): ReactElement {
  const submitRegister =
    onSubmit ?? (mode === "admin" ? submitAdminRegister : registerUser);
  const instanceId = useId();
  const nameId = `${instanceId}-name`;
  const emailId = `${instanceId}-email`;
  const passwordId = `${instanceId}-password`;
  const confirmId = `${instanceId}-confirm`;
  const nameErrorId = `${instanceId}-name-error`;
  const emailErrorId = `${instanceId}-email-error`;
  const passwordErrorId = `${instanceId}-password-error`;
  const confirmErrorId = `${instanceId}-confirm-error`;
  const strengthId = `${instanceId}-strength`;
  const bannerId = `${instanceId}-banner`;
  const [fields, setFields] = useState<RegisterFormData>({
    ...emptyRegisterFormValues,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<(typeof REGISTER_FIELDS)[number], string>>
  >({});
  const [status, setStatus] = useState<RegisterFormState>("idle");
  const [banner, setBanner] = useState<AuthFormBannerCode | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
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

    const parsed = registerFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, REGISTER_FIELDS));
      setBanner(null);
      setSocialNotice(null);
      return;
    }

    setFieldErrors({});
    setBanner(null);
    setSocialNotice(null);
    setStatus("submitting");

    let keepSubmitting = false;

    try {
      const result = await submitRegister({
        email: parsed.data.email,
        name: parsed.data.name,
        password: parsed.data.password,
      });

      if (result.status === "error") {
        setBanner(result.code);
        return;
      }

      const nextHref =
        resolveSuccessHref !== undefined
          ? resolveSuccessHref(parsed.data.email)
          : successHref !== undefined && successHref !== ""
            ? successHref
            : mode === "customer"
              ? `${AUTH_VERIFY_EMAIL_ALIAS_PATH}?email=${encodeURIComponent(parsed.data.email)}`
              : undefined;

      if (nextHref !== undefined && nextHref !== "") {
        keepSubmitting = true;
        window.location.assign(nextHref);
        return;
      }
    } finally {
      if (!keepSubmitting) {
        setStatus("idle");
      }
    }
  }

  async function handleSocialSelect(
    provider: AuthSocialProvider,
  ): Promise<void> {
    if (isSubmitting) {
      return;
    }

    setSocialNotice(null);
    const result = await onSocialSubmit(provider);

    if (result.status === "unavailable") {
      setSocialNotice(authSocialCopy.unavailable);
      return;
    }

    if (result.status === "error") {
      setBanner(result.code);
    }
  }

  return (
    <AuthEntrance>
      <AuthFormHeader
        description={authRegisterCopy.description}
        heading={authRegisterCopy.heading}
        headingId={authRegisterCopy.headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <form
          aria-describedby={bannerMessage === null ? undefined : bannerId}
          aria-labelledby={authRegisterCopy.headingId}
          className="flex flex-col gap-5"
          method="post"
          noValidate
          onSubmit={(event): void => {
            void handleSubmit(event);
          }}
        >
          <AuthFormBanner id={bannerId} message={bannerMessage} />
          <div className="flex flex-col gap-4">
            <AuthField
              error={fieldErrors.name}
              errorId={nameErrorId}
              hideLabel
              htmlFor={nameId}
              label={authRegisterCopy.nameLabel}
            >
              <Input
                aria-describedby={
                  fieldErrors.name === undefined ? undefined : nameErrorId
                }
                aria-invalid={fieldErrors.name !== undefined}
                autoComplete="name"
                className={AUTH_PILL_INPUT_CLASS_NAME}
                disabled={isSubmitting}
                id={nameId}
                name="name"
                onChange={handleChange}
                placeholder={authRegisterCopy.namePlaceholder}
                type="text"
                value={fields.name}
              />
            </AuthField>
            <AuthField
              error={fieldErrors.email}
              errorId={emailErrorId}
              hideLabel
              htmlFor={emailId}
              label={authRegisterCopy.emailLabel}
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
                placeholder={authRegisterCopy.emailPlaceholder}
                type="email"
                value={fields.email}
              />
            </AuthField>
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
                label={authRegisterCopy.passwordLabel}
                name="password"
                onChange={handleChange}
                placeholder={authRegisterCopy.passwordPlaceholder}
                showLabel="Show password"
                value={fields.password}
                visuallyHideLabel
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
              label={authRegisterCopy.confirmPasswordLabel}
              name="confirmPassword"
              onChange={handleChange}
              placeholder={authRegisterCopy.confirmPasswordPlaceholder}
              showLabel="Show confirm password"
              value={fields.confirmPassword}
              visuallyHideLabel
            />
          </div>
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            label={authRegisterCopy.submit}
            submittingLabel={authRegisterCopy.submitting}
          />
          <AuthSocialActions
            disabled={isSubmitting}
            notice={socialNotice}
            onSelect={(provider): void => {
              void handleSocialSelect(provider);
            }}
          />
        </form>
      </AuthEntranceItem>
      <AuthEntranceItem className="mt-8" delay="medium">
        <AuthSwitchPrompt
          action={authRegisterCopy.loginAction}
          href={authFormPaths.login}
          prompt={authRegisterCopy.loginPrompt}
        />
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
