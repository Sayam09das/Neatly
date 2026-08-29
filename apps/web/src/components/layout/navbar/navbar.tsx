"use client";

import { cn } from "@neatly/utils";
import { type ReactElement, useEffect, useState } from "react";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { DesktopNav } from "@/components/layout/navbar/desktop-nav";
import { MobileNav } from "@/components/layout/navbar/mobile-nav";
import { useActivePathname } from "@/components/layout/navbar/use-active-pathname";
import { CUSTOMER_HEADER_HEIGHT_CLASS } from "@/config/customer";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

const NAVBAR_ELEVATION_SCROLL_PX = 20;
const CINEMATIC_NAV_PATHS = new Set(["/"]);

interface NavbarProps {
  session?: CustomerNavbarSession | null;
}

export function Navbar({ session = null }: NavbarProps): ReactElement {
  const pathname = useActivePathname();
  const isElevated = useNavbarElevation();
  const isCinematicOverlay = CINEMATIC_NAV_PATHS.has(pathname) && !isElevated;

  return (
    <header
      className={cn(
        "sticky top-0 z-sticky text-secondary-foreground",
        "motion-safe:transition-[background-color,border-color,box-shadow,backdrop-filter] motion-safe:duration-normal motion-safe:ease-standard",
        isElevated
          ? "border-b border-secondary-foreground/10 bg-secondary/95 shadow-sm backdrop-blur-md"
          : isCinematicOverlay
            ? "border-b border-transparent bg-transparent"
            : "border-b border-transparent bg-secondary",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-page items-center justify-between gap-3 px-gutter md:gap-4",
          CUSTOMER_HEADER_HEIGHT_CLASS,
        )}
      >
        <BrandLink />
        <DesktopNav pathname={pathname} session={session} />
        <MobileNav pathname={pathname} session={session} />
      </div>
    </header>
  );
}

function useNavbarElevation(): boolean {
  const [isElevated, setIsElevated] = useState(false);

  useEffect((): (() => void) => {
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const next = window.scrollY > NAVBAR_ELEVATION_SCROLL_PX;
      setIsElevated((current) => (current === next ? current : next));
    };

    const onScroll = (): void => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return (): void => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return isElevated;
}
