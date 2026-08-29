"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@neatly/ui";
import type { ReactElement } from "react";

interface CleanerConfirmDialogProps {
  busy: boolean;
  busyLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export function CleanerConfirmDialog({
  busy,
  busyLabel,
  cancelLabel,
  confirmLabel,
  description,
  error,
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
}: CleanerConfirmDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error === null ? null : (
          <p className="text-caption text-destructive" role="alert">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button
            disabled={busy}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            {cancelLabel}
          </Button>
          <Button disabled={busy} onClick={onConfirm} type="button">
            {busy ? busyLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
