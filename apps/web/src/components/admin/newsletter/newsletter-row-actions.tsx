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
  adminNewsletterCopy,
  getAdminNewsletterDetailsPath,
} from "@/config/admin-newsletter";
import type { AdminNewsletterSubscriber } from "@/types/admin-newsletter";

interface NewsletterRowActionsProps {
  subscriber: AdminNewsletterSubscriber;
}

export function NewsletterRowActions({
  subscriber,
}: NewsletterRowActionsProps): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminNewsletterCopy.actionsLabel}
          size="icon"
          variant="ghost"
        >
          <MoreIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {adminNewsletterCopy.comingSoonHint}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getAdminNewsletterDetailsPath(subscriber.id)}>
            {adminNewsletterCopy.viewAction}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {adminNewsletterCopy.exportAction}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
