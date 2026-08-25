import { cn } from "@neatly/utils";
import type { HTMLAttributes, ReactElement } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps): ReactElement {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface text-surface-foreground shadow-sm",
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({
  className,
  ...props
}: CardHeaderProps): ReactElement {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-6", className)}
      data-slot="card-header"
      {...props}
    />
  );
}

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({
  className,
  ...props
}: CardTitleProps): ReactElement {
  return (
    <h3
      className={cn("text-h3 text-foreground tracking-tight", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps): ReactElement {
  return (
    <p
      className={cn("text-body-small text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({
  className,
  ...props
}: CardContentProps): ReactElement {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({
  className,
  ...props
}: CardFooterProps): ReactElement {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      data-slot="card-footer"
      {...props}
    />
  );
}
