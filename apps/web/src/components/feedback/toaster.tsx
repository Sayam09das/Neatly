"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactElement, useEffect, useState } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  dismissToast,
  subscribeToToasts,
  TOAST_DURATION_MS,
  type ToastRecord,
  type ToastVariant,
} from "@/lib/toast";

const toastCopy = {
  closeLabel: "Dismiss notification",
} as const;

const liveRole: Record<ToastVariant, "alert" | "status"> = {
  error: "alert",
  info: "status",
  success: "status",
  warning: "status",
};

export function Toaster(): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const [toasts, setToasts] = useState<readonly ToastRecord[]>([]);

  useEffect((): (() => void) => {
    return subscribeToToasts(setToasts);
  }, []);

  useEffect((): (() => void) => {
    const timers = toasts.map((toastRecord) => {
      const duration =
        toastRecord.durationMs ?? TOAST_DURATION_MS[toastRecord.variant];

      return window.setTimeout((): void => {
        dismissToast(toastRecord.id);
      }, duration);
    });

    return (): void => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [toasts]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
      data-slot="toaster"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toastRecord) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto w-full max-w-sm rounded-lg border border-border bg-background p-4 text-foreground shadow-sm"
            data-slot="toast"
            data-variant={toastRecord.variant}
            exit={{
              opacity: prefersReducedMotion ? 1 : 0,
              y: prefersReducedMotion ? 0 : 8,
            }}
            initial={{
              opacity: prefersReducedMotion ? 1 : 0,
              y: prefersReducedMotion ? 0 : 8,
            }}
            key={toastRecord.id}
            role={liveRole[toastRecord.variant]}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-body-small font-medium">
                  {toastRecord.title}
                </p>
                {toastRecord.description !== undefined ? (
                  <p className="mt-1 text-caption text-muted-foreground">
                    {toastRecord.description}
                  </p>
                ) : null}
              </div>
              <Button
                aria-label={toastCopy.closeLabel}
                onClick={(): void => {
                  dismissToast(toastRecord.id);
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <span aria-hidden="true">×</span>
              </Button>
            </div>
            {toastRecord.action !== undefined ? (
              <Button
                className="mt-3"
                onClick={(): void => {
                  toastRecord.action?.onClick();
                  dismissToast(toastRecord.id);
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                {toastRecord.action.label}
              </Button>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
