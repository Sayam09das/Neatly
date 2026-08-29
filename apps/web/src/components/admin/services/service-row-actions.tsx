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
  AdminConfirmDialog,
  AdminFormDialog,
  AdminFormField,
} from "@/components/admin/admin-mutation-dialogs";
import { adminServiceCopy } from "@/config/admin-services";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { archiveAdminService, updateAdminService } from "@/lib/admin/services";
import { toast } from "@/lib/toast";
import { updateServiceFormSchema } from "@/lib/validations/admin-mutation.schema";
import type { AdminService } from "@/types/admin-service";

interface ServiceRowActionsProps {
  onMutated?: () => void;
  service: AdminService;
}

export function ServiceRowActions({
  onMutated,
  service,
}: ServiceRowActionsProps): ReactElement {
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const mutationsEnabled = onMutated !== undefined;
  const canArchive = mutationsEnabled && service.isActive === true;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={adminServiceCopy.actionsLabel}
            size="icon"
            variant="ghost"
          >
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {adminServiceCopy.comingSoonHint}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            {adminServiceCopy.viewAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setEditOpen(true);
            }}
          >
            {adminServiceCopy.editAction}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            {adminServiceCopy.activateAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!canArchive}
            onSelect={(): void => {
              setArchiveOpen(true);
            }}
          >
            {adminServiceCopy.deactivateAction}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            {adminServiceCopy.deleteAction}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ServiceEditDialog
        onMutated={onMutated}
        onOpenChange={setEditOpen}
        open={editOpen}
        service={service}
      />
      <ServiceArchiveDialog
        onMutated={onMutated}
        onOpenChange={setArchiveOpen}
        open={archiveOpen}
        service={service}
      />
    </>
  );
}

function ServiceEditDialog({
  onMutated,
  onOpenChange,
  open,
  service,
}: {
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  service: AdminService;
}): ReactElement {
  const nameId = useId();
  const shortId = useId();
  const fullId = useId();
  const [values, setValues] = useState({
    fullDescription: service.fullDescription ?? "",
    name: service.name ?? "",
    shortDescription: service.shortDescription ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      fullDescription: service.fullDescription ?? "",
      name: service.name ?? "",
      shortDescription: service.shortDescription ?? "",
    });
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [open, service.fullDescription, service.name, service.shortDescription]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = updateServiceFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await updateAdminService(service.id, parsed.data);
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminServiceCopy.editError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminServiceCopy.editSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminServiceCopy.cancelLabel}
      description={adminServiceCopy.editDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminServiceCopy.saveLabel}
      submitting={submitting}
      title={adminServiceCopy.editTitle}
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

function ServiceArchiveDialog({
  onMutated,
  onOpenChange,
  open,
  service,
}: {
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  service: AdminService;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await archiveAdminService(service.id);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminServiceCopy.archiveError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminServiceCopy.archiveSuccess });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminServiceCopy.cancelLabel}
      confirmLabel={adminServiceCopy.confirmArchiveAction}
      description={adminServiceCopy.confirmArchiveDescription}
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={adminServiceCopy.confirmArchiveTitle}
    />
  );
}
