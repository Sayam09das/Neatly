"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Textarea,
} from "@neatly/ui";
import {
  type FormEvent,
  type ReactElement,
  useEffect,
  useId,
  useState,
} from "react";
import { MoreIcon } from "@/components/admin/admin-icons";
import {
  ADMIN_SELECT_CLASS,
  AdminConfirmDialog,
  AdminFormDialog,
  AdminFormField,
} from "@/components/admin/admin-mutation-dialogs";
import {
  adminBookingCopy,
  adminBookingStatusLabels,
} from "@/config/admin-bookings";
import { getAdminBookingStatusOptions } from "@/lib/admin/booking-transitions";
import {
  assignAdminBookingCleaner,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
  updateAdminBooking,
  updateAdminBookingStatus,
} from "@/lib/admin/bookings";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { toast } from "@/lib/toast";
import {
  assignCleanerFormSchema,
  changeBookingStatusFormSchema,
  updateBookingFormSchema,
} from "@/lib/validations/admin-mutation.schema";
import type {
  AdminBooking,
  AdminBookingFilterCatalog,
  AdminBookingStatus,
} from "@/types/admin-booking";

interface BookingRowActionsProps {
  booking: AdminBooking;
  catalog: AdminBookingFilterCatalog;
  onMutated?: () => void;
}

export function BookingRowActions({
  booking,
  catalog,
  onMutated,
}: BookingRowActionsProps): ReactElement {
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const mutationsEnabled = onMutated !== undefined;
  const nextStatuses = getAdminBookingStatusOptions(booking.status);
  const canChangeStatus = mutationsEnabled && nextStatuses.length > 0;
  const canCancel = mutationsEnabled && nextStatuses.includes("CANCELLED");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={adminBookingCopy.actionsLabel}
            size="icon"
            variant="ghost"
          >
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {adminBookingCopy.comingSoonHint}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            {adminBookingCopy.viewDetailsAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setEditOpen(true);
            }}
          >
            {adminBookingCopy.editAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setAssignOpen(true);
            }}
          >
            {adminBookingCopy.assignCleanerAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canChangeStatus}
            onSelect={(): void => {
              setStatusOpen(true);
            }}
          >
            {adminBookingCopy.changeStatusAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canCancel}
            onSelect={(): void => {
              setCancelOpen(true);
            }}
          >
            {adminBookingCopy.cancelAction}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookingEditDialog
        booking={booking}
        onMutated={onMutated}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
      <BookingAssignDialog
        booking={booking}
        catalog={catalog}
        onMutated={onMutated}
        onOpenChange={setAssignOpen}
        open={assignOpen}
      />
      <BookingStatusDialog
        booking={booking}
        onMutated={onMutated}
        onOpenChange={setStatusOpen}
        open={statusOpen}
      />
      <BookingCancelDialog
        booking={booking}
        onMutated={onMutated}
        onOpenChange={setCancelOpen}
        open={cancelOpen}
      />
    </>
  );
}

function BookingEditDialog({
  booking,
  onMutated,
  onOpenChange,
  open,
}: {
  booking: AdminBooking;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const scheduledId = useId();
  const addressId = useId();
  const notesId = useId();
  const [values, setValues] = useState({
    notes: booking.notes ?? "",
    scheduledAt: toDatetimeLocalValue(booking.scheduledAt),
    serviceAddress: booking.serviceAddress ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      notes: booking.notes ?? "",
      scheduledAt: toDatetimeLocalValue(booking.scheduledAt),
      serviceAddress: booking.serviceAddress ?? "",
    });
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [booking.notes, booking.scheduledAt, booking.serviceAddress, open]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = updateBookingFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await updateAdminBooking(booking.id, {
      notes: parsed.data.notes,
      scheduledAt: fromDatetimeLocalValue(parsed.data.scheduledAt),
      serviceAddress: parsed.data.serviceAddress,
    });
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminBookingCopy.editError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminBookingCopy.editSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminBookingCopy.cancelLabel}
      description={adminBookingCopy.editDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminBookingCopy.saveLabel}
      submitting={submitting}
      title={adminBookingCopy.editTitle}
    >
      <AdminFormField
        error={fieldErrors.scheduledAt}
        htmlFor={scheduledId}
        label={adminBookingCopy.scheduledAtLabel}
      >
        <Input
          id={scheduledId}
          onChange={(event): void => {
            setValues({ ...values, scheduledAt: event.target.value });
          }}
          type="datetime-local"
          value={values.scheduledAt}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.serviceAddress}
        htmlFor={addressId}
        label={adminBookingCopy.serviceAddressLabel}
      >
        <Input
          id={addressId}
          onChange={(event): void => {
            setValues({ ...values, serviceAddress: event.target.value });
          }}
          value={values.serviceAddress}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.notes}
        htmlFor={notesId}
        label={adminBookingCopy.notesLabel}
      >
        <Textarea
          id={notesId}
          onChange={(event): void => {
            setValues({ ...values, notes: event.target.value });
          }}
          rows={4}
          value={values.notes}
        />
      </AdminFormField>
    </AdminFormDialog>
  );
}

