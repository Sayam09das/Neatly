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
import { adminCustomerCopy } from "@/config/admin-customers";
import {
  updateAdminCustomer,
  updateAdminCustomerStatus,
} from "@/lib/admin/customers";
import { collectZodFieldErrors } from "@/lib/admin/mutation-input";
import { toast } from "@/lib/toast";
import { updateCustomerFormSchema } from "@/lib/validations/admin-mutation.schema";
import type { AdminCustomer } from "@/types/admin-customer";

interface CustomerRowActionsProps {
  customer: AdminCustomer;
  onMutated?: () => void;
}

export function CustomerRowActions({
  customer,
  onMutated,
}: CustomerRowActionsProps): ReactElement {
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const mutationsEnabled = onMutated !== undefined;
  const isInactive = customer.statusLabel === "Inactive";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={adminCustomerCopy.actionsLabel}
            size="icon"
            variant="ghost"
          >
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {adminCustomerCopy.comingSoonHint}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            {adminCustomerCopy.viewAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setEditOpen(true);
            }}
          >
            {adminCustomerCopy.editAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!mutationsEnabled}
            onSelect={(): void => {
              setStatusOpen(true);
            }}
          >
            {isInactive
              ? adminCustomerCopy.activateAction
              : adminCustomerCopy.deactivateAction}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            {adminCustomerCopy.deleteAction}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomerEditDialog
        customer={customer}
        onMutated={onMutated}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
      <AdminCustomerStatusDialog
        customer={customer}
        onMutated={onMutated}
        onOpenChange={setStatusOpen}
        open={statusOpen}
      />
    </>
  );
}

function CustomerEditDialog({
  customer,
  onMutated,
  onOpenChange,
  open,
}: {
  customer: AdminCustomer;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();
  const [values, setValues] = useState({
    address: customer.address ?? "",
    email: customer.email ?? "",
    name: customer.name ?? "",
    phone: customer.phone ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      address: customer.address ?? "",
      email: customer.email ?? "",
      name: customer.name ?? "",
      phone: customer.phone ?? "",
    });
    setFieldErrors({});
    setError(null);
    setSubmitting(false);
  }, [customer.address, customer.email, customer.name, customer.phone, open]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const parsed = updateCustomerFormSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(collectZodFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await updateAdminCustomer(customer.id, parsed.data);
    setSubmitting(false);

    if (!result.ok) {
      setFieldErrors(result.fields);
      setError(result.message);
      toast.error({ title: adminCustomerCopy.editError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminCustomerCopy.editSuccess });
  }

  return (
    <AdminFormDialog
      cancelLabel={adminCustomerCopy.cancelLabel}
      description={adminCustomerCopy.editDescription}
      error={error}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel={adminCustomerCopy.saveLabel}
      submitting={submitting}
      title={adminCustomerCopy.editTitle}
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

function AdminCustomerStatusDialog({
  customer,
  onMutated,
  onOpenChange,
  open,
}: {
  customer: AdminCustomer;
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextStatus =
    customer.statusLabel === "Inactive" ? "ACTIVE" : "INACTIVE";

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await updateAdminCustomerStatus(customer.id, nextStatus);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminCustomerCopy.deactivateError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminCustomerCopy.deactivateSuccess });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminCustomerCopy.cancelLabel}
      confirmLabel={
        nextStatus === "INACTIVE"
          ? adminCustomerCopy.confirmDeactivateAction
          : adminCustomerCopy.activateAction
      }
      description={adminCustomerCopy.confirmDeactivateDescription}
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={adminCustomerCopy.confirmDeactivateTitle}
    />
  );
}
