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
import { ServiceThumbnailFields } from "@/components/admin/services/service-thumbnail-fields";
import { adminServiceCopy } from "@/config/admin-services";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import {
  createAdminService,
  uploadAdminServiceThumbnail,
} from "@/lib/admin/services";
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
    coverImageUrl: "",
    fullDescription: "",
    name: "",
    shortDescription: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAdminMutation(createAdminService);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      coverImageUrl: "",
      fullDescription: "",
      name: "",
      shortDescription: "",
    });
    setThumbnailFile(null);
    setUploading(false);
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
    let coverMediaId: string | undefined;

    if (thumbnailFile !== null) {
      setUploading(true);
      const uploaded = await uploadAdminServiceThumbnail(
        thumbnailFile,
        parsed.data.name,
      );
      setUploading(false);

      if (!uploaded.ok) {
        setFieldErrors({ file: uploaded.message });
        toast.error({ title: adminServiceCopy.createError });
        return;
      }

      coverMediaId = uploaded.data.id;
    }

    const result = await mutation.submit({
      fullDescription: parsed.data.fullDescription,
      name: parsed.data.name,
      shortDescription: parsed.data.shortDescription,
      ...(coverMediaId === undefined
        ? parsed.data.coverImageUrl === ""
          ? {}
          : { coverImageUrl: parsed.data.coverImageUrl }
        : { coverMediaId }),
    });

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
      submitting={mutation.status === "submitting" || uploading}
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
      <ServiceThumbnailFields
        coverImageUrl={values.coverImageUrl}
        file={thumbnailFile}
        fileError={fieldErrors.file}
        linkError={fieldErrors.coverImageUrl}
        onCoverImageUrlChange={(coverImageUrl): void => {
          setValues({ ...values, coverImageUrl });
        }}
        onFileChange={setThumbnailFile}
      />
    </AdminFormDialog>
  );
}
