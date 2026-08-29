"use client";

import { Button, Label, Textarea } from "@neatly/ui";
import Link from "next/link";
import {
  type FormEvent,
  type ReactElement,
  useId,
  useMemo,
  useState,
} from "react";
import { CustomerConfirmDialog } from "@/components/customer/customer-confirm-dialog";
import { RatingInput } from "@/components/customer/reviews/rating-input";
import {
  customerBookingDetailPath,
  customerReviewStatusLabels,
  customerReviewsCopy,
} from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import { useCustomerRefresh } from "@/lib/customer/refresh";
import {
  createCustomerReview,
  deleteCustomerReview,
  updateCustomerReview,
} from "@/lib/customer/reviews";
import { formatCustomerSchedule } from "@/lib/customer/schedule";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import {
  type CustomerReviewFormValues,
  customerReviewFormSchema,
} from "@/lib/validations/customer-review.schema";
import type {
  CustomerEligibleBooking,
  CustomerReview,
  CustomerReviewWorkspace,
} from "@/types/customer";

interface CustomerReviewsProps {
  bookingId: string | null;
  workspace: CustomerReviewWorkspace;
}

export function CustomerReviews({
  bookingId,
  workspace,
}: CustomerReviewsProps): ReactElement {
  const selected =
    bookingId === null
      ? null
      : (workspace.eligibleBookings.find((item) => item.id === bookingId) ??
        null);

  return (
    <div className="w-full min-w-0 max-w-2xl">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerReviewsCopy.heading}
      </h1>
      <p className="mt-3 max-w-prose text-body text-muted-foreground">
        {customerReviewsCopy.description}
      </p>
      {selected === null ? null : (
        <ReviewEditor booking={selected} mode="create" />
      )}
      <EligibleList bookings={workspace.eligibleBookings} />
      <SubmittedList reviews={workspace.reviews} />
    </div>
  );
}

