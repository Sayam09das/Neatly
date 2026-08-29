"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from "@neatly/ui";
import type { FormEvent, ReactElement, ReactNode } from "react";

export const ADMIN_SELECT_CLASS =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface AdminFormDialogProps {
  cancelLabel: string;
  children: ReactNode;
  description: string;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  open: boolean;
  submitLabel: string;
  submitting: boolean;
  title: string;
}

export function AdminFormDialog({
  cancelLabel,
  children,
  description,
  error,
  onOpenChange,
  onSubmit,
  open,
  submitLabel,
  submitting,
  title,
}: AdminFormDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {error !== null ? (
            <p className="text-caption text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {children}
          <DialogFooter>
            <Button
              disabled={submitting}
              onClick={(): void => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              {cancelLabel}
            </Button>
            <Button disabled={submitting} type="submit">
              {submitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AdminConfirmDialogProps {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  submitting: boolean;
  title: string;
  variant?: "default" | "destructive";
}

export function AdminConfirmDialog({
  cancelLabel,
  confirmLabel,
  description,
  error,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  submitting,
  title,
  variant = "default",
}: AdminConfirmDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error !== null ? (
          <p className="text-caption text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <Button
            disabled={submitting}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={submitting}
            onClick={onConfirm}
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
          >
            {submitting ? "Saving…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AdminFormFieldProps {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}

export function AdminFormField({
  children,
  error,
  htmlFor,
  label,
}: AdminFormFieldProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error !== undefined ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
