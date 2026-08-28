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
import { adminServiceCopy } from "@/config/admin-services";

interface ServicesCreateDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function ServicesCreateDialog({
  onOpenChange,
  open,
}: ServicesCreateDialogProps): ReactElement {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{adminServiceCopy.createTitle}</DialogTitle>
          <DialogDescription>
            {adminServiceCopy.createDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={(): void => onOpenChange(false)} type="button">
            {adminServiceCopy.closeCreateLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
