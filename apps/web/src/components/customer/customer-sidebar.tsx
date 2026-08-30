"use client";

import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { CustomerBrandLink } from "@/components/customer/customer-brand-link";
import {
  CustomerLogoutIcon,
  CustomerSidebarCollapseIcon,
  CustomerSidebarExpandIcon,
} from "@/components/customer/customer-icons";
import { useCustomerNavigation } from "@/components/customer/customer-navigation-provider";
import { CustomerSidebarNavLink } from "@/components/customer/customer-sidebar-nav-link";
import {
  CUSTOMER_SIDEBAR_COLLAPSED_WIDTH,
  CUSTOMER_SIDEBAR_EXPANDED_WIDTH,
  customerNavbarCopy,
  customerShellCopy,
  customerSidebarCopy,
} from "@/config/customer";
import {
  getVisibleCustomerNavGroups,
  isCustomerNavItemActive,
} from "@/config/customer-nav";
import {
  type CustomerNavbarIdentity,
  getCustomerInitials,
} from "@/lib/customer/navbar";

interface CustomerDesktopSidebarProps {
  identity: CustomerNavbarIdentity;
  onLogout: () => void;
  pathname: string;
}

export function CustomerDesktopSidebar({
  identity,
  onLogout,
  pathname,
}: CustomerDesktopSidebarProps): ReactElement {
  const { collapsed, toggleCollapsed } = useCustomerNavigation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.aside
      animate={{
        width: collapsed
          ? CUSTOMER_SIDEBAR_COLLAPSED_WIDTH
          : CUSTOMER_SIDEBAR_EXPANDED_WIDTH,
      }}
      className="hidden min-h-0 shrink-0 flex-col overflow-hidden overflow-x-hidden border-r border-border bg-background lg:flex"
      data-slot="customer-app-sidebar"
      initial={false}
      transition={getMotionTransition(prefersReducedMotion)}
    >
      <CustomerSidebar
        collapsed={collapsed}
        identity={identity}
        onLogout={onLogout}
        onToggleCollapsed={toggleCollapsed}
        pathname={pathname}
        variant="desktop"
      />
    </motion.aside>
  );
}

interface CustomerSidebarProps {
  collapsed?: boolean;
  identity: CustomerNavbarIdentity;
  onLogout: () => void;
  onToggleCollapsed?: () => void;
  pathname: string;
  variant?: "desktop" | "drawer";
}

export function CustomerSidebar({
  collapsed = false,
  identity,
  onLogout,
  onToggleCollapsed,
  pathname,
  variant = "desktop",
}: CustomerSidebarProps): ReactElement {
  const groups = getVisibleCustomerNavGroups();
  const isDrawer = variant === "drawer";

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-border px-2 py-3",
          collapsed ? "flex-col" : "justify-between px-3",
        )}
      >
        <CustomerBrandLink compact={collapsed} />
        {isDrawer || onToggleCollapsed === undefined ? null : (
          <Button
            aria-expanded={!collapsed}
            aria-label={
              collapsed
                ? customerSidebarCopy.expandLabel
                : customerSidebarCopy.collapseLabel
            }
            onClick={onToggleCollapsed}
            size="icon"
            type="button"
            variant="ghost"
          >
            {collapsed ? (
              <CustomerSidebarExpandIcon />
            ) : (
              <CustomerSidebarCollapseIcon />
            )}
          </Button>
        )}
      </div>
      {collapsed ? null : (
        <p className="px-5 pt-3 text-caption text-muted-foreground">
          {customerShellCopy.workspaceLabel}
        </p>
      )}
      <nav
        aria-label={customerNavbarCopy.primaryNavigationLabel}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4"
      >
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.id}>
              <p
                className={cn(
                  "px-3 pb-2 text-caption font-medium text-muted-foreground uppercase tracking-wide",
                  collapsed && "sr-only",
                )}
              >
                {group.label}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <CustomerSidebarNavLink
                      collapsed={collapsed}
                      isActive={isCustomerNavItemActive(pathname, item.href)}
                      item={item}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div className="shrink-0 border-t border-border p-3">
        <CustomerSidebarAccount
          collapsed={collapsed}
          identity={identity}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}

interface CustomerSidebarAccountProps {
  collapsed: boolean;
  identity: CustomerNavbarIdentity;
  onLogout: () => void;
}

function CustomerSidebarAccount({
  collapsed,
  identity,
  onLogout,
}: CustomerSidebarAccountProps): ReactElement {
  const logoutButton = (
    <button
      className={cn(
        "inline-flex min-h-touch items-center gap-3 rounded-md px-3 text-body-small font-medium",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        collapsed && "justify-center px-0",
      )}
      onClick={onLogout}
      type="button"
    >
      <CustomerLogoutIcon className="size-5 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>
        {customerShellCopy.logoutLabel}
      </span>
    </button>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-caption font-medium text-foreground">
              {getCustomerInitials(identity)}
              <span className="sr-only">
                {identity.name === ""
                  ? customerNavbarCopy.roleLabel
                  : identity.name}
              </span>
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            {identity.name === ""
              ? customerNavbarCopy.roleLabel
              : identity.name}
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{logoutButton}</TooltipTrigger>
          <TooltipContent side="right">
            {customerShellCopy.logoutLabel}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="min-w-0 px-1">
        <p className="truncate text-body-small font-medium text-foreground">
          {identity.name}
        </p>
        <p className="truncate text-caption text-muted-foreground">
          {customerNavbarCopy.roleLabel}
        </p>
      </div>
      <Separator />
      {logoutButton}
    </div>
  );
}
