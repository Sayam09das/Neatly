"use client";

import { Button, Input, Label, Textarea } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useState,
} from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { fadeUp } from "@/animations/motion/variants";
import {
  emptyHeroQuoteValues,
  heroQuoteSchema,
} from "@/components/sections/hero/quote-schema";
import { heroQuoteForm, landingCtas } from "@/config/landing";

type QuoteFormStatus = "idle" | "submitting" | "unavailable";

interface QuoteFormFields {
  email: string;
  fullName: string;
  message: string;
  service: string;
}

type QuoteFieldName = keyof QuoteFormFields;

const fieldClassName =
  "border-secondary-foreground/20 bg-secondary/50 text-secondary-foreground placeholder:text-secondary-foreground/50 focus-visible:ring-offset-secondary";

export function QuoteForm(): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const instanceId = useId();
  const headingId = `${instanceId}-heading`;
  const errorIdPrefix = instanceId;
  const fieldIds = {
    email: `${instanceId}-email`,
    fullName: `${instanceId}-name`,
    message: `${instanceId}-message`,
    service: `${instanceId}-service`,
  };
  const [fields, setFields] = useState<QuoteFormFields>(emptyHeroQuoteValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<QuoteFieldName, string>>
  >({});
  const [status, setStatus] = useState<QuoteFormStatus>("idle");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void {
    const name = event.target.name as QuoteFieldName;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const parsed = heroQuoteSchema.safeParse(fields);

    if (!parsed.success) {
      const nextErrors: Partial<Record<QuoteFieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "email" ||
          key === "fullName" ||
          key === "message" ||
          key === "service"
        ) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      setStatus("idle");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setStatus("unavailable");
  }

  const isSubmitting = status === "submitting";

  return (
    <motion.div
      animate="visible"
      className="w-full lg:self-start"
      data-slot="hero-quote-form"
      initial={prefersReducedMotion ? false : "hidden"}
      variants={fadeUp}
      transition={{
        delay: prefersReducedMotion ? 0 : motionDuration.micro,
      }}
    >
      <form
        aria-labelledby={headingId}
        className="rounded-xl border border-secondary-foreground/15 bg-secondary/90 p-5 shadow-lg backdrop-blur-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <p
          className="text-h3 text-secondary-foreground tracking-tight"
          id={headingId}
        >
          {heroQuoteForm.heading}
        </p>
        <p className="mt-2 text-body-small text-secondary-foreground/75">
          {heroQuoteForm.description}
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Field
            error={fieldErrors.fullName}
            errorId={`${errorIdPrefix}-name`}
            htmlFor={fieldIds.fullName}
            label={heroQuoteForm.fields.fullName.label}
          >
            <Input
              aria-invalid={fieldErrors.fullName !== undefined}
              aria-describedby={
                fieldErrors.fullName === undefined
                  ? undefined
                  : `${errorIdPrefix}-name`
              }
              autoComplete="name"
              className={fieldClassName}
              disabled={isSubmitting}
              id={fieldIds.fullName}
              name="fullName"
              onChange={handleChange}
              placeholder={heroQuoteForm.fields.fullName.placeholder}
              value={fields.fullName}
            />
          </Field>
          <Field
            error={fieldErrors.email}
            errorId={`${errorIdPrefix}-email`}
            htmlFor={fieldIds.email}
            label={heroQuoteForm.fields.email.label}
          >
            <Input
              aria-invalid={fieldErrors.email !== undefined}
              aria-describedby={
                fieldErrors.email === undefined
                  ? undefined
                  : `${errorIdPrefix}-email`
              }
              autoComplete="email"
              className={fieldClassName}
              disabled={isSubmitting}
              id={fieldIds.email}
              name="email"
              onChange={handleChange}
              placeholder={heroQuoteForm.fields.email.placeholder}
              type="email"
              value={fields.email}
            />
          </Field>
          <Field
            error={fieldErrors.service}
            errorId={`${errorIdPrefix}-service`}
            htmlFor={fieldIds.service}
            label={heroQuoteForm.fields.service.label}
          >
            <select
              aria-invalid={fieldErrors.service !== undefined}
              aria-describedby={
                fieldErrors.service === undefined
                  ? undefined
                  : `${errorIdPrefix}-service`
              }
              className={cn(
                "flex min-h-touch w-full rounded-sm border px-3 py-2 text-body shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                fieldClassName,
              )}
              disabled={isSubmitting}
              id={fieldIds.service}
              name="service"
              onChange={handleChange}
              value={fields.service}
            >
              <option value="">
                {heroQuoteForm.fields.service.placeholder}
              </option>
              {heroQuoteForm.services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            error={fieldErrors.message}
            errorId={`${errorIdPrefix}-message`}
            htmlFor={fieldIds.message}
            label={heroQuoteForm.fields.message.label}
          >
            <Textarea
              aria-invalid={fieldErrors.message !== undefined}
              aria-describedby={
                fieldErrors.message === undefined
                  ? undefined
                  : `${errorIdPrefix}-message`
              }
              className={fieldClassName}
              disabled={isSubmitting}
              id={fieldIds.message}
              name="message"
              onChange={handleChange}
              placeholder={heroQuoteForm.fields.message.placeholder}
              rows={2}
              value={fields.message}
            />
          </Field>
        </div>
        {status === "unavailable" ? (
          <p
            className="mt-4 text-body-small text-secondary-foreground"
            role="status"
            aria-live="polite"
          >
            {heroQuoteForm.unavailableMessage}{" "}
            <Link
              className="underline underline-offset-4"
              href={landingCtas.primary.href}
            >
              {landingCtas.primary.label}
            </Link>
          </p>
        ) : null}
        <Button
          className="mt-5 w-full uppercase"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
        >
          {heroQuoteForm.submitLabel}
        </Button>
      </form>
    </motion.div>
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
      <Label className="text-secondary-foreground" htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
      {error === undefined ? null : (
        <p
          aria-live="polite"
          className="text-caption text-secondary-foreground"
          id={errorId}
        >
          {error}
        </p>
      )}
    </div>
  );
}
