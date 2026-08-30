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
import { adminCleanerCopy } from "@/config/admin-cleaners";
import { createAdminCleaner } from "@/lib/admin/cleaners";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { toast } from "@/lib/toast";
import { createCleanerFormSchema } from "@/lib/validations/admin-mutation.schema";

interface CleanersCreateDialogProps {
  onCreated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CleanersCreateDialog({
  onCreated,
  onOpenChange,
  open,
}: CleanersCreateDialogProps): ReactElement {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const [values, setValues] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAdminMutation(createAdminCleaner);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({ email: "", name: "", phone: "" });
    setFieldErrors({});
    mutation.reset();
  }, [open, mutation.reset]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = createCleanerFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setFieldErrors({});
    const result = await mutation.submit(parsed.data);

    if (!result.ok) {
      setFieldErrors(result.fields);
      toast.error({ title: adminCleanerCopy.createError });
      return;
    }

    setValues({ email: "", name: "", phone: "" });
    onOpenChange(false);
    onCreated?.();
    const invitationSent =
      typeof result.data === "object" &&
      result.data !== null &&
      "invitationSent" in result.data &&
      result.data.invitationSent === true;
    toast.success({
      title: invitationSent
        ? adminCleanerCopy.createSuccess
        : adminCleanerCopy.createSuccessEmailFailed,
    });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminCleanerCopy.cancelLabel}
      description={adminCleanerCopy.createDescription}
      error={mutation.error?.message ?? null}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminCleanerCopy.primaryAction}
      submitting={mutation.status === "submitting"}
      title={adminCleanerCopy.createTitle}
    >
      <AdminFormField
        error={fieldErrors.name}
        htmlFor={nameId}
        label={adminCleanerCopy.nameLabel}
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
        label={adminCleanerCopy.emailLabel}
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
        label={adminCleanerCopy.phoneLabel}
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
    </AdminFormDialog>
  );
}
