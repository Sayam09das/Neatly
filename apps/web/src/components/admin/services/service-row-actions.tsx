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
import { adminServiceCopy } from "@/config/admin-services";

export function ServiceRowActions(): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminServiceCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{adminServiceCopy.comingSoonHint}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          {adminServiceCopy.viewAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminServiceCopy.editAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminServiceCopy.activateAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminServiceCopy.deactivateAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminServiceCopy.deleteAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
