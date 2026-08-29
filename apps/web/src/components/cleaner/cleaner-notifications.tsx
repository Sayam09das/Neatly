"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@neatly/ui";
import type { ReactElement } from "react";
import { CleanerBellIcon } from "@/components/cleaner/cleaner-icons";
import { cleanerNavbarCopy } from "@/config/cleaner";

export function CleanerNotificationsTrigger(): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={cleanerNavbarCopy.notificationsLabel}
          data-slot="cleaner-notifications"
          size="icon"
          type="button"
          variant="ghost"
        >
          <CleanerBellIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuLabel>
          {cleanerNavbarCopy.notificationsLabel}
        </DropdownMenuLabel>
        <p className="px-2 py-3 text-body-small text-muted-foreground">
          {cleanerNavbarCopy.notificationsEmpty}
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
