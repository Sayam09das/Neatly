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
import {
  CATALOG_FINE_POINTER_QUERY,
  CATALOG_HOVER_ARROW_X_PX,
  CATALOG_HOVER_IMAGE_SCALE,
} from "@/components/sections/catalog/services-catalog-animation";
import {
  customerServiceApplyLabel,
  customerServiceApplyPath,
  customerServiceDetailsLabel,
  customerServicePath,
  customerServicesCopy,
} from "@/config/customer";
import { landingServiceStillBySrc, landingServices } from "@/config/landing";
import {
  isLocalCustomerServiceImage,
  isUsableCustomerServiceImage,
} from "@/lib/customer/catalog";
import type { CustomerService } from "@/types/customer";

interface CatalogServiceCardProps {
  priority?: boolean;
  service: CustomerService;
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
    const media = window.matchMedia(CATALOG_FINE_POINTER_QUERY);
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

export function CatalogServiceCard({
  priority = false,
  service,
}: CatalogServiceCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const detailsHref = customerServicePath(service.slug);
  const detailsLabel = customerServiceDetailsLabel(service.name);
  const applyHref = customerServiceApplyPath(service.slug);
  const applyLabel = customerServiceApplyLabel(service.name);
  const cardClassName = cn(
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground",
    "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
    "hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="absolute inset-0">
          {hoverEnabled ? (
            <motion.div
              className="absolute inset-0"
              transition={imageHoverTransition}
              variants={{
                hover: { scale: CATALOG_HOVER_IMAGE_SCALE },
                rest: { scale: 1 },
              }}
            >
              <ServiceCoverImage priority={priority} service={service} />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <ServiceCoverImage priority={priority} service={service} />
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-background/30 bg-background/80 text-foreground backdrop-blur-sm"
        >
          <CardArrow hoverEnabled={hoverEnabled} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {service.isFeatured ? (
          <p className="text-label text-primary uppercase">
            {customerServicesCopy.featuredLabel}
          </p>
        ) : null}
        <h3
          className={cn(
            "text-h3 text-foreground tracking-tight",
            service.isFeatured && "mt-3",
          )}
        >
          {service.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-body-small text-muted-foreground">
          {service.shortDescription}
        </p>
        <p className="mt-auto flex min-h-touch items-center justify-between pt-6 text-body-small font-medium">
          <span>{landingServices.viewLabel}</span>
          <CardArrow hoverEnabled={hoverEnabled} />
        </p>
      </div>
    </>
  );

  return (
    <article className="flex h-full flex-col" data-slot="customer-service-card">
      {prefersReducedMotion ? (
        <Link
          aria-label={detailsLabel}
          className={cardClassName}
          href={detailsHref}
        >
          {body}
        </Link>
      ) : (
        <motion.div
          className="h-full"
          initial="rest"
          transition={hoverTransition}
          variants={{ hover: {}, rest: {} }}
          whileHover={hoverEnabled ? "hover" : undefined}
        >
          <Link
            aria-label={detailsLabel}
            className={cardClassName}
            href={detailsHref}
          >
            {body}
          </Link>
        </motion.div>
      )}
      <p className="pt-3">
        <Link
          aria-label={applyLabel}
          className="inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80 underline-offset-4 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:text-secondary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={applyHref}
        >
          {customerServicesCopy.apply}
        </Link>
      </p>
    </article>
  );
}

function ServiceCoverImage({
  priority,
  service,
}: CatalogServiceCardProps): ReactElement {
  if (!isUsableCustomerServiceImage(service.coverImageUrl)) {
    return (
      <div
        className="flex size-full items-center justify-center bg-muted"
        data-slot="customer-service-image-fallback"
      >
        <span className="sr-only">{customerServicesCopy.imageUnavailable}</span>
      </div>
    );
  }

  const alt =
    service.coverImageAlt !== null && service.coverImageAlt.trim() !== ""
      ? service.coverImageAlt
      : service.name;
  const still = landingServiceStillBySrc(service.coverImageUrl);

  return (
    <Image
      alt={alt}
      className="object-cover"
      fill
      priority={priority}
      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      src={service.coverImageUrl}
      style={
        still === undefined
          ? undefined
          : { objectPosition: still.objectPosition }
      }
      unoptimized={!isLocalCustomerServiceImage(service.coverImageUrl)}
    />
  );
}

interface CardArrowProps {
  hoverEnabled: boolean;
}

function CardArrow({ hoverEnabled }: CardArrowProps): ReactElement {
  const arrow = (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M4 12 12 4M6 4h6v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );

  if (!hoverEnabled) {
    return arrow;
  }

  return (
    <motion.span
      className="inline-flex"
      transition={hoverTransition}
      variants={{
        hover: { x: CATALOG_HOVER_ARROW_X_PX },
        rest: { x: 0 },
      }}
    >
      {arrow}
    </motion.span>
  );
}
