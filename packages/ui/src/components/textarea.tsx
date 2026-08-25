import { cn } from "@neatly/utils";
import type { ReactElement, TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps): ReactElement {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-sm border border-input bg-background px-3 py-3 text-body text-foreground shadow-none transition-colors duration-normal ease-standard placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive",
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  );
}
