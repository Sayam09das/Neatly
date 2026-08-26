"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactElement } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingFeaturedWork } from "@/config/landing";

type WorkTileItem = (typeof landingFeaturedWork.tiles)[number];

interface WorkTileProps {
  featured?: boolean;
  tile: WorkTileItem;
}

const WORK_HOVER_IMAGE_SCALE = 1.04;

const imageTransition = {
  duration: durationSeconds.slow,
  ease: easings.enter.framer,
} as const;

export function WorkTile({
  featured = false,
  tile,
}: WorkTileProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  const frame = (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted",
        featured
          ? "aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]"
          : "aspect-[4/5]",
      )}
    >
      {prefersReducedMotion ? (
        <WorkTileImage tile={tile} />
      ) : (
        <motion.div
          className="absolute inset-0"
          transition={imageTransition}
          whileHover={{ scale: WORK_HOVER_IMAGE_SCALE }}
        >
          <WorkTileImage tile={tile} />
        </motion.div>
      )}
    </div>
  );

  return (
    <figure>
      {frame}
      <figcaption className="mt-4 text-label text-muted-foreground uppercase">
        {tile.label}
      </figcaption>
    </figure>
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
