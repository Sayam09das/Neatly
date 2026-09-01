"use client";

import { Button, Input, Label, Textarea } from "@neatly/ui";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useState,
} from "react";
import { contactFormCopy } from "@/config/contact";
import { landingCtas } from "@/config/landing";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import {
  contactInquirySchema,
  emptyContactInquiryValues,
} from "@/lib/validations/contact.schema";

type ContactFormStatus = "idle" | "submitting" | "unavailable" | "validation";

type ContactFieldName = keyof typeof emptyContactInquiryValues;

const CONTACT_FIELD_KEYS = [
  "email",
  "fullName",
  "message",
  "phone",
  "subject",
] as const satisfies ReadonlyArray<ContactFieldName>;

export function ContactForm(): ReactElement {
  const instanceId = useId();
  const errorIdPrefix = instanceId;
  const fieldIds = {
    email: `${instanceId}-email`,
    fullName: `${instanceId}-name`,
    message: `${instanceId}-message`,
    phone: `${instanceId}-phone`,
    subject: `${instanceId}-subject`,
  };
  const [fields, setFields] = useState(emptyContactInquiryValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactFieldName, string>>
  >({});
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const name = event.target.name as ContactFieldName;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = contactInquirySchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, CONTACT_FIELD_KEYS));
      setStatus("validation");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setStatus("unavailable");
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      aria-describedby={
        status === "unavailable" ? `${instanceId}-unavailable` : undefined
      }
      aria-labelledby={contactFormCopy.headingId}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      noValidate
      onSubmit={handleSubmit}
    >
      <h2 className="text-h3 tracking-tight" id={contactFormCopy.headingId}>
        {contactFormCopy.heading}
      </h2>
      <p className="mt-2 text-body-small text-muted-foreground">
        {contactFormCopy.description}
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <Field
          error={fieldErrors.fullName}
          errorId={`${errorIdPrefix}-name`}
          htmlFor={fieldIds.fullName}
          label={contactFormCopy.fields.fullName.label}
        >
          <Input
            aria-describedby={
              fieldErrors.fullName === undefined
                ? undefined
                : `${errorIdPrefix}-name`
            }
            aria-invalid={fieldErrors.fullName !== undefined}
            autoComplete="name"
            disabled={isSubmitting}
            id={fieldIds.fullName}
            name="fullName"
            onChange={handleChange}
            placeholder={contactFormCopy.fields.fullName.placeholder}
            value={fields.fullName}
          />
        </Field>
        <Field
          error={fieldErrors.email}
          errorId={`${errorIdPrefix}-email`}
          htmlFor={fieldIds.email}
          label={contactFormCopy.fields.email.label}
        >
          <Input
            aria-describedby={
              fieldErrors.email === undefined
                ? undefined
                : `${errorIdPrefix}-email`
            }
            aria-invalid={fieldErrors.email !== undefined}
            autoComplete="email"
            disabled={isSubmitting}
            id={fieldIds.email}
            name="email"
            onChange={handleChange}
            placeholder={contactFormCopy.fields.email.placeholder}
            type="email"
            value={fields.email}
          />
        </Field>
        <Field
          error={fieldErrors.phone}
          errorId={`${errorIdPrefix}-phone`}
          htmlFor={fieldIds.phone}
          label={contactFormCopy.fields.phone.label}
        >
          <Input
            aria-describedby={
              fieldErrors.phone === undefined
                ? undefined
                : `${errorIdPrefix}-phone`
            }
            aria-invalid={fieldErrors.phone !== undefined}
            autoComplete="tel"
            disabled={isSubmitting}
            id={fieldIds.phone}
            name="phone"
            onChange={handleChange}
            placeholder={contactFormCopy.fields.phone.placeholder}
            type="tel"
            value={fields.phone}
          />
        </Field>
        <Field
          error={fieldErrors.subject}
          errorId={`${errorIdPrefix}-subject`}
          htmlFor={fieldIds.subject}
          label={contactFormCopy.fields.subject.label}
        >
          <Input
            aria-describedby={
              fieldErrors.subject === undefined
                ? undefined
                : `${errorIdPrefix}-subject`
            }
            aria-invalid={fieldErrors.subject !== undefined}
            disabled={isSubmitting}
            id={fieldIds.subject}
            name="subject"
            onChange={handleChange}
            placeholder={contactFormCopy.fields.subject.placeholder}
            value={fields.subject}
          />
        </Field>
        <Field
          error={fieldErrors.message}
          errorId={`${errorIdPrefix}-message`}
          htmlFor={fieldIds.message}
          label={contactFormCopy.fields.message.label}
        >
          <Textarea
            aria-describedby={
              fieldErrors.message === undefined
                ? undefined
                : `${errorIdPrefix}-message`
            }
            aria-invalid={fieldErrors.message !== undefined}
            disabled={isSubmitting}
            id={fieldIds.message}
            name="message"
            onChange={handleChange}
            placeholder={contactFormCopy.fields.message.placeholder}
            rows={5}
            value={fields.message}
          />
        </Field>
      </div>
      {status === "unavailable" ? (
        <p
          aria-live="polite"
          className="mt-4 text-body-small text-foreground"
          id={`${instanceId}-unavailable`}
          role="status"
        >
          {contactFormCopy.unavailableMessage}{" "}
          <Link
            className="underline underline-offset-4 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={landingCtas.primary.href}
          >
            {contactFormCopy.quoteActionLabel}
          </Link>
        </p>
      ) : null}
      <Button
        className="mt-6 w-full uppercase sm:w-auto"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? contactFormCopy.submittingLabel
          : contactFormCopy.submitLabel}
      </Button>
    </form>
  );
}

interface FieldProps {
  children: ReactElement;
  error: string | undefined;
  errorId: string;
  htmlFor: string;
  label: string;
}

function Field({
  children,
  error,
  errorId,
  htmlFor,
  label,
}: FieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error === undefined ? null : (
        <p
          aria-live="polite"
          className="text-caption text-destructive"
          id={errorId}
        >
          {error}
        </p>
      )}
    </div>
  );
}
