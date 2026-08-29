"use client";

import { Button, Input, Label } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { customerProfileCopy } from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { getCustomerInitials } from "@/lib/customer/navbar";
import { updateCustomerProfile } from "@/lib/customer/profile";
import { useCustomerRefresh } from "@/lib/customer/refresh";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import {
  type CustomerProfileFormValues,
  customerProfileFormSchema,
  toCustomerProfilePayload,
} from "@/lib/validations/customer-profile.schema";
import type { CustomerProfile } from "@/types/customer";

interface CustomerProfileFormProps {
  profile: CustomerProfile;
}

export function CustomerProfileForm({
  profile,
}: CustomerProfileFormProps): ReactElement {
  const refresh = useCustomerRefresh();
  const formId = useId();
  const confirmed = useMemo(
    (): CustomerProfileFormValues => ({
      address: profile.address ?? "",
      name: profile.name,
      phone: profile.phone ?? "",
    }),
    [profile.address, profile.name, profile.phone],
  );
  const [fields, setFields] = useState(confirmed);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerProfileFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const dirty =
    fields.address !== confirmed.address ||
    fields.name !== confirmed.name ||
    fields.phone !== confirmed.phone;

  useEffect((): (() => void) | undefined => {
    if (!dirty) {
      return undefined;
    }

    function onBeforeUnload(event: BeforeUnloadEvent): void {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return (): void => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [dirty]);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const name = event.target.name as keyof CustomerProfileFormValues;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = customerProfileFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(
        collectFieldErrors(parsed.error, ["address", "name", "phone"]),
      );
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setBanner(null);
    const result = await updateCustomerProfile(
      toCustomerProfilePayload(parsed.data),
    );
    setSubmitting(false);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      setFieldErrors({
        address: result.fields.address,
        name: result.fields.name,
        phone: result.fields.phone,
      });
      return;
    }

    setBanner({ message: customerProfileCopy.success, tone: "success" });
    refresh();
  }

  const initials = getCustomerInitials({
    email: profile.email,
    name: fields.name.trim() === "" ? profile.name : fields.name,
  });

  return (
    <div className="w-full min-w-0 max-w-2xl">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerProfileCopy.heading}
      </h1>
      <p className="mt-3 max-w-prose text-body text-muted-foreground">
        {customerProfileCopy.description}
      </p>
      <div className="mt-8 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-muted text-h3 text-foreground"
        >
          {initials}
        </span>
        <p className="min-w-0">
          <span className="block truncate text-body font-medium text-foreground">
            {profile.name}
          </span>
          <span className="block truncate text-body-small text-muted-foreground">
            {profile.email}
          </span>
        </p>
      </div>
      {banner === null ? null : (
        <p
          className={
            banner.tone === "success"
              ? "mt-6 text-body text-foreground"
              : "mt-6 text-body text-destructive"
          }
          role={banner.tone === "error" ? "alert" : "status"}
        >
          {banner.message}
        </p>
      )}
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-name`}>
            {customerProfileCopy.nameLabel}
          </Label>
          <Input
            autoComplete="name"
            disabled={submitting}
            id={`${formId}-name`}
            name="name"
            onChange={handleChange}
            value={fields.name}
          />
          <FieldError message={fieldErrors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-email`}>
            {customerProfileCopy.emailLabel}
          </Label>
          <Input
            disabled
            id={`${formId}-email`}
            readOnly
            value={profile.email}
          />
          <p className="text-caption text-muted-foreground">
            {customerProfileCopy.emailHint}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-phone`}>
            {customerProfileCopy.phoneLabel}
          </Label>
          <Input
            autoComplete="tel"
            disabled={submitting}
            id={`${formId}-phone`}
            name="phone"
            onChange={handleChange}
            value={fields.phone}
          />
          <FieldError message={fieldErrors.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${formId}-address`}>
            {customerProfileCopy.addressLabel}
          </Label>
          <Input
            autoComplete="street-address"
            disabled={submitting}
            id={`${formId}-address`}
            name="address"
            onChange={handleChange}
            value={fields.address}
          />
          <p className="text-caption text-muted-foreground">
            {customerProfileCopy.addressHint}
          </p>
          <FieldError message={fieldErrors.address} />
        </div>
        <p className="text-body-small text-muted-foreground">
          {customerProfileCopy.statusLabel}: {profile.status}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button disabled={submitting || !dirty} type="submit">
            {submitting
              ? customerProfileCopy.saving
              : customerProfileCopy.saveAction}
          </Button>
          <Button
            disabled={submitting || !dirty}
            onClick={(): void => {
              setFields(confirmed);
              setFieldErrors({});
            }}
            type="button"
            variant="outline"
          >
            {customerProfileCopy.resetAction}
          </Button>
        </div>
      </form>
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
