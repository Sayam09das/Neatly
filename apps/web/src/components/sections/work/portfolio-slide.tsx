import { cn } from "@neatly/utils";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import type { landingFeaturedWork } from "@/config/landing";
import {
  WORK_SLIDE_INACTIVE_OPACITY,
  WORK_SLIDE_INACTIVE_SCALE,
} from "./work-animation";

export type PortfolioSlideItem = (typeof landingFeaturedWork.tiles)[number];

interface PortfolioSlideProps {
  isActive: boolean;
  prefersReducedMotion: boolean;
  priority?: boolean;
  tile: PortfolioSlideItem;
}

export function PortfolioSlide({
  isActive,
  prefersReducedMotion,
  priority = false,
  tile,
}: PortfolioSlideProps): ReactElement {
  const scale =
    prefersReducedMotion || isActive ? 1 : WORK_SLIDE_INACTIVE_SCALE;
  const slideStyle: CSSProperties = {
    opacity: isActive ? 1 : WORK_SLIDE_INACTIVE_OPACITY,
    transform: `scale(${String(scale)})`,
  };

  return (
    <figure
      className={cn(
        "origin-bottom",
        prefersReducedMotion
          ? undefined
          : "transition-[opacity,transform] duration-slow ease-standard",
      )}
      data-work-tile
      style={slideStyle}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <Image
          alt={tile.alt}
          className="object-cover"
          fill
          priority={priority}
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 40vw, 82vw"
          src={tile.src}
          style={{ objectPosition: tile.objectPosition }}
        />
      </div>
      <figcaption className="mt-4 text-label text-muted-foreground uppercase">
        {tile.label}
      </figcaption>
    </figure>
  );
}
