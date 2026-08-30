"use client";

import { Button, Input, Label, Textarea } from "@neatly/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useMemo,
  useState,
} from "react";
import { QuoteStepper } from "@/components/customer/quote/quote-stepper";
import {
  CUSTOMER_PATHS,
  customerBookingConfirmationPath,
  customerBookingCopy,
  customerBookingFieldCopy,
  customerQuoteCopy,
  customerServicePath,
} from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { createCustomerBooking } from "@/lib/customer/booking";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import {
  type CustomerBookingFormValues,
  customerBookingFormSchema,
  emptyCustomerBookingValues,
  toCustomerBookingPayload,
} from "@/lib/validations/customer-booking.schema";
import type {
  CustomerQuoteView,
  CustomerServiceDetail,
} from "@/types/customer";

const STEPS = [
  { id: "service", label: customerBookingCopy.stepService },
  { id: "schedule", label: customerBookingCopy.stepSchedule },
  { id: "review", label: customerBookingCopy.stepReview },
] as const;

interface BookingFlowFormProps {
  quote: CustomerQuoteView;
  service: CustomerServiceDetail | null;
  serviceUnavailable: boolean;
}

export function BookingFlowForm({
  quote,
  service,
  serviceUnavailable,
}: BookingFlowFormProps): ReactElement {
  const router = useRouter();
  const instanceId = useId();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<CustomerBookingFormValues>(() => ({
    ...emptyCustomerBookingValues,
    quoteRequestId: quote.id,
    serviceAddress: quote.serviceAddress,
    serviceId: service?.id ?? quote.serviceId ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerBookingFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const minDate = useMemo((): string => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const name = event.target.name as keyof CustomerBookingFormValues;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  function handleContinue(): void {
    if (step === 0 && fields.serviceId.trim() === "") {
      setFieldErrors({ serviceId: customerBookingCopy.unavailableService });
      return;
    }

    if (step === 1) {
      const parsed = customerBookingFormSchema.safeParse(fields);
      if (!parsed.success) {
        setFieldErrors(
          collectFieldErrors(parsed.error, [
            "scheduledDate",
            "scheduledTime",
            "serviceAddress",
            "notes",
            "serviceId",
          ]),
        );
        return;
      }
    }

    setFieldErrors({});
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = customerBookingFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(
        collectFieldErrors(parsed.error, [
          "notes",
          "scheduledDate",
          "scheduledTime",
          "serviceAddress",
          "serviceId",
        ]),
      );
      return;
    }

    setSubmitting(true);
    setServerError(null);
    const result = await createCustomerBooking(
      toCustomerBookingPayload(parsed.data),
    );
    setSubmitting(false);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setFieldErrors(
        result.fields as Partial<
          Record<keyof CustomerBookingFormValues, string>
        >,
      );
      setServerError(result.message || customerBookingCopy.serverError);
      return;
    }

    router.replace(customerBookingConfirmationPath(result.data.id));
  }

  return (
    <section
      aria-labelledby="booking-heading"
      className="w-full min-w-0 max-w-xl"
    >
      <h1
        className="text-h1 text-foreground tracking-tight"
        id="booking-heading"
      >
        {customerBookingCopy.detailsHeading}
      </h1>
      <p className="mt-4 max-w-prose text-body text-muted-foreground">
        {customerBookingCopy.noAvailabilityEngine}
      </p>
      <div className="mt-8">
        <QuoteStepper
          current={step}
          label={customerBookingCopy.stepProgress}
          steps={STEPS}
        />
      </div>
      {serviceUnavailable || service === null ? (
        <p className="mt-6 text-body text-destructive" role="alert">
          {customerBookingCopy.unavailableService}{" "}
          <Link
            className="underline underline-offset-4"
            href={CUSTOMER_PATHS.services}
          >
            {customerQuoteCopy.changeService}
          </Link>
        </p>
      ) : null}
      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        {step === 0 && service !== null ? (
          <div>
            <p className="text-label font-medium text-foreground uppercase tracking-wide">
              {customerBookingCopy.selectedService}
            </p>
            <p className="mt-2 text-body text-foreground">
              {service.name}{" "}
              <Link
                className="text-primary underline underline-offset-4"
                href={customerServicePath(service.slug)}
              >
                {customerBookingCopy.changeService}
              </Link>
            </p>
          </div>
        ) : null}
        {step === 1 ? (
          <div className="flex flex-col gap-6">
            <Field
              error={fieldErrors.scheduledDate}
              errorId={`${instanceId}-date-error`}
              htmlFor={`${instanceId}-date`}
              label={customerBookingFieldCopy.scheduledDate}
            >
              <Input
                aria-invalid={fieldErrors.scheduledDate !== undefined}
                id={`${instanceId}-date`}
                min={minDate}
                name="scheduledDate"
                onChange={handleChange}
                type="date"
                value={fields.scheduledDate}
              />
            </Field>
            <Field
              error={fieldErrors.scheduledTime}
              errorId={`${instanceId}-time-error`}
              htmlFor={`${instanceId}-time`}
              label={customerBookingFieldCopy.scheduledTime}
            >
              <Input
                aria-invalid={fieldErrors.scheduledTime !== undefined}
                id={`${instanceId}-time`}
                name="scheduledTime"
                onChange={handleChange}
                type="time"
                value={fields.scheduledTime}
              />
            </Field>
            <Field
              error={fieldErrors.serviceAddress}
              errorId={`${instanceId}-address-error`}
              htmlFor={`${instanceId}-address`}
              label={customerBookingFieldCopy.serviceAddress}
            >
              <Input
                aria-invalid={fieldErrors.serviceAddress !== undefined}
                autoComplete="street-address"
                id={`${instanceId}-address`}
                name="serviceAddress"
                onChange={handleChange}
                value={fields.serviceAddress}
              />
            </Field>
            <Field
              error={fieldErrors.notes}
              errorId={`${instanceId}-notes-error`}
              htmlFor={`${instanceId}-notes`}
              label={customerBookingFieldCopy.notes}
            >
              <Textarea
                id={`${instanceId}-notes`}
                maxLength={1000}
                name="notes"
                onChange={handleChange}
                value={fields.notes}
              />
              <p className="text-caption text-muted-foreground">
                {customerBookingFieldCopy.notesHint}
              </p>
            </Field>
          </div>
        ) : null}
        {step === 2 && service !== null ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-h2 text-foreground tracking-tight">
              {customerBookingCopy.reviewHeading}
            </h2>
            <p className="text-body text-foreground">{service.name}</p>
            <p className="text-body text-muted-foreground">
              {fields.scheduledDate} · {fields.scheduledTime}
            </p>
            <p className="text-body text-muted-foreground">
              {fields.serviceAddress}
            </p>
            {fields.notes.trim() === "" ? null : (
              <p className="text-body text-muted-foreground">{fields.notes}</p>
            )}
            <Button
              onClick={(): void => setStep(1)}
              type="button"
              variant="ghost"
            >
              {customerBookingCopy.edit}
            </Button>
          </div>
        ) : null}
        {serverError !== null ? (
          <p className="mt-6 text-body text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {step > 0 ? (
            <Button
              onClick={(): void => setStep((current) => current - 1)}
              type="button"
              variant="outline"
            >
              Back
            </Button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <Button
              disabled={service === null}
              onClick={handleContinue}
              type="button"
            >
              {customerBookingCopy.continue}
            </Button>
          ) : (
            <Button
              disabled={submitting || service === null}
              isLoading={submitting}
              type="submit"
            >
              {submitting
                ? customerBookingCopy.submitting
                : customerBookingCopy.submit}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

function Field({
  children,
  error,
  errorId,
  htmlFor,
  label,
}: {
  children: ReactElement | ReactElement[];
  error: string | undefined;
  errorId: string;
  htmlFor: string;
  label: string;
}): ReactElement {
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
