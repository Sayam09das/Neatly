"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { landingBlogHighlights } from "@/config/landing";
import type { LandingJournalPost } from "@/lib/customer/public-blog";
import { resolveJournalCover } from "@/lib/customer/public-blog";
import {
  JOURNAL_FINE_POINTER_QUERY,
  JOURNAL_HOVER_IMAGE_SCALE,
  JOURNAL_HOVER_LIFT_PX,
  JOURNAL_TAP_SCALE,
} from "./journal-animation";
import { formatJournalSlotIndex } from "./journal-index";

type JournalSlotImage = (typeof landingBlogHighlights.slots)[number];

interface JournalFeaturedCardProps {
  post?: LandingJournalPost;
}

interface JournalSlotCardProps {
  index: number;
  post?: LandingJournalPost;
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

export function JournalFeaturedCard({
  post,
}: JournalFeaturedCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const fallback = landingBlogHighlights.featuredImage;
  const cover = resolveJournalCover(
    post === undefined
      ? null
      : { coverAlt: post.coverAlt, coverSrc: post.coverSrc },
    fallback,
  );
  const category =
    post?.categoryName?.trim() || landingBlogHighlights.pendingCategory;
  const title = post?.title ?? landingBlogHighlights.emptyMessage;
  const photo = (
    <Image
      alt={cover.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 55vw, 100vw"
      src={cover.src}
      style={{
        objectPosition:
          post === undefined ? fallback.objectPosition : "50% 50%",
      }}
    />
  );

  const body = (
    <>
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
          {category}
        </p>
      </div>
      <div className="mt-6">
        <p className="text-label text-primary uppercase">
          {landingBlogHighlights.featuredLabel}
        </p>
        <h3 className="mt-3 text-h3 text-foreground tracking-tight">{title}</h3>
        {post?.date === undefined ? null : (
          <p className="mt-2 text-caption text-muted-foreground">{post.date}</p>
        )}
      </div>
    </>
  );

  if (post === undefined) {
    return (
      <article className="flex h-full flex-col" data-journal-featured>
        {body}
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col" data-journal-featured>
      <Link
        className="flex h-full flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={post.href}
      >
        {body}
      </Link>
    </article>
  );
}

function JournalSlotBody({
  index,
  post,
  slot,
}: JournalSlotCardProps): ReactElement {
  const cover = resolveJournalCover(
    post === undefined
      ? null
      : { coverAlt: post.coverAlt, coverSrc: post.coverSrc },
    slot,
  );
  const photo = (
    <Image
      alt={cover.alt}
      className="object-cover"
      fill
      sizes="160px"
      src={cover.src}
      style={{
        objectPosition: post === undefined ? slot.objectPosition : "50% 50%",
      }}
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
          {post?.categoryName?.trim() ||
            `Slot ${formatJournalSlotIndex(index)}`}
        </p>
        <p className="mt-2 text-body text-foreground">
          {post?.title ?? landingBlogHighlights.slotPendingTitle}
        </p>
        <p className="mt-2 text-caption text-muted-foreground">
          {post?.date ?? landingBlogHighlights.slotPendingDate}
        </p>
      </div>
    </>
  );
}

export function JournalSlotCard({
  index,
  post,
  slot,
}: JournalSlotCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const bodyClassName = cn(
    "flex gap-4 rounded-xl border border-border bg-background p-4 sm:p-5",
    "motion-safe:transition-shadow motion-safe:duration-normal motion-safe:ease-standard",
    "motion-safe:hover:shadow-md",
    post === undefined
      ? null
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );
  const body = <JournalSlotBody index={index} post={post} slot={slot} />;

  if (prefersReducedMotion) {
    if (post === undefined) {
      return <article className={bodyClassName}>{body}</article>;
    }

    return (
      <Link className={bodyClassName} href={post.href}>
        {body}
      </Link>
    );
  }

  if (post === undefined) {
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
        {body}
      </motion.article>
    );
  }

  return (
    <motion.div
      className="rounded-xl"
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { y: -JOURNAL_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: JOURNAL_TAP_SCALE }}
    >
      <Link className={bodyClassName} href={post.href}>
        {body}
      </Link>
    </motion.div>
  );
}
