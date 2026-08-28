"use client";

import {
  Button,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  BellIcon,
  BlogIcon,
  BookingsIcon,
  ContactsIcon,
  CustomersIcon,
  NewsletterIcon,
  OverviewIcon,
  PortfolioIcon,
  QuotesIcon,
  ServicesIcon,
  SettingsIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  TestimonialsIcon,
  UserIcon,
} from "@/components/admin/admin-icons";
import { useAdminNavigation } from "@/components/admin/admin-navigation-provider";
import { BrandMark } from "@/components/layout/navbar/brand-link";
import {
  ADMIN_MOBILE_NAV_ID,
  ADMIN_PATHS,
  ADMIN_SIDEBAR_COLLAPSED_WIDTH,
  ADMIN_SIDEBAR_EXPANDED_WIDTH,
  type AdminNavIconName,
  type AdminNavItem,
  adminNavigation,
  isAdminNavItemActive,
} from "@/config/admin-nav";
import {
  ADMIN_HOME_PATH,
  adminShellCopy,
  adminSidebarCopy,
} from "@/config/admin-ui";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const adminNavIcons: Record<AdminNavIconName, IconComponent> = {
  blog: BlogIcon,
  bookings: BookingsIcon,
  contacts: ContactsIcon,
  customers: CustomersIcon,
  newsletter: NewsletterIcon,
  notifications: BellIcon,
  overview: OverviewIcon,
  portfolio: PortfolioIcon,
  quotes: QuotesIcon,
  reviews: TestimonialsIcon,
  services: ServicesIcon,
  settings: SettingsIcon,
  testimonials: TestimonialsIcon,
};

export function AdminDesktopSidebar(): ReactElement {
  const pathname = usePathname() ?? ADMIN_HOME_PATH;
  const { collapsed, toggleCollapsed } = useAdminNavigation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.aside
      animate={{
        width: collapsed
          ? ADMIN_SIDEBAR_COLLAPSED_WIDTH
          : ADMIN_SIDEBAR_EXPANDED_WIDTH,
      }}
      className="hidden min-h-0 shrink-0 flex-col overflow-hidden overflow-x-hidden border-r border-border bg-background lg:flex"
      data-slot="admin-sidebar"
      initial={false}
      transition={getMotionTransition(prefersReducedMotion)}
    >
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        pathname={pathname}
        variant="desktop"
      />
    </motion.aside>
  );
}

export function AdminMobileSidebar(): ReactElement {
  const pathname = usePathname() ?? ADMIN_HOME_PATH;
  const { closeMobileNav } = useAdminNavigation();

  return (
    <SheetContent
      className="gap-0 overflow-hidden p-0"
      closeLabel={adminSidebarCopy.closeNavigationLabel}
      data-lenis-prevent=""
      id={ADMIN_MOBILE_NAV_ID}
      side="left"
    >
      <SheetHeader className="sr-only">
        <SheetTitle>{adminSidebarCopy.drawerTitle}</SheetTitle>
        <SheetDescription>
          {adminSidebarCopy.drawerDescription}
        </SheetDescription>
      </SheetHeader>
      <AdminSidebar
        collapsed={false}
        onNavigate={closeMobileNav}
        pathname={pathname}
        variant="drawer"
      />
    </SheetContent>
  );
}

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
  pathname: string;
  variant?: "desktop" | "drawer";
}

