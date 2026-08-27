"use client";

import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingFeaturedWork } from "@/config/landing";
import { useWorkGalleryScroll } from "./use-work-gallery-scroll";
import { WORK_GALLERY_LABEL } from "./work-animation";
import { WorkGalleryNav } from "./work-gallery-nav";
import { WorkTile } from "./work-tile";

type WorkTileItem = (typeof landingFeaturedWork.tiles)[number];

interface WorkGalleryProps {
  tiles: ReadonlyArray<WorkTileItem>;
}

export function WorkGallery({ tiles }: WorkGalleryProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const {
    activeIndex,
    canNext,
    canPrevious,
    goToNext,
    goToPrevious,
    viewportRef,
  } = useWorkGalleryScroll();

  const scrollBehavior: ScrollBehavior = prefersReducedMotion
    ? "auto"
    : "smooth";

  const position = `${String(activeIndex + 1).padStart(2, "0")} / ${String(tiles.length).padStart(2, "0")}`;

  return (
    <div>
      <section
        aria-label={WORK_GALLERY_LABEL}
        aria-roledescription="carousel"
        className={cn(
          "touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          prefersReducedMotion ? undefined : "scroll-smooth",
        )}
        data-lenis-prevent
        data-work-gallery=""
        ref={viewportRef}
      >
        <ul className="flex items-end gap-grid">
          {tiles.map((tile, index) => (
            <li
              className={cn(
                "w-10/12 shrink-0 snap-start md:w-5/12 lg:w-4/12",
                index % 2 === 0 ? "lg:translate-y-6" : "lg:-translate-y-3",
              )}
              key={tile.src}
            >
              <div data-work-tile>
                <WorkTile
                  featured={index === 0}
                  isActive={index === activeIndex}
                  tile={tile}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <WorkGalleryNav
        canNext={canNext}
        canPrevious={canPrevious}
        onNext={(): void => {
          goToNext(scrollBehavior);
        }}
        onPrevious={(): void => {
          goToPrevious(scrollBehavior);
        }}
        position={position}
      />
    </div>
  );
}
