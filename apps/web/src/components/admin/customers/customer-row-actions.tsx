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
import { adminCustomerCopy } from "@/config/admin-customers";

export function CustomerRowActions(): ReactElement {
  return (
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
        <DropdownMenuItem disabled>
          {adminCustomerCopy.editAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminCustomerCopy.deactivateAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminCustomerCopy.deleteAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
