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
import { AdminConfirmDialog } from "@/components/admin/admin-mutation-dialogs";
import { adminReviewCopy } from "@/config/admin-reviews";
import { hideAdminReview } from "@/lib/admin/reviews";
import { toast } from "@/lib/toast";
import type { AdminReview } from "@/types/admin-review";

interface ReviewRowActionsProps {
  onMutated?: () => void;
  review: AdminReview;
}

export function ReviewRowActions({
  onMutated,
  review,
}: ReviewRowActionsProps): ReactElement {
  const [hideOpen, setHideOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const mutationsEnabled = onMutated !== undefined;
  const canHide = mutationsEnabled && review.isActive !== false;

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
          <DropdownMenuItem
            disabled={!canHide}
            onSelect={(): void => {
              setHideOpen(true);
            }}
          >
            {adminReviewCopy.hideAction}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(): void => {
              setDeleteOpen(true);
            }}
          >
            {adminReviewCopy.deleteAction}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ReviewHideDialog
        onMutated={onMutated}
        onOpenChange={setHideOpen}
        open={hideOpen}
        review={review}
      />
      <Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adminReviewCopy.confirmDeleteTitle}</DialogTitle>
            <DialogDescription>
              {adminReviewCopy.confirmDeleteDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={(): void => setDeleteOpen(false)}
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

function ReviewHideDialog({
  onMutated,
  onOpenChange,
  open,
  review,
}: {
  onMutated?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  review: AdminReview;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(): Promise<void> {
    setSubmitting(true);
    setError(null);
    const result = await hideAdminReview(review.id);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: adminReviewCopy.hideError });
      return;
    }

    onOpenChange(false);
    onMutated?.();
    toast.success({ title: adminReviewCopy.hideSuccess });
  }

  return (
    <AdminConfirmDialog
      cancelLabel={adminReviewCopy.confirmCancel}
      confirmLabel={adminReviewCopy.confirmHideAction}
      description={adminReviewCopy.confirmHideDescription}
      error={error}
      onCancel={(): void => onOpenChange(false)}
      onConfirm={(): void => {
        void handleConfirm();
      }}
      onOpenChange={onOpenChange}
      open={open}
      submitting={submitting}
      title={adminReviewCopy.confirmHideTitle}
    />
  );
}
