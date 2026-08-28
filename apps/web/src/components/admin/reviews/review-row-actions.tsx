"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@neatly/ui";
import { type ReactElement, useState } from "react";
import { MoreIcon } from "@/components/admin/admin-icons";
import { adminReviewCopy } from "@/config/admin-reviews";

export function ReviewRowActions(): ReactElement {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={adminReviewCopy.actionsLabel}
            size="icon"
            variant="ghost"
          >
            <MoreIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {adminReviewCopy.comingSoonHint}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            {adminReviewCopy.viewAction}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            {adminReviewCopy.editAction}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            {adminReviewCopy.hideAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(): void => {
              setConfirmOpen(true);
            }}
          >
            {adminReviewCopy.deleteAction}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adminReviewCopy.confirmDeleteTitle}</DialogTitle>
            <DialogDescription>
              {adminReviewCopy.confirmDeleteDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={(): void => setConfirmOpen(false)}
              type="button"
              variant="outline"
            >
              {adminReviewCopy.confirmCancel}
            </Button>
            <Button disabled type="button" variant="destructive">
              {adminReviewCopy.confirmDeleteAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
