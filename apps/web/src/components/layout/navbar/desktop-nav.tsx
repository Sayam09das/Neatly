import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import { isNavItemActive } from "@/components/layout/navbar/is-nav-item-active";
import {
  getPublishedPhone,
  landingNavLinks,
  navbarCta,
} from "@/config/landing";

interface DesktopNavProps {
  pathname: string;
}

export function DesktopNav({ pathname }: DesktopNavProps): ReactElement {
  const phone = getPublishedPhone();

  return (
    <>
      <nav
        aria-label="Primary"
        className="hidden flex-1 justify-center lg:flex"
      >
        <ul className="flex items-center justify-center gap-6">
          {landingNavLinks.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-touch items-center text-body-small font-medium transition-colors duration-normal ease-standard",
                    "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                    isActive
                      ? "text-primary underline decoration-primary underline-offset-8"
                      : "text-secondary-foreground/80 hover:text-secondary-foreground",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="hidden shrink-0 items-center gap-4 lg:flex">
        {phone === null ? null : (
          <a
            className="inline-flex min-h-touch items-center gap-2 rounded-sm text-body-small text-secondary-foreground/80 transition-colors duration-normal ease-standard hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            href={`tel:${phone}`}
          >
            <PhoneIcon />
            <span>{phone}</span>
          </a>
        )}
        <Button
          asChild
          className="uppercase focus-visible:ring-offset-secondary"
          size="sm"
        >
          <Link href={navbarCta.href}>
            {navbarCta.label}
            <ArrowUpRightIcon />
          </Link>
        </Button>
      </div>
    </>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.2 2.5h2.1l.9 2.3-1.3 1.3a9 9 0 0 0 4 4l1.3-1.3 2.3.9v2.1c0 .6-.5 1.1-1.1 1.1C6.4 13 3 9.6 3 5.6c0-.6.5-1.1 1.1-1.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
