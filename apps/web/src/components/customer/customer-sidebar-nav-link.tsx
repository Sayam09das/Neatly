"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactElement,
  type Ref,
} from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { customerNavIcons } from "@/components/customer/customer-icons";
import type { CustomerNavItem } from "@/config/customer-nav";

type CustomerSidebarNavLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  collapsed?: boolean;
  isActive: boolean;
  item: CustomerNavItem;
  onNavigate?: () => void;
};

export const CustomerSidebarNavLink = forwardRef<
  HTMLAnchorElement,
  CustomerSidebarNavLinkProps
>(function CustomerSidebarNavLink(
  {
    collapsed = false,
    isActive,
    item,
    onClick,
    onNavigate,
    ...props
  }: CustomerSidebarNavLinkProps,
  ref: Ref<HTMLAnchorElement>,
): ReactElement {
  const Icon = customerNavIcons[item.icon];
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(prefersReducedMotion);
  const link = (
    <Link
      {...props}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex min-h-touch items-center gap-3 rounded-md px-3 text-body-small font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-safe:transition-colors motion-safe:duration-fast",
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
        props.className,
      )}
      href={item.href}
      onClick={(event): void => {
        onNavigate?.();
        onClick?.(event);
      }}
      ref={ref}
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

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
});
