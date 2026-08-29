"use client";

import { Button, Input, Label, Textarea } from "@neatly/ui";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { QuoteStepper } from "@/components/customer/quote/quote-stepper";
import {
  CUSTOMER_PATHS,
  customerQuoteCopy,
  customerQuoteFieldCopy,
  customerQuoteFrequencyLabels,
  customerQuotePropertyTypeLabels,
  customerQuoteServiceTypeLabels,
  customerServiceDetailCopy,
  customerServicePath,
  QUOTE_APPROXIMATE_SIZES,
  QUOTE_PREFERRED_TIMES,
} from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { submitQuoteRequest } from "@/lib/customer/quote";
import {
  emptyQuoteRequestValues,
  type QuoteRequestFormValues,
  quoteFrequencies,
  quotePropertyTypes,
  quoteRequestFormSchema,
  quoteServiceTypes,
  toQuoteRequestPayload,
} from "@/lib/validations/public-quote.schema";
import type {
  CustomerServiceDetail,
  QuoteRequestConfirmation,
} from "@/types/customer";

const STEPS = [
  { id: "service", label: customerQuoteCopy.stepService },
  { id: "property", label: customerQuoteCopy.stepProperty },
  { id: "details", label: customerQuoteCopy.stepDetails },
  { id: "contact", label: customerQuoteCopy.stepContact },
  { id: "review", label: customerQuoteCopy.stepReview },
] as const;

const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof QuoteRequestFormValues>> =
  [
    ["serviceType"],
    ["propertyType", "approximateSize", "bedrooms", "bathrooms"],
    ["frequency", "preferredDate", "preferredTime", "additionalNotes"],
    ["fullName", "email", "phone", "serviceAddress", "companyWebsite"],
    [],
  ];

interface QuoteRequestFormProps {
  service: CustomerServiceDetail | null;
  serviceUnavailable: boolean;
}

