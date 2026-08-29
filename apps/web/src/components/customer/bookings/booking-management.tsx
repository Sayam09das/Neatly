"use client";

import { Button, Input, Label, Textarea } from "@neatly/ui";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useId,
  useMemo,
  useState,
} from "react";
import { CustomerConfirmDialog } from "@/components/customer/customer-confirm-dialog";
import {
  customerBookingDetailCopy,
  customerBookingFieldCopy,
} from "@/config/customer";
import { collectFieldErrors } from "@/lib/auth/form-errors";
import {
  cancelCustomerBooking,
  updateCustomerBooking,
} from "@/lib/customer/booking";
import { useCustomerRefresh } from "@/lib/customer/refresh";
import { splitUtcSchedule } from "@/lib/customer/schedule";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import {
  type CustomerBookingUpdateValues,
  customerBookingUpdateSchema,
  toCustomerBookingUpdatePayload,
} from "@/lib/validations/customer-booking.schema";
import type { CustomerBookingView } from "@/types/customer";

interface BookingManagementProps {
  booking: CustomerBookingView;
}

export function BookingManagement({
  booking,
}: BookingManagementProps): ReactElement | null {
  const refresh = useCustomerRefresh();
  const formId = useId();
  const [fields, setFields] = useState<CustomerBookingUpdateValues>(() => ({
    notes: booking.notes ?? "",
    serviceAddress: booking.serviceAddress ?? "",
    ...splitUtcSchedule(booking.scheduledAt),
  }));
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CustomerBookingUpdateValues, string>>
  >({});
  const [busy, setBusy] = useState<"update" | "cancel" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [banner, setBanner] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);
  const minDate = useMemo((): string => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
  }, []);

  if (!booking.actions.canCancel && !booking.actions.canUpdate) {
    return null;
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const name = event.target.name as keyof CustomerBookingUpdateValues;
    setFields((current) => ({ ...current, [name]: event.target.value }));
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = customerBookingUpdateSchema.safeParse(fields);

    if (!parsed.success) {
      setFieldErrors(
        collectFieldErrors(parsed.error, [
          "notes",
          "scheduledDate",
          "scheduledTime",
          "serviceAddress",
        ]),
      );
      return;
    }

    setFieldErrors({});
    setBusy("update");
    setBanner(null);
    const result = await updateCustomerBooking(
      booking.id,
      toCustomerBookingUpdatePayload(parsed.data),
    );
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      setFieldErrors({
        notes: result.fields.notes,
        scheduledDate: result.fields.scheduledAt ?? result.fields.scheduledDate,
        scheduledTime: result.fields.scheduledTime,
        serviceAddress: result.fields.serviceAddress,
      });
      return;
    }

    setBanner({
      message: customerBookingDetailCopy.updatedSuccess,
      tone: "success",
    });
    refresh();
  }

  async function handleCancel(): Promise<void> {
    setBusy("cancel");
    setBanner(null);
    const result = await cancelCustomerBooking(booking.id);
    setBusy(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setBanner({ message: result.message, tone: "error" });
      return;
    }

    setConfirmOpen(false);
    setBanner({
      message: customerBookingDetailCopy.cancelledSuccess,
      tone: "success",
    });
    refresh();
  }

  const submitting = busy !== null;

  return (
    <section className="mt-10 max-w-2xl">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerBookingDetailCopy.manageHeading}
      </h2>
      {banner === null ? null : (
        <p
          className={
            banner.tone === "success"
              ? "mt-4 text-body text-foreground"
              : "mt-4 text-body text-destructive"
          }
          role={banner.tone === "error" ? "alert" : "status"}
        >
          {banner.message}
        </p>
      )}
      {booking.actions.canUpdate ? (
        <form className="mt-6 space-y-5" onSubmit={handleUpdate}>
          <p className="text-body-small text-muted-foreground">
            {customerBookingDetailCopy.updateDescription}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-date`}>
                {customerBookingFieldCopy.scheduledDate}
              </Label>
              <Input
                disabled={submitting}
                id={`${formId}-date`}
                min={minDate}
                name="scheduledDate"
                onChange={handleChange}
                type="date"
                value={fields.scheduledDate}
              />
              <FieldError message={fieldErrors.scheduledDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-time`}>
                {customerBookingFieldCopy.scheduledTime}
              </Label>
              <Input
                disabled={submitting}
                id={`${formId}-time`}
                name="scheduledTime"
                onChange={handleChange}
                type="time"
                value={fields.scheduledTime}
              />
              <FieldError message={fieldErrors.scheduledTime} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-address`}>
              {customerBookingFieldCopy.serviceAddress}
            </Label>
            <Input
              disabled={submitting}
              id={`${formId}-address`}
              name="serviceAddress"
              onChange={handleChange}
              value={fields.serviceAddress}
            />
            <FieldError message={fieldErrors.serviceAddress} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-notes`}>
              {customerBookingFieldCopy.notes}
            </Label>
            <Textarea
              disabled={submitting}
              id={`${formId}-notes`}
              name="notes"
              onChange={handleChange}
              value={fields.notes}
            />
            <FieldError message={fieldErrors.notes} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={submitting} type="submit">
              {busy === "update"
                ? customerBookingDetailCopy.saving
                : customerBookingDetailCopy.saveAction}
            </Button>
          </div>
        </form>
      ) : null}
      {booking.actions.canCancel ? (
        <div className="mt-8">
          <Button
            disabled={submitting}
            onClick={(): void => {
              setConfirmOpen(true);
            }}
            type="button"
            variant="outline"
          >
            {customerBookingDetailCopy.cancelAction}
          </Button>
        </div>
      ) : null}
      <CustomerConfirmDialog
        busy={busy === "cancel"}
        busyLabel={customerBookingDetailCopy.cancelling}
        cancelLabel={customerBookingDetailCopy.cancelKeep}
        confirmLabel={customerBookingDetailCopy.cancelConfirm}
        description={customerBookingDetailCopy.cancelDescription}
        destructive
        error={banner?.tone === "error" && confirmOpen ? banner.message : null}
        onCancel={(): void => {
          setConfirmOpen(false);
        }}
        onConfirm={(): void => {
          void handleCancel();
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={customerBookingDetailCopy.cancelTitle}
      />
    </section>
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
