"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingFeaturedWork } from "@/config/landing";
import {
  WORK_FINE_POINTER_QUERY,
  WORK_HOVER_IMAGE_SCALE,
  WORK_HOVER_LIFT_PX,
  WORK_INACTIVE_SCALE,
  WORK_TAP_SCALE,
} from "./work-animation";

type WorkTileItem = (typeof landingFeaturedWork.tiles)[number];

interface WorkTileProps {
  featured?: boolean;
  isActive?: boolean;
  tile: WorkTileItem;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

const imageHoverTransition = {
  duration: durationSeconds.slow,
  ease: easings.enter.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(WORK_FINE_POINTER_QUERY);
    const sync = (): void => {
      setMatches(media.matches);
    };

    sync();
    media.addEventListener("change", sync);

    return (): void => {
      media.removeEventListener("change", sync);
    };
  }, []);

  return matches;
}

export function WorkTile({
  featured = false,
  isActive = true,
  tile,
}: WorkTileProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const restScale = isActive ? 1 : WORK_INACTIVE_SCALE;

  const frame = (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted",
        featured
          ? "aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]"
          : "aspect-[4/5]",
      )}
      data-work-image-mask
    >
      <div className="absolute inset-0" data-work-image-reveal>
        <div className="absolute inset-0" data-work-image-parallax>
          {hoverEnabled ? (
            <motion.div
              className="absolute inset-0"
              transition={imageHoverTransition}
              variants={{
                hover: { scale: WORK_HOVER_IMAGE_SCALE },
                rest: { scale: 1 },
              }}
            >
              <WorkTileImage tile={tile} />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <WorkTileImage tile={tile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const body = (
    <>
      {frame}
      <figcaption className="mt-4 text-label text-muted-foreground uppercase">
        {tile.label}
      </figcaption>
    </>
  );

  if (prefersReducedMotion) {
    return <figure>{body}</figure>;
  }

  return (
    <motion.figure
      animate="rest"
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { scale: 1, y: -WORK_HOVER_LIFT_PX },
        rest: { scale: restScale, y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: WORK_TAP_SCALE }}
    >
      {body}
    </motion.figure>
  );
}

function WorkTileImage({ tile }: { tile: WorkTileItem }): ReactElement {
  return (
    <Image
      alt={tile.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 100vw"
      src={tile.src}
      style={{ objectPosition: tile.objectPosition }}
    />
  );
}
