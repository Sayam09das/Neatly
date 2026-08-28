"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@neatly/ui";
import type { ReactElement } from "react";
import { MoreIcon } from "@/components/admin/admin-icons";
import { adminBookingCopy } from "@/config/admin-bookings";

export function BookingRowActions(): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminBookingCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{adminBookingCopy.comingSoonHint}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          {adminBookingCopy.viewDetailsAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminBookingCopy.editAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminBookingCopy.assignCleanerAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminBookingCopy.changeStatusAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminBookingCopy.cancelAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
