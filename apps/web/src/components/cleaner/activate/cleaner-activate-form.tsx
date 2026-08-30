"use client";

import { Input } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useEffect,
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
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthStatus } from "@/components/auth/auth-status";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordStrengthHint } from "@/components/auth/password-strength-hint";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { AUTH_PILL_INPUT_CLASS_NAME, authFormPaths } from "@/config/auth-ui";
import {
  CLEANER_API_PATHS,
  CLEANER_HOME_PATH,
  cleanerActivateCopy,
} from "@/config/cleaner";
import {
  authFormBannerMessage,
  collectFieldErrors,
} from "@/lib/auth/form-errors";
import { getPasswordStrength } from "@/lib/auth/password-strength";
import { resetPasswordFormSchema } from "@/lib/validations/auth-form.schema";
import type { AuthFormBannerCode } from "@/types/auth-form";

const ACTIVATE_FIELDS = ["password", "confirmPassword"] as const;

type InvitationView = "loading" | "valid" | "expired" | "invalid";

interface CleanerActivateFormProps {
  token: string | null;
}

export function CleanerActivateForm({
  token,
}: CleanerActivateFormProps): ReactElement {
  const instanceId = useId();
  const emailId = `${instanceId}-email`;
  const passwordId = `${instanceId}-password`;
  const confirmId = `${instanceId}-confirm`;
  const passwordErrorId = `${instanceId}-password-error`;
  const confirmErrorId = `${instanceId}-confirm-error`;
  const strengthId = `${instanceId}-strength`;
  const bannerId = `${instanceId}-banner`;
  const [view, setView] = useState<InvitationView>(
    token === null || token.trim() === "" ? "invalid" : "loading",
  );
  const [email, setEmail] = useState("");
  const [fields, setFields] = useState({
    confirmPassword: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<(typeof ACTIVATE_FIELDS)[number], string>>
  >({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
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

  useEffect(() => {
    if (token === null || token.trim() === "") {
      setView("invalid");
      return;
    }

    const controller = new AbortController();

    void inspectInvitation(token, controller.signal).then((result) => {
      if (controller.signal.aborted) {
        return;
      }

      setView(result.status);
      setEmail(result.email ?? "");
    });

    return (): void => {
      controller.abort();
    };
  }, [token]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting || token === null) {
      return;
    }

    const parsed = resetPasswordFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, ACTIVATE_FIELDS));
      setBanner(null);
      return;
    }

    setFieldErrors({});
    setBanner(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/cleaner/activate", {
        body: JSON.stringify({
          password: parsed.data.password,
          token,
        }),
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body: unknown = await response.json().catch(() => null);

      if (response.ok && isSuccessEnvelope(body)) {
        window.location.assign(CLEANER_HOME_PATH);
        return;
      }

      setBanner(readActivateError(body));
      setStatus("idle");
    } catch {
      setBanner("NETWORK_ERROR");
      setStatus("idle");
    }
  }

  if (view === "loading") {
    return (
      <AuthEntrance>
        <AuthStatus
          live={false}
          message="Checking your invitation."
          title={cleanerActivateCopy.heading}
          titleId={cleanerActivateCopy.headingId}
          tone="loading"
        />
      </AuthEntrance>
    );
  }

  if (view === "expired" || view === "invalid") {
    const isExpired = view === "expired";

    return (
      <AuthEntrance>
        <AuthEntranceItem className="mb-8">
          <BrandLink className="text-foreground focus-visible:ring-offset-background" />
        </AuthEntranceItem>
        <AuthEntranceItem delay="short">
          <AuthStatus
            action={
              <AuthTextLink href={authFormPaths.login}>
                {isExpired
                  ? cleanerActivateCopy.expiredAction
                  : cleanerActivateCopy.loginAction}
              </AuthTextLink>
            }
            live={false}
            message={
              isExpired
                ? cleanerActivateCopy.expiredDescription
                : cleanerActivateCopy.invalidDescription
            }
            title={
              isExpired
                ? cleanerActivateCopy.expiredHeading
                : cleanerActivateCopy.invalidHeading
            }
            titleId="cleaner-activate-link-heading"
            tone="error"
          />
        </AuthEntranceItem>
      </AuthEntrance>
    );
  }

  return (
    <AuthEntrance>
      <AuthFormHeader
        description={cleanerActivateCopy.description}
        heading={cleanerActivateCopy.heading}
        headingId={cleanerActivateCopy.headingId}
      />
      <AuthEntranceItem className="mt-8" delay="short">
        <form
          aria-describedby={bannerMessage === null ? undefined : bannerId}
          aria-labelledby={cleanerActivateCopy.headingId}
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
              error={undefined}
              errorId={`${instanceId}-email-error`}
              htmlFor={emailId}
              label={cleanerActivateCopy.emailLabel}
            >
              <Input
                autoComplete="email"
                className={AUTH_PILL_INPUT_CLASS_NAME}
                id={emailId}
                readOnly
                type="email"
                value={email}
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
                label={cleanerActivateCopy.passwordLabel}
                name="password"
                onChange={handleChange}
                placeholder={cleanerActivateCopy.passwordPlaceholder}
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
              label={cleanerActivateCopy.confirmPasswordLabel}
              name="confirmPassword"
              onChange={handleChange}
              placeholder={cleanerActivateCopy.confirmPasswordPlaceholder}
              showLabel="Show confirm password"
              value={fields.confirmPassword}
            />
          </div>
          <AuthSubmitButton
            isSubmitting={isSubmitting}
            label={cleanerActivateCopy.submit}
            submittingLabel={cleanerActivateCopy.submitting}
          />
        </form>
      </AuthEntranceItem>
    </AuthEntrance>
  );
}

async function inspectInvitation(
  token: string,
  signal: AbortSignal,
): Promise<{ email?: string; status: InvitationView }> {
  try {
    const response = await fetch(
      `${CLEANER_API_PATHS.activate}?token=${encodeURIComponent(token)}`,
      {
        cache: "no-store",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        signal,
      },
    );
    const body: unknown = await response.json().catch(() => null);

    if (
      !isRecord(body) ||
      !isRecord(body.data) ||
      !isRecord(body.data.invitation) ||
      typeof body.data.invitation.status !== "string"
    ) {
      return { status: "invalid" };
    }

    const status = body.data.invitation.status;

    if (status === "expired") {
      return { status: "expired" };
    }

    if (status === "valid" && typeof body.data.invitation.email === "string") {
      return { email: body.data.invitation.email, status: "valid" };
    }

    return { status: "invalid" };
  } catch {
    return { status: "invalid" };
  }
}

function readActivateError(body: unknown): AuthFormBannerCode {
  if (
    !isRecord(body) ||
    !isRecord(body.error) ||
    typeof body.error.code !== "string"
  ) {
    return "UNEXPECTED_ERROR";
  }

  if (body.error.code === "TOKEN_EXPIRED") {
    return "EXPIRED_LINK";
  }

  if (body.error.code === "TOKEN_INVALID") {
    return "INVALID_LINK";
  }

  if (body.error.code === "RATE_LIMITED") {
    return "RATE_LIMITED";
  }

  if (body.error.code === "INVALID_INPUT") {
    return "INVALID_REGISTRATION_DATA";
  }

  return "UNEXPECTED_ERROR";
}

function isSuccessEnvelope(value: unknown): boolean {
  return isRecord(value) && value.success === true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
