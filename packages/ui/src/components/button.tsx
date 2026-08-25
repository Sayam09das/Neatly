"use client";

import { cn } from "@neatly/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-button font-semibold transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "rounded-sm text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-touch px-5 py-2.5",
        sm: "min-h-9 px-3.5 text-body-small",
        lg: "min-h-12 px-8",
        icon: "size-11 min-h-touch min-w-touch p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

export function Button({
  asChild = false,
  children,
  className,
  disabled,
  isLoading = false,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps): ReactElement {
  const isDisabled = disabled === true || isLoading;
  const classes = cn(buttonVariants({ size, variant }), className);

  if (asChild) {
    return (
      <Slot
        aria-busy={isLoading || undefined}
        className={classes}
        data-slot="button"
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      aria-busy={isLoading || undefined}
      className={classes}
      data-slot="button"
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
