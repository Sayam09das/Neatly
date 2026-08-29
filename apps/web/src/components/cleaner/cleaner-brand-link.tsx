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
import { CLEANER_HOME_PATH, cleanerShellCopy } from "@/config/cleaner";

type CleanerBrandLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
>;

export const CleanerBrandLink = forwardRef<
  HTMLAnchorElement,
  CleanerBrandLinkProps
>(function CleanerBrandLink(
  { className, ...props }: CleanerBrandLinkProps,
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
        className,
      )}
      href={CLEANER_HOME_PATH}
      ref={ref}
    >
      <BrandMark />
      <span>{APP_NAME}</span>
    </Link>
  );
});
