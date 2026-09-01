"use client";

import { Button, Input, Label } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useRef,
  useState,
} from "react";
import { HeadingAccent } from "@/components/sections/heading-accent";
import { landingCtas, landingNewsletter } from "@/config/landing";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { subscribePublicNewsletter } from "@/lib/customer/public-newsletter";
import {
  emptyPublicNewsletterValues,
  publicNewsletterSchema,
} from "@/lib/validations/public-newsletter.schema";
import { useNewsletterAnimation } from "./use-newsletter-animation";

type NewsletterFormStatus =
  | "error"
  | "idle"
  | "submitting"
  | "success"
  | "validation";

export function NewsletterScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const emailId = `${instanceId}-email`;
  const errorId = `${instanceId}-error`;
  const successId = `${instanceId}-success`;
  const [email, setEmail] = useState(emptyPublicNewsletterValues.email);
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<NewsletterFormStatus>("idle");

  useNewsletterAnimation({ rootRef });

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);

    if (fieldError !== undefined) {
      setFieldError(undefined);
    }

    if (status === "validation" || status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting || isSuccess) {
      return;
    }

    const parsed = publicNewsletterSchema.safeParse({ email });

    if (!parsed.success) {
      setFieldError(
        collectFieldErrors(parsed.error, ["email"]).email ??
          landingNewsletter.fieldError,
      );
      setStatus("validation");
      return;
    }

    setFieldError(undefined);
    setStatus("submitting");

    const result = await subscribePublicNewsletter(parsed.data);

    if (!result.ok) {
      setStatus("error");
      return;
    }

    setEmail(emptyPublicNewsletterValues.email);
    setStatus("success");
  }

  return (
    <div className="relative" ref={rootRef}>
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto w-full max-w-page px-gutter py-section">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-label text-accent uppercase"
            data-newsletter-eyebrow
          >
            {landingNewsletter.eyebrow}
          </p>
          <h2
            className="mt-4 text-display text-secondary-foreground tracking-tight"
            data-newsletter-heading
            id={landingNewsletter.headingId}
          >
            {landingNewsletter.headingLead}{" "}
            <span className="relative inline-block text-accent">
              {landingNewsletter.headingEmphasis}
              <HeadingAccent className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full text-accent" />
            </span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-newsletter-intro
          >
            {landingNewsletter.description}
          </p>
        </div>
        <form
          aria-describedby={`newsletter-consent${
            status === "error" ? ` ${errorId}` : ""
          }${isSuccess ? ` ${successId}` : ""}`}
          className="mx-auto mt-10 w-full max-w-2xl"
          data-newsletter-form
          noValidate
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <Label className="text-secondary-foreground" htmlFor={emailId}>
            {landingNewsletter.inputLabel}
          </Label>
          <div className="mt-3 flex flex-col gap-2 rounded-xl bg-background p-2 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5">
            <Input
              aria-describedby={fieldError === undefined ? undefined : errorId}
              aria-invalid={fieldError !== undefined}
              autoComplete="email"
              className="min-h-touch flex-1 border-0 bg-transparent shadow-none focus-visible:ring-offset-background sm:px-5"
              disabled={isSubmitting || isSuccess}
              id={emailId}
              name="email"
              onChange={handleChange}
              placeholder="name@example.com"
              type="email"
              value={email}
            />
            <Button
              className="w-full sm:w-auto"
              disabled={isSuccess}
              isLoading={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? landingNewsletter.submittingLabel
                : landingCtas.subscribe.label}
            </Button>
          </div>
        </form>
        <div
          className="mx-auto mt-4 max-w-xl text-center"
          data-newsletter-consent
        >
          <p
            className="text-body-small text-secondary-foreground/80"
            id="newsletter-consent"
          >
            {landingNewsletter.consent}
          </p>
          {fieldError === undefined ? null : (
            <p
              className="mt-2 text-body-small text-destructive"
              id={errorId}
              role="alert"
            >
              {fieldError}
            </p>
          )}
          {status === "error" ? (
            <p
              className="mt-2 text-body-small text-destructive"
              id={errorId}
              role="alert"
            >
              {landingNewsletter.errorMessage}
            </p>
          ) : null}
          {isSuccess ? (
            <p
              className="mt-2 text-body-small text-secondary-foreground"
              id={successId}
              role="status"
            >
              {landingNewsletter.successMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
