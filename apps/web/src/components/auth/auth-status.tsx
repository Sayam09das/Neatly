"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { motionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/auth/auth-icons";
import type { AuthStatusTone } from "@/types/auth-form";

interface AuthStatusProps {
  action?: ReactNode;
  live?: boolean;
  message: string;
  title: string;
  titleId?: string;
  tone: AuthStatusTone;
}

const STATUS_ICON = {
  error: AlertIcon,
  info: InfoIcon,
  loading: null,
  success: CheckIcon,
} as const;

export function AuthStatus({
  action,
  live = true,
  message,
  title,
  titleId,
  tone,
}: AuthStatusProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const Icon = STATUS_ICON[tone];
  const regionProps = live
    ? { "aria-live": "polite" as const, role: "status" as const }
    : {};

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
      initial={
        prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
      }
      transition={
        prefersReducedMotion ? { duration: 0 } : motionTransition.short
      }
      {...regionProps}
    >
      <div
        className={cn(
          "mb-4 flex size-10 items-center justify-center rounded-full",
          tone === "error" && "bg-destructive/10 text-destructive",
          tone === "success" && "bg-primary/10 text-primary",
          tone === "info" && "bg-muted text-foreground",
          tone === "loading" && "bg-muted text-muted-foreground",
        )}
      >
        {tone === "loading" ? (
          <span
            aria-hidden="true"
            className="size-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
          />
        ) : Icon === null ? null : (
          <Icon />
        )}
      </div>
      <h1 className="text-h1 tracking-tight" id={titleId}>
        {title}
      </h1>
      <p className="mt-3 max-w-prose text-body text-muted-foreground">
        {message}
      </p>
      {action === undefined ? null : (
        <div className="mt-8 flex flex-col items-start gap-4">{action}</div>
      )}
    </motion.section>
  );
}
