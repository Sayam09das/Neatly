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
import Link from "next/link";
import type { ReactElement } from "react";
import { MoreIcon } from "@/components/admin/admin-icons";
import {
  adminContactCopy,
  getAdminContactDetailsPath,
} from "@/config/admin-contacts";
import type { AdminContact } from "@/types/admin-contact";

interface ContactRowActionsProps {
  contact: AdminContact;
}

export function ContactRowActions({
  contact,
}: ContactRowActionsProps): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminContactCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{adminContactCopy.comingSoonHint}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getAdminContactDetailsPath(contact.id)}>
            {adminContactCopy.viewAction}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminContactCopy.markReadAction}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminContactCopy.archiveAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
