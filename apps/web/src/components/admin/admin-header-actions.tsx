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
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { BellIcon, MenuIcon, UserIcon } from "@/components/admin/admin-icons";
import { useOptionalAdminNavigation } from "@/components/admin/admin-navigation-provider";
import { ADMIN_MOBILE_NAV_ID, ADMIN_PATHS } from "@/config/admin-nav";
import { adminHeaderCopy } from "@/config/admin-ui";

interface AdminHeaderActionsProps {
  actions?: ReactNode;
}

export function AdminHeaderActions({
  actions,
}: AdminHeaderActionsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(prefersReducedMotion);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex shrink-0 items-center justify-end gap-1 sm:gap-2"
      data-slot="admin-header-actions"
      initial={{ opacity: 0 }}
      transition={transition}
    >
      {actions}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon" variant="ghost">
            <Link
              aria-label={adminHeaderCopy.notificationsLabel}
              data-slot="admin-notifications"
              href={ADMIN_PATHS.notifications}
            >
              <BellIcon />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {adminHeaderCopy.notificationsLabel}
        </TooltipContent>
      </Tooltip>
      <AdminAccountMenu />
    </motion.div>
  );
}

interface AdminMobileNavTriggerProps {
  onOpenNavigation?: () => void;
}

export function AdminMobileNavTrigger({
  onOpenNavigation,
}: AdminMobileNavTriggerProps): ReactElement {
  const navigation = useOptionalAdminNavigation();

  const trigger = (
    <Button
      aria-controls={navigation === null ? undefined : ADMIN_MOBILE_NAV_ID}
      aria-expanded={navigation?.isMobileNavOpen}
      aria-label={adminHeaderCopy.openNavigationLabel}
      className="lg:hidden"
      data-slot="admin-mobile-nav-trigger"
      onClick={onOpenNavigation}
      size="icon"
      variant="ghost"
    >
      <MenuIcon />
    </Button>
  );

  if (navigation === null) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="bottom">
          {adminHeaderCopy.openNavigationLabel}
        </TooltipContent>
      </Tooltip>
    );
  }

  return <SheetTrigger asChild>{trigger}</SheetTrigger>;
}

function AdminAccountMenu(): ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={adminHeaderCopy.accountMenuLabel}
          className="gap-2 px-2"
          data-slot="admin-account-menu"
          variant="ghost"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground">
            <UserIcon className="size-4" />
          </span>
          <span className="hidden text-body-small font-medium lg:inline">
            {adminHeaderCopy.profileLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel>{adminHeaderCopy.profileLabel}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`${ADMIN_PATHS.settings}?section=profile`}>
              {adminHeaderCopy.profileItem}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ADMIN_PATHS.settings}>
              {adminHeaderCopy.settingsItem}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{adminHeaderCopy.logoutItem}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
