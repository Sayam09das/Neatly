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
import { CUSTOMER_PATHS, customerShellCopy } from "@/config/customer";

type CustomerBrandLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  compact?: boolean;
};

export const CustomerBrandLink = forwardRef<
  HTMLAnchorElement,
  CustomerBrandLinkProps
>(function CustomerBrandLink(
  { className, compact = false, ...props }: CustomerBrandLinkProps,
  ref: Ref<HTMLAnchorElement>,
): ReactElement {
  return (
    <Link
      {...props}
      aria-label={customerShellCopy.brandHomeLabel}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-sm text-h4 text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        compact && "justify-center",
        className,
      )}
      href={CUSTOMER_PATHS.dashboard}
      ref={ref}
    >
      <BrandMark />
      {compact ? null : <span>{APP_NAME}</span>}
    </Link>
  );
});
