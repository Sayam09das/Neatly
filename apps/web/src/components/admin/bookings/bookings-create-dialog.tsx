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
import { adminBookingCopy } from "@/config/admin-bookings";

interface BookingsCreateDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function BookingsCreateDialog({
  onOpenChange,
  open,
}: BookingsCreateDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adminBookingCopy.createTitle}</DialogTitle>
          <DialogDescription>
            {adminBookingCopy.createDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={(): void => onOpenChange(false)} type="button">
            {adminBookingCopy.closeCreateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