export function QuoteRequestForm({
  service,
  serviceUnavailable,
}: QuoteRequestFormProps): ReactElement {
  const instanceId = useId();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<QuoteRequestFormValues>(() => ({
    ...emptyQuoteRequestValues,
    serviceId: service?.id ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof QuoteRequestFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] =
    useState<QuoteRequestConfirmation | null>(null);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent): void {
      if (confirmation !== null || !hasMeaningfulInput(fields)) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return (): void => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [confirmation, fields]);

  const minDate = useMemo((): string => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void {
    const name = event.target.name as keyof QuoteRequestFormValues;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  function validateStep(index: number): boolean {
    const parsed = quoteRequestFormSchema.safeParse(fields);
    const keys = STEP_FIELDS[index] ?? [];

    if (parsed.success) {
      setFieldErrors({});
      return true;
    }

    const next = collectFieldErrors(parsed.error, keys);
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue(): void {
    if (!validateStep(step)) {
      return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = quoteRequestFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(
        collectFieldErrors(parsed.error, [
          "additionalNotes",
          "approximateSize",
          "bathrooms",
          "bedrooms",
          "companyWebsite",
          "email",
          "frequency",
          "fullName",
          "phone",
          "preferredDate",
          "preferredTime",
          "propertyType",
          "serviceAddress",
          "serviceType",
        ]),
      );
      return;
    }

    setSubmitting(true);
    setServerError(null);
    const result = await submitQuoteRequest(toQuoteRequestPayload(parsed.data));
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(
        result.fields as Partial<Record<keyof QuoteRequestFormValues, string>>,
      );
      setServerError(result.message || customerQuoteCopy.serverError);
      return;
    }

    setConfirmation(result.data);
  }

  if (confirmation !== null) {
    return (
      <section aria-labelledby="quote-confirm-heading" className="max-w-xl">
        <h1
          className="text-h1 text-foreground tracking-tight"
          id="quote-confirm-heading"
        >
          {customerQuoteCopy.confirmationHeading}
        </h1>
        <p className="mt-4 text-body text-muted-foreground" role="status">
          {customerQuoteCopy.confirmationBody}
        </p>
        <p className="mt-6 text-body text-foreground">
          Reference {confirmation.id}
        </p>
        <p className="mt-8">
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={CUSTOMER_PATHS.services}
          >
            {customerQuoteCopy.confirmationNext}
          </Link>
        </p>
      </section>
    );
  }

  const errorPrefix = instanceId;

  return (
    <section
      aria-labelledby="quote-heading"
      className="w-full min-w-0 max-w-xl"
    >
      <h1 className="text-h1 text-foreground tracking-tight" id="quote-heading">
        Request a quote
      </h1>
      <p className="mt-4 max-w-prose text-body text-muted-foreground">
        Share your property details so we can prepare a quote. This is a
        request, not a booking.
      </p>
      <div className="mt-8">
        <QuoteStepper
          current={step}
          label={customerQuoteCopy.stepProgress}
          steps={STEPS}
        />
      </div>
      {serviceUnavailable ? (
        <p className="mt-6 text-body text-destructive" role="alert">
          {customerQuoteCopy.unavailableService}{" "}
          <Link
            className="underline underline-offset-4"
            href={CUSTOMER_PATHS.services}
          >
            {customerServiceDetailCopy.changeService}
          </Link>
        </p>
      ) : null}
      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <div className="sr-only" aria-hidden="true">
          <Label htmlFor={`${instanceId}-honeypot`}>
            {customerQuoteCopy.honeypotLabel}
          </Label>
          <Input
            autoComplete="off"
            id={`${instanceId}-honeypot`}
            name="companyWebsite"
            onChange={handleChange}
            tabIndex={-1}
            value={fields.companyWebsite}
          />
        </div>
        {step === 0 ? (
          <ServiceStep
            errorPrefix={errorPrefix}
            fields={fields}
            onChange={handleChange}
            service={service}
            serviceTypeError={fieldErrors.serviceType}
          />
        ) : null}
        {step === 1 ? (
          <PropertyStep
            errorPrefix={errorPrefix}
            fields={fields}
            onChange={handleChange}
            errors={fieldErrors}
          />
        ) : null}
        {step === 2 ? (
          <DetailsStep
            errorPrefix={errorPrefix}
            errors={fieldErrors}
            fields={fields}
            minDate={minDate}
            onChange={handleChange}
          />
        ) : null}
        {step === 3 ? (
          <ContactStep
            errorPrefix={errorPrefix}
            errors={fieldErrors}
            fields={fields}
            onChange={handleChange}
          />
        ) : null}
        {step === 4 ? (
          <QuoteReview fields={fields} onEdit={setStep} service={service} />
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
            <Button onClick={handleContinue} type="button">
              {customerQuoteCopy.continue}
            </Button>
          ) : (
            <Button disabled={submitting} isLoading={submitting} type="submit">
              {submitting
                ? customerQuoteCopy.submitting
                : customerQuoteCopy.submit}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

function hasMeaningfulInput(fields: QuoteRequestFormValues): boolean {
  return (
    fields.fullName.trim() !== "" ||
    fields.email.trim() !== "" ||
    fields.phone.trim() !== "" ||
    fields.serviceAddress.trim() !== "" ||
    fields.additionalNotes.trim() !== ""
  );
}

interface StepProps {
  errorPrefix: string;
  errors?: Partial<Record<keyof QuoteRequestFormValues, string>>;
  fields: QuoteRequestFormValues;
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

function ServiceStep({
  errorPrefix,
  fields,
  onChange,
  service,
  serviceTypeError,
}: StepProps & {
  service: CustomerServiceDetail | null;
  serviceTypeError: string | undefined;
}): ReactElement {
  const selectId = `${errorPrefix}-serviceType`;
  const errorId = `${errorPrefix}-serviceType-error`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-label font-medium text-foreground uppercase tracking-wide">
          {customerQuoteCopy.selectedService}
        </p>
        {service === null ? (
          <p className="mt-2 text-body text-muted-foreground">
            {customerQuoteCopy.noServiceSelected}{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href={CUSTOMER_PATHS.services}
            >
              {customerQuoteCopy.changeService}
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-body text-foreground">
            {service.name}{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href={customerServicePath(service.slug)}
            >
              {customerQuoteCopy.changeService}
            </Link>
          </p>
        )}
      </div>
      <Field
        error={serviceTypeError}
        errorId={errorId}
        htmlFor={selectId}
        label={customerQuoteFieldCopy.serviceType}
      >
        <SelectControl
          describedBy={serviceTypeError === undefined ? undefined : errorId}
          id={selectId}
          invalid={serviceTypeError !== undefined}
          name="serviceType"
          onChange={onChange}
          value={fields.serviceType}
        >
          {quoteServiceTypes.map((value) => (
            <option key={value} value={value}>
              {customerQuoteServiceTypeLabels[value]}
            </option>
          ))}
        </SelectControl>
      </Field>
    </div>
  );
}

function PropertyStep({
  errorPrefix,
  errors = {},
  fields,
  onChange,
}: StepProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Field
        error={errors.propertyType}
        errorId={`${errorPrefix}-propertyType-error`}
        htmlFor={`${errorPrefix}-propertyType`}
        label={customerQuoteFieldCopy.propertyType}
      >
        <SelectControl
          describedBy={
            errors.propertyType === undefined
              ? undefined
              : `${errorPrefix}-propertyType-error`
          }
          id={`${errorPrefix}-propertyType`}
          invalid={errors.propertyType !== undefined}
          name="propertyType"
          onChange={onChange}
          value={fields.propertyType}
        >
          {quotePropertyTypes.map((value) => (
            <option key={value} value={value}>
              {customerQuotePropertyTypeLabels[value]}
            </option>
          ))}
        </SelectControl>
      </Field>
      <Field
        error={errors.approximateSize}
        errorId={`${errorPrefix}-size-error`}
        htmlFor={`${errorPrefix}-size`}
        label={customerQuoteFieldCopy.approximateSize}
      >
        <SelectControl
          describedBy={
            errors.approximateSize === undefined
              ? undefined
              : `${errorPrefix}-size-error`
          }
          id={`${errorPrefix}-size`}
          invalid={errors.approximateSize !== undefined}
          name="approximateSize"
          onChange={onChange}
          value={fields.approximateSize}
        >
          {QUOTE_APPROXIMATE_SIZES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </SelectControl>
      </Field>
      <Field
        error={errors.bedrooms}
        errorId={`${errorPrefix}-bedrooms-error`}
        htmlFor={`${errorPrefix}-bedrooms`}
        label={customerQuoteFieldCopy.bedrooms}
      >
        <Input
          aria-describedby={
            errors.bedrooms === undefined
              ? undefined
              : `${errorPrefix}-bedrooms-error`
          }
          aria-invalid={errors.bedrooms !== undefined}
          id={`${errorPrefix}-bedrooms`}
          inputMode="numeric"
          min={0}
          name="bedrooms"
          onChange={onChange}
          type="number"
          value={fields.bedrooms}
        />
      </Field>
      <Field
        error={errors.bathrooms}
        errorId={`${errorPrefix}-bathrooms-error`}
        htmlFor={`${errorPrefix}-bathrooms`}
        label={customerQuoteFieldCopy.bathrooms}
      >
        <Input
          aria-describedby={
            errors.bathrooms === undefined
              ? undefined
              : `${errorPrefix}-bathrooms-error`
          }
          aria-invalid={errors.bathrooms !== undefined}
          id={`${errorPrefix}-bathrooms`}
          inputMode="decimal"
          min={1}
          name="bathrooms"
          onChange={onChange}
          step={0.5}
          type="number"
          value={fields.bathrooms}
        />
      </Field>
    </div>
  );
}

function DetailsStep({
  errorPrefix,
  errors = {},
  fields,
  minDate,
  onChange,
}: StepProps & { minDate: string }): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Field
        error={errors.frequency}
        errorId={`${errorPrefix}-frequency-error`}
        htmlFor={`${errorPrefix}-frequency`}
        label={customerQuoteFieldCopy.frequency}
      >
        <SelectControl
          describedBy={
            errors.frequency === undefined
              ? undefined
              : `${errorPrefix}-frequency-error`
          }
          id={`${errorPrefix}-frequency`}
          invalid={errors.frequency !== undefined}
          name="frequency"
          onChange={onChange}
          value={fields.frequency}
        >
          {quoteFrequencies.map((value) => (
            <option key={value} value={value}>
              {customerQuoteFrequencyLabels[value]}
            </option>
          ))}
        </SelectControl>
      </Field>
      <Field
        error={errors.preferredDate}
        errorId={`${errorPrefix}-date-error`}
        htmlFor={`${errorPrefix}-date`}
        label={customerQuoteFieldCopy.preferredDate}
      >
        <Input
          aria-describedby={
            errors.preferredDate === undefined
              ? undefined
              : `${errorPrefix}-date-error`
          }
          aria-invalid={errors.preferredDate !== undefined}
          id={`${errorPrefix}-date`}
          min={minDate}
          name="preferredDate"
          onChange={onChange}
          type="date"
          value={fields.preferredDate}
        />
      </Field>
      <Field
        error={errors.preferredTime}
        errorId={`${errorPrefix}-time-error`}
        htmlFor={`${errorPrefix}-time`}
        label={customerQuoteFieldCopy.preferredTime}
      >
        <SelectControl
          describedBy={
            errors.preferredTime === undefined
              ? undefined
              : `${errorPrefix}-time-error`
          }
          id={`${errorPrefix}-time`}
          invalid={errors.preferredTime !== undefined}
          name="preferredTime"
          onChange={onChange}
          value={fields.preferredTime}
        >
          {QUOTE_PREFERRED_TIMES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </SelectControl>
      </Field>
      <Field
        error={errors.additionalNotes}
        errorId={`${errorPrefix}-notes-error`}
        htmlFor={`${errorPrefix}-notes`}
        label={customerQuoteFieldCopy.additionalNotes}
      >
        <Textarea
          aria-describedby={
            errors.additionalNotes === undefined
              ? `${errorPrefix}-notes-hint`
              : `${errorPrefix}-notes-error`
          }
          id={`${errorPrefix}-notes`}
          maxLength={1000}
          name="additionalNotes"
          onChange={onChange}
          value={fields.additionalNotes}
        />
        <p
          className="text-caption text-muted-foreground"
          id={`${errorPrefix}-notes-hint`}
        >
          {customerQuoteFieldCopy.additionalNotesHint}
        </p>
      </Field>
    </div>
  );
}

function ContactStep({
  errorPrefix,
  errors = {},
  fields,
  onChange,
}: StepProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Field
        error={errors.fullName}
        errorId={`${errorPrefix}-name-error`}
        htmlFor={`${errorPrefix}-name`}
        label={customerQuoteFieldCopy.fullName}
      >
        <Input
          aria-invalid={errors.fullName !== undefined}
          autoComplete="name"
          id={`${errorPrefix}-name`}
          name="fullName"
          onChange={onChange}
          value={fields.fullName}
        />
      </Field>
      <Field
        error={errors.email}
        errorId={`${errorPrefix}-email-error`}
        htmlFor={`${errorPrefix}-email`}
        label={customerQuoteFieldCopy.email}
      >
        <Input
          aria-invalid={errors.email !== undefined}
          autoComplete="email"
          id={`${errorPrefix}-email`}
          name="email"
          onChange={onChange}
          type="email"
          value={fields.email}
        />
      </Field>
      <Field
        error={errors.phone}
        errorId={`${errorPrefix}-phone-error`}
        htmlFor={`${errorPrefix}-phone`}
        label={customerQuoteFieldCopy.phone}
      >
        <Input
          aria-invalid={errors.phone !== undefined}
          autoComplete="tel"
          id={`${errorPrefix}-phone`}
          name="phone"
          onChange={onChange}
          type="tel"
          value={fields.phone}
        />
      </Field>
      <Field
        error={errors.serviceAddress}
        errorId={`${errorPrefix}-address-error`}
        htmlFor={`${errorPrefix}-address`}
        label={customerQuoteFieldCopy.serviceAddress}
      >
        <Input
          aria-invalid={errors.serviceAddress !== undefined}
          autoComplete="street-address"
          id={`${errorPrefix}-address`}
          name="serviceAddress"
          onChange={onChange}
          value={fields.serviceAddress}
        />
      </Field>
    </div>
  );
}

function QuoteReview({
  fields,
  onEdit,
  service,
}: {
  fields: QuoteRequestFormValues;
  onEdit: (step: number) => void;
  service: CustomerServiceDetail | null;
}): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerQuoteCopy.reviewHeading}
      </h2>
      <ReviewBlock
        onEdit={(): void => onEdit(0)}
        title={customerQuoteCopy.stepService}
      >
        <p>{service?.name ?? customerQuoteCopy.noServiceSelected}</p>
        <p>{customerQuoteServiceTypeLabels[fields.serviceType]}</p>
      </ReviewBlock>
      <ReviewBlock
        onEdit={(): void => onEdit(1)}
        title={customerQuoteCopy.stepProperty}
      >
        <p>{customerQuotePropertyTypeLabels[fields.propertyType]}</p>
        <p>{fields.approximateSize}</p>
        {fields.bedrooms !== "" ? <p>Bedrooms: {fields.bedrooms}</p> : null}
        {fields.bathrooms !== "" ? <p>Bathrooms: {fields.bathrooms}</p> : null}
      </ReviewBlock>
      <ReviewBlock
        onEdit={(): void => onEdit(2)}
        title={customerQuoteCopy.stepDetails}
      >
        <p>{customerQuoteFrequencyLabels[fields.frequency]}</p>
        <p>
          {fields.preferredDate} · {fields.preferredTime}
        </p>
        {fields.additionalNotes.trim() === "" ? null : (
          <p>{fields.additionalNotes}</p>
        )}
      </ReviewBlock>
      <ReviewBlock
        onEdit={(): void => onEdit(3)}
        title={customerQuoteCopy.stepContact}
      >
        <p>{fields.fullName}</p>
        <p>{fields.email}</p>
        <p>{fields.phone}</p>
        <p>{fields.serviceAddress}</p>
      </ReviewBlock>
    </div>
  );
}

function ReviewBlock({
  children,
  onEdit,
  title,
}: {
  children: ReactNode;
  onEdit: () => void;
  title: string;
}): ReactElement {
  return (
    <section className="border-t border-border pt-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-h3 text-foreground tracking-tight">{title}</h3>
        <Button onClick={onEdit} type="button" variant="ghost">
          {customerQuoteCopy.edit}
        </Button>
      </div>
      <div className="mt-3 space-y-1 text-body text-muted-foreground">
        {children}
      </div>
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

function SelectControl({
  children,
  describedBy,
  id,
  invalid,
  name,
  onChange,
  value,
}: {
  children: ReactElement | ReactElement[];
  describedBy: string | undefined;
  id: string;
  invalid: boolean;
  name: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}): ReactElement {
  return (
    <select
      aria-describedby={describedBy}
      aria-invalid={invalid}
      className="flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      id={id}
      name={name}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
}
