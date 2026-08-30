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
import { cleanerNavbarCopy, cleanerShellCopy } from "@/config/cleaner";
import { cleanerAccountMenuItems } from "@/config/cleaner-nav";
import {
  type CleanerNavbarIdentity,
  cleanerFirstName,
  getCleanerInitials,
} from "@/lib/cleaner/identity";

interface CleanerUserMenuProps {
  identity: CleanerNavbarIdentity;
  onLogout: () => void;
}

export function CleanerUserMenu({
  identity,
  onLogout,
}: CleanerUserMenuProps): ReactElement {
  const initials = getCleanerInitials(identity);
  const firstName = cleanerFirstName(identity.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={cleanerNavbarCopy.accountMenuLabel}
          className="min-h-touch gap-2 px-2"
          data-slot="cleaner-account-menu"
          type="button"
          variant="ghost"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-muted text-caption font-medium text-foreground"
          >
            {initials}
          </span>
          <span className="hidden max-w-36 truncate text-body-small font-medium lg:inline">
            {firstName === "" ? identity.name : firstName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>
          <span className="block truncate text-body-small text-foreground">
            {identity.name}
          </span>
          <span className="mt-0.5 block truncate text-caption font-normal text-muted-foreground">
            {cleanerNavbarCopy.roleLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cleanerAccountMenuItems.map((item) => (
          <DropdownMenuItem asChild key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(): void => {
            onLogout();
          }}
        >
          {cleanerShellCopy.logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
