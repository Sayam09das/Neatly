import { cn } from "@neatly/utils";
import type { HTMLAttributes, ReactElement } from "react";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps): ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
