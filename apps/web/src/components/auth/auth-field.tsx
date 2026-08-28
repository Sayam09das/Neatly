"use client";

import { Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { motionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";

const ERROR_OFFSET_PX = 4;

interface AuthFieldErrorProps {
  error: string | undefined;
  id: string;
}

export function AuthFieldError({
  error,
  id,
}: AuthFieldErrorProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-5">
      <AnimatePresence>
        {error === undefined ? null : (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="text-caption text-destructive"
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: ERROR_OFFSET_PX }
            }
            id={id}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: ERROR_OFFSET_PX }
            }
            key={error}
            transition={
              prefersReducedMotion ? { duration: 0 } : motionTransition.short
            }
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AuthFieldProps {
  children: ReactNode;
  error: string | undefined;
  errorId: string;
  hideLabel?: boolean;
  htmlFor: string;
  label: string;
  labelAction?: ReactNode;
}

export function AuthField({
  children,
  error,
  errorId,
  hideLabel = false,
  htmlFor,
  label,
  labelAction,
}: AuthFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {hideLabel ? (
        <Label className="sr-only" htmlFor={htmlFor}>
          {label}
        </Label>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={htmlFor}>{label}</Label>
          {labelAction}
        </div>
      )}
      {children}
      <AuthFieldError error={error} id={errorId} />
    </div>
  );
}

interface AuthControlProps {
  children: ReactNode;
  leading?: ReactNode;
}

export function AuthControl({
  children,
  leading,
}: AuthControlProps): ReactElement {
  return (
    <div className="relative">
      {leading === undefined ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        >
          {leading}
        </span>
      )}
      {children}
    </div>
  );
}

interface AuthFormBannerProps {
  id: string;
  message: string | null;
}

export function AuthFormBanner({
  id,
  message,
}: AuthFormBannerProps): ReactElement | null {
  if (message === null) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-body-small text-destructive"
      id={id}
      role="alert"
    >
      {message}
    </p>
  );
}

interface AuthSwitchPromptProps {
  action: string;
  href: string;
  prompt: string;
}

export function AuthSwitchPrompt({
  action,
  href,
  prompt,
}: AuthSwitchPromptProps): ReactElement {
  return (
    <p className="text-center text-body-small text-muted-foreground">
      {prompt} <AuthTextLink href={href}>{action}</AuthTextLink>
    </p>
  );
}

interface AuthTextLinkProps {
  children: string;
  href: string;
}

export function AuthTextLink({
  children,
  href,
}: AuthTextLinkProps): ReactElement {
  return (
    <Link
      className={cn(
        "font-medium text-primary underline-offset-4",
        "transition-colors duration-normal ease-standard hover:underline",
        "focus-visible:rounded-sm focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
