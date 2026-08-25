"use client";

import { cn } from "@neatly/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export function Label({ className, ...props }: LabelProps): ReactElement {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-label font-medium text-foreground uppercase tracking-wide peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      data-slot="label"
      {...props}
    />
  );
}