export function AdminSidebar({
  collapsed = false,
  onNavigate,
  onToggleCollapsed,
  pathname,
  variant = "desktop",
}: AdminSidebarProps): ReactElement {
  const isDrawer = variant === "drawer";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-border px-2 py-3",
          collapsed ? "flex-col" : "justify-between px-3",
        )}
      >
        <Link
          aria-label={adminShellCopy.brandLabel}
          className={cn(
            "inline-flex min-h-touch min-w-0 items-center gap-2 rounded-sm text-h4 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed && "justify-center",
          )}
          href={ADMIN_HOME_PATH}
          onClick={onNavigate}
        >
          <BrandMark />
          {collapsed ? null : (
            <span className="truncate">
              {adminShellCopy.brandName}
              <span className="ml-2 text-caption font-medium text-muted-foreground">
                {adminShellCopy.brandSuffix}
              </span>
            </span>
          )}
        </Link>
        {isDrawer || onToggleCollapsed === undefined ? null : (
          <Button
            aria-expanded={!collapsed}
            aria-label={
              collapsed
                ? adminSidebarCopy.expandLabel
                : adminSidebarCopy.collapseLabel
            }
            onClick={onToggleCollapsed}
            size="icon"
            variant="ghost"
          >
            {collapsed ? <SidebarExpandIcon /> : <SidebarCollapseIcon />}
          </Button>
        )}
      </div>
      <nav
        aria-label={adminShellCopy.navigationLabel}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4"
      >
        <div className="flex flex-col gap-6">
          {adminNavigation.map((group) => (
            <div key={group.id}>
              <p
                className={cn(
                  "px-3 pb-2 text-caption font-medium text-muted-foreground uppercase",
                  collapsed && "sr-only",
                )}
              >
                {group.label}
              </p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <AdminNavLink
                      collapsed={collapsed}
                      item={item}
                      onNavigate={onNavigate}
                      pathname={pathname}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div className="shrink-0 border-t border-border p-3">
        <AdminSidebarAccount collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

interface AdminNavLinkProps {
  collapsed: boolean;
  item: AdminNavItem;
  onNavigate?: () => void;
  pathname: string;
}

function AdminNavLink({
  collapsed,
  item,
  onNavigate,
  pathname,
}: AdminNavLinkProps): ReactElement {
  const isActive = isAdminNavItemActive(pathname, item.href);
  const Icon = adminNavIcons[item.icon];
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(prefersReducedMotion);
  const link = (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-touch items-center gap-3 rounded-md px-3 text-body-small font-medium motion-safe:transition-colors motion-safe:duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        collapsed && "justify-center px-0",
        isActive
          ? cn(
              "bg-accent text-accent-foreground",
              collapsed ? undefined : "border-l-2 border-primary",
            )
          : cn(
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed ? undefined : "border-l-2 border-transparent",
            ),
      )}
      href={item.href}
      onClick={onNavigate}
    >
      <Icon className="size-5 shrink-0" />
      <motion.span
        animate={{
          opacity: collapsed ? 0 : 1,
          x: collapsed ? -8 : 0,
        }}
        className={cn("truncate", collapsed && "sr-only")}
        initial={false}
        transition={transition}
      >
        {item.label}
      </motion.span>
    </Link>
  );

  if (!collapsed) {
    return link;
  }

  return <AdminSidebarTooltip label={item.label}>{link}</AdminSidebarTooltip>;
}

interface AdminSidebarTooltipProps {
  children: ReactElement;
  label: string;
}

function AdminSidebarTooltip({
  children,
  label,
}: AdminSidebarTooltipProps): ReactElement {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

interface AdminSidebarAccountProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function AdminSidebarAccount({
  collapsed,
  onNavigate,
}: AdminSidebarAccountProps): ReactElement {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        collapsed ? "flex-col" : "flex-row",
      )}
    >
      {collapsed ? (
        <AdminSidebarTooltip label={adminSidebarCopy.accountLabel}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <UserIcon className="size-4" />
            <span className="sr-only">{adminSidebarCopy.accountLabel}</span>
          </span>
        </AdminSidebarTooltip>
      ) : (
        <>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <UserIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-small font-medium text-foreground">
              {adminSidebarCopy.accountLabel}
            </p>
            <div className="mt-1 flex flex-col items-start gap-1">
              <Link
                className="inline-flex min-h-touch items-center text-caption text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={ADMIN_PATHS.settings}
                onClick={onNavigate}
              >
                {adminSidebarCopy.settingsItem}
              </Link>
              <button
                className="inline-flex min-h-touch items-center text-caption text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                type="button"
              >
                {adminSidebarCopy.logoutItem}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
