import { APP_NAME } from "@neatly/config";
import { cn } from "@neatly/utils";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactElement,
  type Ref,
} from "react";

type BrandLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

export const BrandLink = forwardRef<HTMLAnchorElement, BrandLinkProps>(
  function BrandLink(
    { className, ...props }: BrandLinkProps,
    ref: Ref<HTMLAnchorElement>,
  ): ReactElement {
    return (
      <Link
        {...props}
        aria-label={`${APP_NAME} home`}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-sm text-h4 text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
          className,
        )}
        href="/"
        ref={ref}
      >
        <BrandMark />
        <span>{APP_NAME}</span>
      </Link>
    );
  },
);

export function BrandMark(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-8"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="fill-foreground" height="32" rx="8" width="32" />
      <path
        className="fill-background"
        d="M10 8h3.2l5.1 8.4V8H22v16h-3.2L13.7 15.6V24H10V8Z"
      />
    </svg>
  );
}
