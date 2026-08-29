"use client";

import { Input } from "@neatly/ui";
import {
  type FormEvent,
  type ReactElement,
  useEffect,
  useId,
  useState,
} from "react";
import {
  AdminFormDialog,
  AdminFormField,
} from "@/components/admin/admin-mutation-dialogs";
import { adminCustomerCopy } from "@/config/admin-customers";
import { createAdminCustomer } from "@/lib/admin/customers";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { toast } from "@/lib/toast";
import { createCustomerFormSchema } from "@/lib/validations/admin-mutation.schema";

interface CustomersCreateDialogProps {
  onCreated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CustomersCreateDialog({
  onCreated,
  onOpenChange,
  open,
}: CustomersCreateDialogProps): ReactElement {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();
  const [values, setValues] = useState({
    address: "",
    email: "",
    name: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAdminMutation(createAdminCustomer);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({ address: "", email: "", name: "", phone: "" });
    setFieldErrors({});
    mutation.reset();
  }, [open, mutation.reset]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = createCustomerFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setFieldErrors({});
    const result = await mutation.submit(parsed.data);

    if (!result.ok) {
      setFieldErrors(result.fields);
      toast.error({ title: adminCustomerCopy.createError });
      return;
    }

    setValues({ address: "", email: "", name: "", phone: "" });
    onOpenChange(false);
    onCreated?.();
    toast.success({ title: adminCustomerCopy.createSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminCustomerCopy.cancelLabel}
      description={adminCustomerCopy.createDescription}
      error={mutation.error?.message ?? null}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminCustomerCopy.saveLabel}
      submitting={mutation.status === "submitting"}
      title={adminCustomerCopy.createTitle}
    >
      <AdminFormField
        error={fieldErrors.name}
        htmlFor={nameId}
        label={adminCustomerCopy.nameLabel}
      >
        <Input
          id={nameId}
          onChange={(event): void => {
            setValues({ ...values, name: event.target.value });
          }}
          value={values.name}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.email}
        htmlFor={emailId}
        label={adminCustomerCopy.emailLabel}
      >
        <Input
          id={emailId}
          onChange={(event): void => {
            setValues({ ...values, email: event.target.value });
          }}
          type="email"
          value={values.email}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.phone}
        htmlFor={phoneId}
        label={adminCustomerCopy.phoneLabel}
      >
        <Input
          id={phoneId}
          onChange={(event): void => {
            setValues({ ...values, phone: event.target.value });
          }}
          type="tel"
          value={values.phone}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.address}
        htmlFor={addressId}
        label={adminCustomerCopy.addressLabel}
      >
        <Input
          id={addressId}
          onChange={(event): void => {
            setValues({ ...values, address: event.target.value });
          }}
          value={values.address}
        />
      </AdminFormField>
    </AdminFormDialog>
  );
}
