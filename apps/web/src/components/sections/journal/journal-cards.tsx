"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { landingBlogHighlights } from "@/config/landing";
import {
  JOURNAL_FINE_POINTER_QUERY,
  JOURNAL_HOVER_IMAGE_SCALE,
  JOURNAL_HOVER_LIFT_PX,
  JOURNAL_TAP_SCALE,
} from "./journal-animation";
import { formatJournalSlotIndex } from "./journal-index";

type JournalSlotImage = (typeof landingBlogHighlights.slots)[number];

interface JournalSlotCardProps {
  index: number;
  slot: JournalSlotImage;
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
    const media = window.matchMedia(JOURNAL_FINE_POINTER_QUERY);
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

export function JournalFeaturedCard(): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const image = landingBlogHighlights.featuredImage;

  const photo = (
    <Image
      alt={image.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 55vw, 100vw"
      src={image.src}
      style={{ objectPosition: image.objectPosition }}
    />
  );

  return (
    <article className="flex h-full flex-col" data-journal-featured>
      <div
        className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted"
        data-journal-featured-mask
      >
        <div className="absolute inset-0" data-journal-featured-reveal>
          <div className="absolute inset-0" data-journal-featured-parallax>
            {hoverEnabled ? (
              <motion.div
                className="absolute inset-0"
                initial="rest"
                transition={imageHoverTransition}
                variants={{
                  hover: { scale: JOURNAL_HOVER_IMAGE_SCALE },
                  rest: { scale: 1 },
                }}
                whileHover="hover"
              >
                {photo}
              </motion.div>
            ) : (
              <div className="absolute inset-0">{photo}</div>
            )}
          </div>
        </div>
        <p className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-label text-primary uppercase">
          {landingBlogHighlights.pendingCategory}
        </p>
      </div>
      <div className="mt-6">
        <p className="text-label text-primary uppercase">
          {landingBlogHighlights.featuredLabel}
        </p>
        <h3 className="mt-3 text-h3 text-foreground tracking-tight">
          {landingBlogHighlights.emptyMessage}
        </h3>
      </div>
    </article>
  );
}

function JournalSlotBody({ index, slot }: JournalSlotCardProps): ReactElement {
  const photo = (
    <Image
      alt={slot.alt}
      className="object-cover"
      fill
      sizes="160px"
      src={slot.src}
      style={{ objectPosition: slot.objectPosition }}
    />
  );

  return (
    <>
      <div
        className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28"
        data-journal-slot-mask
      >
        <div className="absolute inset-0" data-journal-slot-reveal>
          {photo}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label text-muted-foreground uppercase">
          Slot {formatJournalSlotIndex(index)}
        </p>
        <p className="mt-2 text-body text-foreground">
          {landingBlogHighlights.slotPendingTitle}
        </p>
        <p className="mt-2 text-caption text-muted-foreground">
          {landingBlogHighlights.slotPendingDate}
        </p>
      </div>
    </>
  );
}

export function JournalSlotCard({
  index,
  slot,
}: JournalSlotCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  const bodyClassName = cn(
    "flex gap-4 rounded-xl border border-border bg-background p-4 sm:p-5",
    "motion-safe:transition-shadow motion-safe:duration-normal motion-safe:ease-standard",
    "motion-safe:hover:shadow-md",
  );

  if (prefersReducedMotion) {
    return (
      <article className={bodyClassName}>
        <JournalSlotBody index={index} slot={slot} />
      </article>
    );
  }

  return (
    <motion.article
      className={bodyClassName}
      initial="rest"
      tabIndex={-1}
      transition={hoverTransition}
      variants={{
        hover: { y: -JOURNAL_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: JOURNAL_TAP_SCALE }}
    >
      <JournalSlotBody index={index} slot={slot} />
    </motion.article>
  );
}
