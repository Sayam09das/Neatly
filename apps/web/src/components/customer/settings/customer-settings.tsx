"use client";

import { Button, Input, Label } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useState,
} from "react";
import { PasswordStrengthHint } from "@/components/auth/password-strength-hint";
import { CustomerConfirmDialog } from "@/components/customer/customer-confirm-dialog";
import { customerSettingsCopy } from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { getPasswordStrength } from "@/lib/auth/password-strength";
import {
  changeCustomerPassword,
  logoutAllCustomerSessions,
  resendCustomerVerification,
  revokeCustomerSession,
} from "@/lib/customer/account";
import { useCustomerRefresh } from "@/lib/customer/refresh";
import {
  handleCustomerApiFailure,
  signOutCustomer,
} from "@/lib/customer/session";
import {
  type CustomerPasswordFormValues,
  customerPasswordFormSchema,
} from "@/lib/validations/customer-settings.schema";
import type { CustomerAccount } from "@/types/customer";

interface CustomerSettingsProps {
  account: CustomerAccount;
}

export function CustomerSettings({
  account,
}: CustomerSettingsProps): ReactElement {
  const refresh = useCustomerRefresh();
  const formId = useId();
  const strengthId = `${formId}-strength`;
  const [fields, setFields] = useState<CustomerPasswordFormValues>({
    confirmPassword: "",
    currentPassword: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerPasswordFormValues, string>>
  >({});
  const [busy, setBusy] = useState<
    "password" | "verify" | "revoke" | "logout-all" | null
  >(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const passwordStrength = getPasswordStrength(fields.password);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const name = event.target.name as keyof CustomerPasswordFormValues;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  async function handlePassword(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = customerPasswordFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(
        collectFieldErrors(parsed.error, [
          "confirmPassword",
          "currentPassword",
          "password",
        ]),
      );
      return;
    }

    setFieldErrors({});
    setBusy("password");
    setBanner(null);
    const result = await changeCustomerPassword({
      currentPassword: parsed.data.currentPassword,
      password: parsed.data.password,
    });
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      setFieldErrors({
        currentPassword: result.fields.currentPassword,
        password: result.fields.password,
      });
      return;
    }

    setFields({
      confirmPassword: "",
      currentPassword: "",
      password: "",
    });
    setBanner({
      message: customerSettingsCopy.passwordSuccess,
      tone: "success",
    });
    refresh();
  }

  async function handleResend(): Promise<void> {
    setBusy("verify");
    setBanner(null);
    const result = await resendCustomerVerification();
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      return;
    }

    setBanner({
      message: result.data.message,
      tone: "success",
    });
  }

  async function handleRevoke(id: string): Promise<void> {
    setBusy("revoke");
    setBanner(null);
    const result = await revokeCustomerSession(id);
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      return;
    }

    refresh();
  }

  async function handleLogoutAll(): Promise<void> {
    setBusy("logout-all");
    setBanner(null);
    const result = await logoutAllCustomerSessions();
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      return;
    }

    await signOutCustomer();
  }

  const submitting = busy !== null;

  return (
    <div className="w-full min-w-0 max-w-2xl space-y-12">
      <header>
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerSettingsCopy.heading}
        </h1>
        <p className="mt-3 max-w-prose text-body text-muted-foreground">
          {customerSettingsCopy.description}
        </p>
      </header>
      {banner === null ? null : (
        <p
          className={
            banner.tone === "success"
              ? "text-body text-foreground"
              : "text-body text-destructive"
          }
          role={banner.tone === "error" ? "alert" : "status"}
        >
          {banner.message}
        </p>
      )}
      <section>
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerSettingsCopy.accountHeading}
        </h2>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="text-label font-medium text-foreground">
              {customerSettingsCopy.emailLabel}
            </dt>
            <dd className="mt-1 break-all text-body text-muted-foreground">
              {account.email}
            </dd>
            <p className="mt-1 text-caption text-muted-foreground">
              {customerSettingsCopy.emailReadOnly}
            </p>
          </div>
          <div>
            <dt className="text-label font-medium text-foreground">
              {customerSettingsCopy.statusLabel}
            </dt>
            <dd className="mt-1 text-body text-muted-foreground">
              {account.status}
            </dd>
          </div>
          <div>
            <dt className="text-label font-medium text-foreground">
              {customerSettingsCopy.verificationLabel}
            </dt>
            <dd className="mt-1 text-body text-muted-foreground">
              {account.emailVerified
                ? customerSettingsCopy.verified
                : customerSettingsCopy.unverified}
            </dd>
          </div>
        </dl>
        {account.emailVerified ? null : (
          <Button
            className="mt-5"
            disabled={submitting}
            onClick={(): void => {
              void handleResend();
            }}
            type="button"
            variant="outline"
          >
            {busy === "verify"
              ? customerSettingsCopy.resending
              : customerSettingsCopy.resendVerification}
          </Button>
        )}
      </section>
      <section>
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerSettingsCopy.passwordHeading}
        </h2>
        <form className="mt-5 space-y-5" onSubmit={handlePassword}>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-current`}>
              {customerSettingsCopy.currentPasswordLabel}
            </Label>
            <Input
              autoComplete="current-password"
              disabled={submitting}
              id={`${formId}-current`}
              name="currentPassword"
              onChange={handleChange}
              type="password"
              value={fields.currentPassword}
            />
            <FieldError message={fieldErrors.currentPassword} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-new`}>
              {customerSettingsCopy.newPasswordLabel}
            </Label>
            <Input
              aria-describedby={
                passwordStrength === null ? undefined : strengthId
              }
              autoComplete="new-password"
              disabled={submitting}
              id={`${formId}-new`}
              name="password"
              onChange={handleChange}
              type="password"
              value={fields.password}
            />
            <PasswordStrengthHint id={strengthId} strength={passwordStrength} />
            <FieldError message={fieldErrors.password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-confirm`}>
              {customerSettingsCopy.confirmPasswordLabel}
            </Label>
            <Input
              autoComplete="new-password"
              disabled={submitting}
              id={`${formId}-confirm`}
              name="confirmPassword"
              onChange={handleChange}
              type="password"
              value={fields.confirmPassword}
            />
            <FieldError message={fieldErrors.confirmPassword} />
          </div>
          <Button disabled={submitting} type="submit">
            {busy === "password"
              ? customerSettingsCopy.passwordSaving
              : customerSettingsCopy.passwordSave}
          </Button>
        </form>
      </section>
      <section>
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerSettingsCopy.sessionsHeading}
        </h2>
        {account.sessions.length === 0 ? (
          <p className="mt-4 text-body text-muted-foreground">
            {customerSettingsCopy.sessionsEmpty}
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {account.sessions.map((session) => (
              <li
                className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between"
                key={session.id}
              >
                <div>
                  <p className="text-body text-foreground">
                    {session.current
                      ? customerSettingsCopy.revokeCurrent
                      : customerSettingsCopy.revokeOther}
                  </p>
                  <p className="mt-1 text-caption text-muted-foreground">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }).format(new Date(session.createdAt))}
                  </p>
                </div>
                {session.current ? null : (
                  <Button
                    disabled={submitting}
                    onClick={(): void => {
                      void handleRevoke(session.id);
                    }}
                    type="button"
                    variant="outline"
                  >
                    {busy === "revoke"
                      ? customerSettingsCopy.revokeBusy
                      : customerSettingsCopy.revokeAction}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        <Button
          className="mt-6"
          disabled={submitting}
          onClick={(): void => {
            setLogoutOpen(true);
          }}
          type="button"
          variant="outline"
        >
          {customerSettingsCopy.logoutAllAction}
        </Button>
      </section>
      <CustomerConfirmDialog
        busy={busy === "logout-all"}
        busyLabel={customerSettingsCopy.logoutAllBusy}
        cancelLabel="Cancel"
        confirmLabel={customerSettingsCopy.logoutAllAction}
        description={customerSettingsCopy.logoutAllDescription}
        destructive
        error={banner?.tone === "error" && logoutOpen ? banner.message : null}
        onCancel={(): void => {
          setLogoutOpen(false);
        }}
        onConfirm={(): void => {
          void handleLogoutAll();
        }}
        onOpenChange={setLogoutOpen}
        open={logoutOpen}
        title={customerSettingsCopy.logoutAllTitle}
      />
    </div>
  );
}

function FieldError({ message }: { message?: string }): ReactElement | null {
  if (message === undefined) {
    return null;
  }

  return (
    <p className="text-caption text-destructive" role="alert">
      {message}
    </p>
  );
}
