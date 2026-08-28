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
import { adminCustomerCopy } from "@/config/admin-customers";

interface CustomersCreateDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CustomersCreateDialog({
  onOpenChange,
  open,
}: CustomersCreateDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adminCustomerCopy.createTitle}</DialogTitle>
          <DialogDescription>
            {adminCustomerCopy.createDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={(): void => onOpenChange(false)} type="button">
            {adminCustomerCopy.closeCreateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
