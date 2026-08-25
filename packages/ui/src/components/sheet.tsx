"use client";

import { cn } from "@neatly/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactElement,
} from "react";
import { CloseIcon } from "../icons/close-icon";

export function Sheet(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
): ReactElement {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
): ReactElement {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

export function SheetClose(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
): ReactElement {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

export function SheetPortal(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>,
): ReactElement {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

export type SheetOverlayProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
>;

export function SheetOverlay({
  className,
  ...props
}: SheetOverlayProps): ReactElement {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-overlay bg-foreground/40 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 motion-safe:transition-opacity motion-safe:duration-normal motion-safe:ease-standard",
        className,
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

const sheetVariants = cva(
  "fixed z-modal flex flex-col gap-4 overflow-y-auto border-border bg-surface p-6 text-surface-foreground shadow-lg outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 max-h-dvh border-b",
        bottom: "inset-x-0 bottom-0 max-h-dvh border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-r-0 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  closeLabel?: string;
}

export function SheetContent({
  children,
  className,
  closeLabel = "Close",
  side = "right",
  ...props
}: SheetContentProps): ReactElement {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(sheetVariants({ side }), className)}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-normal ease-standard hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <CloseIcon />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;

export function SheetHeader({
  className,
  ...props
}: SheetHeaderProps): ReactElement {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pr-10 text-left", className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

export type SheetFooterProps = HTMLAttributes<HTMLDivElement>;

export function SheetFooter({
  className,
  ...props
}: SheetFooterProps): ReactElement {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

export type SheetTitleProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

export function SheetTitle({
  className,
  ...props
}: SheetTitleProps): ReactElement {
  return (
    <DialogPrimitive.Title
      className={cn("text-h3 text-foreground tracking-tight", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

export type SheetDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export function SheetDescription({
  className,
  ...props
}: SheetDescriptionProps): ReactElement {
  return (
    <DialogPrimitive.Description
      className={cn("text-body-small text-muted-foreground", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}
