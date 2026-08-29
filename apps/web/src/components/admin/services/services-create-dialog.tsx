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
  AdminFormDialog,
  AdminFormField,
} from "@/components/admin/admin-mutation-dialogs";
import { adminServiceCopy } from "@/config/admin-services";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { createAdminService } from "@/lib/admin/services";
import { useAdminMutation } from "@/lib/admin/use-admin-mutation";
import { toast } from "@/lib/toast";
import { createServiceFormSchema } from "@/lib/validations/admin-mutation.schema";

interface ServicesCreateDialogProps {
  onCreated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function ServicesCreateDialog({
  onCreated,
  onOpenChange,
  open,
}: ServicesCreateDialogProps): ReactElement {
  const nameId = useId();
  const shortId = useId();
  const fullId = useId();
  const [values, setValues] = useState({
    fullDescription: "",
    name: "",
    shortDescription: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAdminMutation(createAdminService);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({ fullDescription: "", name: "", shortDescription: "" });
    setFieldErrors({});
    mutation.reset();
  }, [open, mutation.reset]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = createServiceFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setFieldErrors({});
    const result = await mutation.submit(parsed.data);

    if (!result.ok) {
      setFieldErrors(result.fields);
      toast.error({ title: adminServiceCopy.createError });
      return;
    }

    onOpenChange(false);
    onCreated?.();
    toast.success({ title: adminServiceCopy.createSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminServiceCopy.cancelLabel}
      description={adminServiceCopy.createDescription}
      error={mutation.error?.message ?? null}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminServiceCopy.saveLabel}
      submitting={mutation.status === "submitting"}
      title={adminServiceCopy.createTitle}
    >
      <AdminFormField
        error={fieldErrors.name}
        htmlFor={nameId}
        label={adminServiceCopy.nameLabel}
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
        error={fieldErrors.shortDescription}
        htmlFor={shortId}
        label={adminServiceCopy.shortDescriptionLabel}
      >
        <Input
          id={shortId}
          onChange={(event): void => {
            setValues({ ...values, shortDescription: event.target.value });
          }}
          value={values.shortDescription}
        />
      </AdminFormField>
      <AdminFormField
        error={fieldErrors.fullDescription}
        htmlFor={fullId}
        label={adminServiceCopy.fullDescriptionLabel}
      >
        <Textarea
          id={fullId}
          onChange={(event): void => {
            setValues({ ...values, fullDescription: event.target.value });
          }}
          rows={5}
          value={values.fullDescription}
        />
      </AdminFormField>
    </AdminFormDialog>
  );
}
