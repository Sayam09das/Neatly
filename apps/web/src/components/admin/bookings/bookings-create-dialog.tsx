"use client";

import { Input, Textarea } from "@neatly/ui";
import {
  type FormEvent,
  type ReactElement,
  useEffect,
  useId,
  useState,
} from "react";
import {
  ADMIN_SELECT_CLASS,
  AdminFormDialog,
  AdminFormField,
} from "@/components/admin/admin-mutation-dialogs";
import { adminBookingCopy } from "@/config/admin-bookings";
import {
  createAdminBooking,
  fromDatetimeLocalValue,
} from "@/lib/admin/bookings";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { toast } from "@/lib/toast";
import { createBookingFormSchema } from "@/lib/validations/admin-mutation.schema";
import type { AdminBookingFilterCatalog } from "@/types/admin-booking";

interface BookingsCreateDialogProps {
  catalog: AdminBookingFilterCatalog;
  onCreated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function BookingsCreateDialog({
  catalog,
  onCreated,
  onOpenChange,
  open,
}: BookingsCreateDialogProps): ReactElement {
  const customerId = useId();
  const serviceId = useId();
  const cleanerId = useId();
  const scheduledId = useId();
  const addressId = useId();
  const notesId = useId();
  const [values, setValues] = useState({
    cleanerId: "",
    customerId: "",
    notes: "",
    scheduledAt: "",
    serviceAddress: "",
    serviceId: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAdminMutation(createAdminBooking);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      cleanerId: "",
      customerId: "",
      notes: "",
      scheduledAt: "",
      serviceAddress: "",
      serviceId: "",
    });
    setFieldErrors({});
    mutation.reset();
  }, [open, mutation.reset]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = createBookingFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setFieldErrors({});
    const result = await mutation.submit({
      ...parsed.data,
      scheduledAt: fromDatetimeLocalValue(parsed.data.scheduledAt),
    });

    if (!result.ok) {
      setFieldErrors(result.fields);
      toast.error({ title: adminBookingCopy.createError });
      return;
    }

    onOpenChange(false);
    onCreated?.();
    toast.success({ title: adminBookingCopy.createSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminBookingCopy.cancelLabel}
      description={adminBookingCopy.createDescription}
      error={mutation.error?.message ?? null}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminBookingCopy.saveLabel}
      submitting={mutation.status === "submitting"}
      title={adminBookingCopy.createTitle}
    >
      <AdminFormField
        error={fieldErrors.customerId}
        htmlFor={customerId}
        label={adminBookingCopy.filterCustomerLabel}
      >
        <select
          className={ADMIN_SELECT_CLASS}
          id={customerId}
          onChange={(event): void => {
            setValues({ ...values, customerId: event.target.value });
          }}
          value={values.customerId}
        >
          <option value="">{adminBookingCopy.selectCustomer}</option>
          {catalog.customers.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.serviceId}
        htmlFor={serviceId}
        label={adminBookingCopy.filterServiceLabel}
      >
        <select
          className={ADMIN_SELECT_CLASS}
          id={serviceId}
          onChange={(event): void => {
            setValues({ ...values, serviceId: event.target.value });
          }}
          value={values.serviceId}
        >
          <option value="">{adminBookingCopy.selectService}</option>
          {catalog.services.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.cleanerId}
        htmlFor={cleanerId}
        label={adminBookingCopy.filterCleanerLabel}
      >
        <select
          className={ADMIN_SELECT_CLASS}
          id={cleanerId}
          onChange={(event): void => {
            setValues({ ...values, cleanerId: event.target.value });
          }}
          value={values.cleanerId}
        >
          <option value="">{adminBookingCopy.unassignedCleaner}</option>
          {catalog.cleaners.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </AdminFormField>
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