function BookingAssignDialog({
  booking,
  catalog,
  onMutated,
  onOpenChange,
  open,
}: {
  booking: AdminBooking;
  catalog: AdminBookingFilterCatalog;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const cleanerFieldId = useId();
  const [cleanerId, setCleanerId] = useState(booking.cleanerId ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCleanerId(booking.cleanerId ?? "");
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [booking.cleanerId, open]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = assignCleanerFormSchema.safeParse({ cleanerId });

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await assignAdminBookingCleaner(
      booking.id,
      parsed.data.cleanerId,
    );
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminBookingCopy.assignCleanerError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminBookingCopy.assignCleanerSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminBookingCopy.cancelLabel}
      description={adminBookingCopy.assignCleanerDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminBookingCopy.saveLabel}
      submitting={submitting}
      title={adminBookingCopy.assignCleanerTitle}
    >
      <AdminFormField
        error={fieldErrors.cleanerId}
        htmlFor={cleanerFieldId}
        label={adminBookingCopy.filterCleanerLabel}
      >
        <select
          className={ADMIN_SELECT_CLASS}
          id={cleanerFieldId}
          onChange={(event): void => {
            setCleanerId(event.target.value);
          }}
          value={cleanerId}
        >
          <option value="">{adminBookingCopy.unassignedCleaner}</option>
          {catalog.cleaners.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminFormField>
    </AdminFormDialog>
  );
}

function BookingStatusDialog({
  booking,
  onMutated,
  onOpenChange,
  open,
}: {
  booking: AdminBooking;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const statusId = useId();
  const options = getAdminBookingStatusOptions(booking.status);
  const [status, setStatus] = useState(options[0] ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setStatus(getAdminBookingStatusOptions(booking.status)[0] ?? "");
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [booking.status, open]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = changeBookingStatusFormSchema.safeParse({ status });

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await updateAdminBookingStatus(
      booking.id,
      parsed.data.status as AdminBookingStatus,
    );
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminBookingCopy.changeStatusError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminBookingCopy.changeStatusSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminBookingCopy.cancelLabel}
      description={adminBookingCopy.changeStatusDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminBookingCopy.saveLabel}
      submitting={submitting}
      title={adminBookingCopy.changeStatusTitle}
    >
      <AdminFormField
        error={fieldErrors.status}
        htmlFor={statusId}
        label={adminBookingCopy.statusLabel}
      >
        <select
          className={ADMIN_SELECT_CLASS}
          id={statusId}
          onChange={(event): void => {
            setStatus(event.target.value);
          }}
          value={status}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {adminBookingStatusLabels[option]}
            </option>
          ))}
        </select>
      </AdminFormField>
    </AdminFormDialog>
  );
}

function BookingCancelDialog({
  booking,
  onMutated,
  onOpenChange,
  open,
}: {
  booking: AdminBooking;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await updateAdminBookingStatus(booking.id, "CANCELLED");
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminBookingCopy.cancelError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminBookingCopy.cancelSuccess });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminBookingCopy.cancelLabel}
      confirmLabel={adminBookingCopy.confirmCancelAction}
      description={adminBookingCopy.confirmCancelDescription}
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={adminBookingCopy.confirmCancelTitle}
      variant="destructive"
    />
  );
}
