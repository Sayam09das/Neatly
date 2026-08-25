"use client";

import { cn } from "@neatly/utils";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ReactElement } from "react";

export function DropdownMenu(
  props: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>,
): ReactElement {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

export function DropdownMenuTrigger(
  props: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>,
): ReactElement {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

export function DropdownMenuGroup(
  props: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>,
): ReactElement {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: DropdownMenuContentProps): ReactElement {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          "z-dropdown min-w-40 overflow-hidden rounded-md border border-border bg-surface p-1 text-surface-foreground shadow-md",
          className,
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>;

export function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuItemProps): ReactElement {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex min-h-touch cursor-default items-center rounded-sm px-3 py-2 text-body-small outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
}

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;

export function DropdownMenuLabel({
  className,
  ...props
}: DropdownMenuLabelProps): ReactElement {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-3 py-2 text-label text-muted-foreground uppercase",
        className,
      )}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps): ReactElement {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}
