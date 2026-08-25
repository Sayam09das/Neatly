import { cn } from "@neatly/utils";
import type { InputHTMLAttributes, ReactElement } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type, ...props }: InputProps): ReactElement {
  return (
    <input
      className={cn(
        "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}
