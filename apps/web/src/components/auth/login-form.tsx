"use client";

import { Input } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
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
import {
  AUTH_PILL_INPUT_CLASS_NAME,
  authFormPaths,
  authLoginCopy,
  authSocialCopy,
} from "@/config/auth-ui";
import {
  authFormBannerMessage,
  collectFieldErrors,
} from "@/lib/auth/form-errors";
import {
  adminPostLoginPath,
  customerPostLoginPath,
} from "@/lib/auth/submit-login";
import { loginSchema } from "@/lib/validations/auth.schema";
import { emptyLoginFormValues } from "@/lib/validations/auth-form.schema";
import {
  submitLoginForm,
  submitSocialAuth,
} from "@/services/auth-form.service";
import type {
  AuthFormBannerCode,
  AuthSocialProvider,
  AuthSocialSubmitHandler,
  LoginFormData,
  LoginFormState,
  LoginFormSubmitHandler,
} from "@/types/auth-form";

const LOGIN_FIELDS = ["email", "password"] as const;

interface LoginFormProps {
  mode?: "admin" | "customer";
  onSocialSubmit?: AuthSocialSubmitHandler;
  onSubmit?: LoginFormSubmitHandler;
  resolveSuccessHref?: (search: string) => string;
}

export function LoginForm({
  mode = "admin",
  onSocialSubmit = submitSocialAuth,
  onSubmit = submitLoginForm,
  resolveSuccessHref,
}: LoginFormProps): ReactElement {
  const successHref =
    resolveSuccessHref ??
    (mode === "customer" ? customerPostLoginPath : adminPostLoginPath);
  const instanceId = useId();
  const emailId = `${instanceId}-email`;
  const passwordId = `${instanceId}-password`;
  const emailErrorId = `${instanceId}-email-error`;
  const passwordErrorId = `${instanceId}-password-error`;
  const bannerId = `${instanceId}-banner`;
  const [fields, setFields] = useState<LoginFormData>({
    ...emptyLoginFormValues,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<(typeof LOGIN_FIELDS)[number], string>>
  >({});
  const [status, setStatus] = useState<LoginFormState>("idle");
  const [banner, setBanner] = useState<AuthFormBannerCode | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const isSubmitting = status === "submitting";
  const bannerMessage = banner === null ? null : authFormBannerMessage(banner);

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

    const parsed = loginSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, LOGIN_FIELDS));
      setBanner(null);
      setSocialNotice(null);
      return;
    }

    setFieldErrors({});
    setBanner(null);
    setSocialNotice(null);
    setStatus("submitting");

    try {
      const result = await onSubmit(parsed.data);

      if (result.status === "error") {
        setBanner(result.code);
        return;
      }

      window.location.assign(successHref(window.location.search));
    } finally {
      setStatus("idle");
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
        description={authLoginCopy.description}
        heading={authLoginCopy.heading}
        headingId={authLoginCopy.headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <form
          aria-describedby={bannerMessage === null ? undefined : bannerId}
          aria-labelledby={authLoginCopy.headingId}
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
              error={fieldErrors.email}
              errorId={emailErrorId}
              hideLabel
              htmlFor={emailId}
              label={authLoginCopy.emailLabel}
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
                placeholder={authLoginCopy.emailPlaceholder}
                type="email"
                value={fields.email}
              />
            </AuthField>
            <AuthPasswordField
              aria-describedby={
                fieldErrors.password === undefined ? undefined : passwordErrorId
              }
              autoComplete="current-password"
              disabled={isSubmitting}
              error={fieldErrors.password}
              errorId={passwordErrorId}
              hideLabel="Hide password"
              htmlFor={passwordId}
              id={passwordId}
              label={authLoginCopy.passwordLabel}
              name="password"
              onChange={handleChange}
              placeholder={authLoginCopy.passwordPlaceholder}
              showLabel="Show password"
              value={fields.password}
              visuallyHideLabel
            />
            <p className="-mt-2 flex justify-end">
              <Link
                className={cn(
                  "inline-flex min-h-touch items-center text-caption",
                  "text-muted-foreground underline-offset-4",
                  "transition-colors duration-normal ease-standard",
                  "hover:text-foreground hover:underline",
                  "focus-visible:rounded-sm focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                )}
                href={authFormPaths.forgotPassword}
              >
                {authLoginCopy.forgotPassword}
              </Link>
            </p>
          </div>
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            label={authLoginCopy.submit}
            submittingLabel={authLoginCopy.submitting}
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
          action={authLoginCopy.registerAction}
          href={authFormPaths.register}
          prompt={authLoginCopy.registerPrompt}
        />
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
