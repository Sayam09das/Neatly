"use client";

import { cn } from "@neatly/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

const TOOLTIP_DELAY_MS = 300;

export function TooltipProvider({
  delayDuration = TOOLTIP_DELAY_MS,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>): ReactElement {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export function Tooltip(
  props: ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
): ReactElement {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

export function TooltipTrigger(
  props: ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>,
): ReactElement {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export type TooltipContentProps = ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>;

export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: TooltipContentProps): ReactElement {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          "z-tooltip max-w-xs rounded-md border border-border bg-surface px-3 py-1.5 text-body-small text-surface-foreground shadow-md pointer-events-none",
          className,
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
