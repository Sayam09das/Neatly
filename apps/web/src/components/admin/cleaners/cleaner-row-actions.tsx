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
import {
  adminCleanerCopy,
  getAdminCleanerJobsPath,
  getAdminCleanerSchedulePath,
} from "@/config/admin-cleaners";
import {
  resendAdminCleanerInvitation,
  updateAdminCleaner,
  updateAdminCleanerStatus,
} from "@/lib/admin/cleaners";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { toast } from "@/lib/toast";
import { updateCleanerFormSchema } from "@/lib/validations/admin-mutation.schema";
import type { AdminCleaner } from "@/types/admin-cleaner";

interface CleanerRowActionsProps {
  cleaner: AdminCleaner;
  onMutated?: () => void;
}

export function CleanerRowActions({
  cleaner,
  onMutated,
}: CleanerRowActionsProps): ReactElement {
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const mutationsEnabled = onMutated !== undefined;
  const isInvited = cleaner.accountState === "INVITED";
  const isInactive = cleaner.accountState === "INACTIVE";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={adminCleanerCopy.actionsLabel}
            size="icon"
            variant="ghost"
          >
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setEditOpen(true);
            }}
          >
            {adminCleanerCopy.editAction}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={getAdminCleanerJobsPath(cleaner.id)}>
              {adminCleanerCopy.jobsAction}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={getAdminCleanerSchedulePath(cleaner.id)}>
              {adminCleanerCopy.scheduleAction}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={getAdminCleanerJobsPath(cleaner.id)}>
              {adminCleanerCopy.availabilityAction}
            </a>
          </DropdownMenuItem>
          {isInvited ? (
            <DropdownMenuItem
              disabled={!mutationsEnabled}
              onSelect={(): void => {
                setResendOpen(true);
              }}
            >
              {adminCleanerCopy.resendAction}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={!mutationsEnabled}
              onSelect={(): void => {
                setStatusOpen(true);
              }}
            >
              {isInactive
                ? adminCleanerCopy.activateAction
                : adminCleanerCopy.deactivateAction}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <CleanerEditDialog
        cleaner={cleaner}
        onMutated={onMutated}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
      <CleanerStatusDialog
        cleaner={cleaner}
        onMutated={onMutated}
        onOpenChange={setStatusOpen}
        open={statusOpen}
      />
      <CleanerResendDialog
        cleaner={cleaner}
        onMutated={onMutated}
        onOpenChange={setResendOpen}
        open={resendOpen}
      />
    </>
  );
}

function CleanerEditDialog({
  cleaner,
  onMutated,
  onOpenChange,
  open,
}: {
  cleaner: AdminCleaner;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const [values, setValues] = useState({
    email: cleaner.email ?? "",
    name: cleaner.name ?? "",
    phone: cleaner.phone ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      email: cleaner.email ?? "",
      name: cleaner.name ?? "",
      phone: cleaner.phone ?? "",
    });
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [cleaner.email, cleaner.name, cleaner.phone, open]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = updateCleanerFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await updateAdminCleaner(cleaner.id, parsed.data);
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminCleanerCopy.editError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminCleanerCopy.editSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminCleanerCopy.cancelLabel}
      description={adminCleanerCopy.editDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminCleanerCopy.saveLabel}
      submitting={submitting}
      title={adminCleanerCopy.editTitle}
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

function CleanerStatusDialog({
  cleaner,
  onMutated,
  onOpenChange,
  open,
}: {
  cleaner: AdminCleaner;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextStatus =
    cleaner.accountState === "INACTIVE" ? "ACTIVE" : "INACTIVE";

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await updateAdminCleanerStatus(cleaner.id, nextStatus);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminCleanerCopy.deactivateError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({
      title:
        nextStatus === "INACTIVE"
          ? adminCleanerCopy.deactivateSuccess
          : adminCleanerCopy.reactivateSuccess,
    });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminCleanerCopy.cancelLabel}
      confirmLabel={
        nextStatus === "INACTIVE"
          ? adminCleanerCopy.confirmDeactivateAction
          : adminCleanerCopy.activateAction
      }
      description={adminCleanerCopy.confirmDeactivateDescription}
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={
        nextStatus === "INACTIVE"
          ? adminCleanerCopy.confirmDeactivateTitle
          : adminCleanerCopy.activateAction
      }
    />
  );
}

function CleanerResendDialog({
  cleaner,
  onMutated,
  onOpenChange,
  open,
}: {
  cleaner: AdminCleaner;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await resendAdminCleanerInvitation(cleaner.id);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminCleanerCopy.resendError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({
      title: result.data.invitationSent
        ? adminCleanerCopy.resendSuccess
        : adminCleanerCopy.createSuccessEmailFailed,
    });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminCleanerCopy.cancelLabel}
      confirmLabel={adminCleanerCopy.resendAction}
      description="Send a new invitation email. The previous invitation link will stop working."
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={adminCleanerCopy.resendAction}
    />
  );
}
