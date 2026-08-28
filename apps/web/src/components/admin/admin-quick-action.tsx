"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { ArrowUpRightIcon } from "@/components/admin/admin-icons";

const QUICK_ACTION_HOVER_LIFT_PX = 2;

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface AdminQuickActionProps {
  description: string;
  href: string;
  icon: IconComponent;
  title: string;
}

export function AdminQuickAction({
  description,
  href,
  icon: Icon,
  title,
}: AdminQuickActionProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(prefersReducedMotion);

  return (
    <motion.div
      className="min-w-0"
      transition={transition}
      whileHover={
        prefersReducedMotion ? undefined : { y: -QUICK_ACTION_HOVER_LIFT_PX }
      }
    >
      <Link
        className={cn(
          "group flex min-h-touch items-start gap-3 rounded-lg border border-border bg-background p-4",
          "motion-safe:transition-colors motion-safe:duration-fast",
          "hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        data-slot="admin-quick-action"
        href={href}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="text-body-small font-medium text-foreground">
              {title}
            </span>
            <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
          </span>
          <span className="mt-1 block text-caption text-muted-foreground">
            {description}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