function EligibleList({
  bookings,
}: {
  bookings: readonly CustomerEligibleBooking[];
}): ReactElement {
  return (
    <section className="mt-10">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerReviewsCopy.eligibleHeading}
      </h2>
      {bookings.length === 0 ? (
        <p className="mt-4 text-body text-muted-foreground">
          {customerReviewsCopy.eligibleEmpty}
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {bookings.map((booking) => (
            <li className="border-b border-border py-4" key={booking.id}>
              <p className="text-body font-medium text-foreground">
                {booking.service?.name ?? customerReviewsCopy.viewBooking}
              </p>
              <p className="mt-1 text-body-small text-muted-foreground">
                {formatCustomerSchedule(booking.scheduledAt) ?? booking.id}
              </p>
              <Link
                className="mt-3 inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={`${customerReviewsHref(booking.id)}`}
              >
                {customerReviewsCopy.leaveAction}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SubmittedList({
  reviews,
}: {
  reviews: readonly CustomerReview[];
}): ReactElement {
  if (reviews.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerReviewsCopy.submittedListHeading}
        </h2>
        <p className="mt-4 text-body text-muted-foreground">
          {customerReviewsCopy.emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerReviewsCopy.submittedListHeading}
      </h2>
      <ul className="mt-5 space-y-8">
        {reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewCard({ review }: { review: CustomerReview }): ReactElement {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ReviewEditor
        mode="edit"
        onCancel={(): void => {
          setEditing(false);
        }}
        review={review}
      />
    );
  }

  return (
    <article className="border-b border-border pb-6">
      <p className="text-label font-medium text-muted-foreground uppercase tracking-wide">
        {customerReviewStatusLabels[review.status]}
      </p>
      <h3 className="mt-2 text-h3 text-foreground">
        {review.serviceName ?? customerReviewsCopy.viewBooking}
      </h3>
      <p className="mt-2 text-body text-muted-foreground">
        {`${String(review.rating)} / 5`}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-body text-foreground">
        {review.content}
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerBookingDetailPath(review.bookingId)}
        >
          {customerReviewsCopy.viewBooking}
        </Link>
        <Button
          onClick={(): void => {
            setEditing(true);
          }}
          type="button"
          variant="ghost"
        >
          {customerReviewsCopy.editAction}
        </Button>
        <ReviewDeleteButton review={review} />
      </div>
    </article>
  );
}

function ReviewEditor({
  booking,
  mode,
  onCancel,
  review,
}: {
  booking?: CustomerEligibleBooking;
  mode: "create" | "edit";
  onCancel?: () => void;
  review?: CustomerReview;
}): ReactElement {
  const refresh = useCustomerRefresh();
  const formId = useId();
  const initial = useMemo(
    (): CustomerReviewFormValues => ({
      content: review?.content ?? "",
      rating: review?.rating ?? 5,
    }),
    [review],
  );
  const [fields, setFields] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerReviewFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = customerReviewFormSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(collectFieldErrors(parsed.error, ["content", "rating"]));
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setError(null);

    const result =
      mode === "create" && booking !== undefined
        ? await createCustomerReview({
            bookingId: booking.id,
            content: parsed.data.content,
            rating: parsed.data.rating,
          })
        : review === undefined
          ? null
          : await updateCustomerReview(review.id, parsed.data);

    setSubmitting(false);

    if (result === null) {
      return;
    }

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setError(result.message);
      setFieldErrors({
        content: result.fields.content,
        rating: result.fields.rating,
      });
      return;
    }

    refresh();
    onCancel?.();
  }

  return (
    <form
      className="mt-8 space-y-5 rounded-sm border border-border p-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-h3 text-foreground">
        {mode === "create"
          ? customerReviewsCopy.leaveAction
          : customerReviewsCopy.editAction}
      </h2>
      {error === null ? null : (
        <p className="text-body text-destructive" role="alert">
          {error}
        </p>
      )}
      <RatingInput
        disabled={submitting}
        name={`${formId}-rating`}
        onChange={(rating): void => {
          setFields((current) => ({ ...current, rating }));
        }}
        value={fields.rating}
      />
      <FieldError message={fieldErrors.rating} />
      <div className="space-y-2">
        <Label htmlFor={`${formId}-content`}>
          {customerReviewsCopy.commentLabel}
        </Label>
        <Textarea
          disabled={submitting}
          id={`${formId}-content`}
          onChange={(event): void => {
            setFields((current) => ({
              ...current,
              content: event.target.value,
            }));
          }}
          value={fields.content}
        />
        <FieldError message={fieldErrors.content} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled={submitting} type="submit">
          {submitting
            ? mode === "create"
              ? customerReviewsCopy.saving
              : customerReviewsCopy.updating
            : mode === "create"
              ? customerReviewsCopy.saveAction
              : customerReviewsCopy.updateAction}
        </Button>
        {onCancel === undefined ? null : (
          <Button
            disabled={submitting}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {customerReviewsCopy.cancelEdit}
          </Button>
        )}
      </div>
    </form>
  );
}

function ReviewDeleteButton({
  review,
}: {
  review: CustomerReview;
}): ReactElement {
  const refresh = useCustomerRefresh();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    setBusy(true);
    setError(null);
    const result = await deleteCustomerReview(review.id);
    setBusy(false);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setError(result.message);
      return;
    }

    setOpen(false);
    refresh();
  }

  return (
    <>
      <Button
        onClick={(): void => {
          setOpen(true);
        }}
        type="button"
        variant="ghost"
      >
        {customerReviewsCopy.deleteAction}
      </Button>
      <CustomerConfirmDialog
        busy={busy}
        busyLabel={customerReviewsCopy.deleting}
        cancelLabel={customerReviewsCopy.deleteKeep}
        confirmLabel={customerReviewsCopy.deleteConfirm}
        description={customerReviewsCopy.deleteDescription}
        destructive
        error={error}
        onCancel={(): void => {
          setOpen(false);
        }}
        onConfirm={(): void => {
          void handleDelete();
        }}
        onOpenChange={setOpen}
        open={open}
        title={customerReviewsCopy.deleteTitle}
      />
    </>
  );
}

function customerReviewsHref(bookingId: string): string {
  const params = new URLSearchParams();
  params.set("booking", bookingId);
  return `/dashboard/reviews?${params.toString()}`;
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
