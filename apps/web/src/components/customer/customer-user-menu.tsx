"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import { customerNavbarCopy, customerShellCopy } from "@/config/customer";
import { customerAccountMenuItems } from "@/config/customer-nav";
import type { CustomerNavbarIdentity } from "@/lib/customer/navbar";
import { getCustomerInitials } from "@/lib/customer/navbar";

export type CustomerUserMenuTone = "account" | "public";

interface CustomerUserMenuProps {
  identity: CustomerNavbarIdentity;
  onLogout: () => void;
  showAccountLinks: boolean;
  showAdmin: boolean;
  tone?: CustomerUserMenuTone;
}

export function CustomerUserMenu({
  identity,
  onLogout,
  showAccountLinks,
  showAdmin,
  tone = "account",
}: CustomerUserMenuProps): ReactElement {
  const initials = getCustomerInitials(identity);
  const isPublic = tone === "public";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={customerNavbarCopy.accountMenuLabel}
          className={cn(
            "min-h-touch gap-2 px-2",
            isPublic &&
              "text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary",
          )}
          data-slot="customer-account-menu"
          type="button"
          variant="ghost"
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-caption font-medium",
              isPublic
                ? "bg-secondary-foreground/15 text-secondary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {initials}
          </span>
          <span className="hidden max-w-36 truncate text-body-small font-medium lg:inline">
            {identity.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>
          <span className="block truncate text-body-small text-foreground">
            {identity.name}
          </span>
          <span className="mt-0.5 block truncate text-caption font-normal text-muted-foreground">
            {identity.email}
          </span>
        </DropdownMenuLabel>
        {showAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={AUTH_ADMIN_HOME_PATH}>
                  {customerNavbarCopy.adminLabel}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : null}
        {showAccountLinks ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {customerAccountMenuItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(): void => {
            onLogout();
          }}
        >
          {customerShellCopy.logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
