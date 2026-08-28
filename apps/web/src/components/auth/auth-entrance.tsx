"use client";

import { cn } from "@neatly/utils";
import type { ReactElement, ReactNode } from "react";

interface AuthEntranceProps {
  children: ReactNode;
}

export function AuthEntrance({ children }: AuthEntranceProps): ReactElement {
  return <div className="w-full">{children}</div>;
}

interface AuthEntranceItemProps {
  children: ReactNode;
  className?: string;
  delay?: "none" | "short" | "medium";
}

const delayClassName = {
  medium: "motion-safe:delay-200",
  none: "motion-safe:delay-0",
  short: "motion-safe:delay-100",
} as const;

export function AuthEntranceItem({
  children,
  className,
  delay = "none",
}: AuthEntranceItemProps): ReactElement {
  return (
    <div
      className={cn(
        "motion-safe:transition-transform motion-safe:duration-slow",
        "motion-safe:ease-enter motion-safe:starting:translate-y-3",
        delayClassName[delay],
        className,
      )}
    >
      {children}
    </div>
  );
}
