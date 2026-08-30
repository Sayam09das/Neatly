import { APP_NAME } from "@neatly/config";
import { cn } from "@neatly/utils";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactElement,
  type Ref,
} from "react";
import { BrandMark } from "@/components/layout/navbar/brand-link";
import { CLEANER_PATHS, cleanerShellCopy } from "@/config/cleaner";

type CleanerBrandLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  compact?: boolean;
};

export const CleanerBrandLink = forwardRef<
  HTMLAnchorElement,
  CleanerBrandLinkProps
>(function CleanerBrandLink(
  { className, compact = false, ...props }: CleanerBrandLinkProps,
  ref: Ref<HTMLAnchorElement>,
): ReactElement {
  return (
    <Link
      {...props}
      aria-label={cleanerShellCopy.brandHomeLabel}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-sm text-h4 text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        compact && "justify-center",
        className,
      )}
      href={CLEANER_PATHS.dashboard}
      ref={ref}
    >
      <BrandMark />
      {compact ? null : <span>{APP_NAME}</span>}
    </Link>
  );
});
