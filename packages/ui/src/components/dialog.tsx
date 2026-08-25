"use client";

import { cn } from "@neatly/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactElement,
} from "react";
import { CloseIcon } from "../icons/close-icon";

export function Dialog(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
): ReactElement {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
): ReactElement {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>,
): ReactElement {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose(
  props: ComponentPropsWithoutRef<typeof DialogPrimitive.Close>,
): ReactElement {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export type DialogOverlayProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
>;

export function DialogOverlay({
  className,
  ...props
}: DialogOverlayProps): ReactElement {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-overlay bg-foreground/40 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 motion-safe:transition-opacity motion-safe:duration-normal motion-safe:ease-standard",
        className,
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

export type DialogContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;

export function DialogContent({
  children,
  className,
  ...props
}: DialogContentProps): ReactElement {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 inset-x-gutter z-modal mx-auto grid w-auto max-w-content -translate-y-1/2 gap-4 rounded-lg border border-border bg-surface p-6 text-surface-foreground shadow-lg focus:outline-none",
          className,
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-normal ease-standard hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <CloseIcon />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export function DialogHeader({
  className,
  ...props
}: DialogHeaderProps): ReactElement {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pr-10 text-left", className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export function DialogFooter({
  className,
  ...props
}: DialogFooterProps): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      data-slot="dialog-footer"
      {...props}
    />
  );
}

export type DialogTitleProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

export function DialogTitle({
  className,
  ...props
}: DialogTitleProps): ReactElement {
  return (
    <DialogPrimitive.Title
      className={cn("text-h3 text-foreground tracking-tight", className)}
      data-slot="dialog-title"
      {...props}
    />
  );
}

export type DialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps): ReactElement {
  return (
    <DialogPrimitive.Description
      className={cn("text-body-small text-muted-foreground", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}
