"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, type SVGProps, useState } from "react";
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
import {
  isLocalCustomerServiceImage,
  isUsableCustomerServiceImage,
} from "@/lib/customer/catalog";
import type { CustomerService } from "@/types/customer";

interface ServicesDiscoveryCardProps {
  headingLevel?: "h2" | "h3";
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

export function ServicesDiscoveryCard({
  headingLevel = "h2",
  priority = false,
  service,
}: ServicesDiscoveryCardProps): ReactElement {
  const [focusWithin, setFocusWithin] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const Title = headingLevel === "h3" ? "h3" : "h2";
  const detailsHref = customerServicePath(service.slug);
  const detailsLabel = customerServiceDetailsLabel(service.name);
  const applyHref = customerServiceApplyPath(service.slug);
  const applyLabel = customerServiceApplyLabel(service.name);

  const cardClassName = cn(
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground",
    "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
    "motion-safe:hover:border-foreground/20 motion-safe:focus-within:border-foreground/20",
  );

  return (
    <motion.article
      animate={hoverEnabled && focusWithin ? "hover" : undefined}
      className={cardClassName}
      data-slot="customer-service-card"
      initial="rest"
      onBlurCapture={(event): void => {
        const next = event.relatedTarget;

        if (next instanceof Node && event.currentTarget.contains(next)) {
          return;
        }

        setFocusWithin(false);
      }}
      onFocusCapture={(): void => {
        setFocusWithin(true);
      }}
      transition={hoverTransition}
      variants={{ hover: {}, rest: {} }}
      whileHover={hoverEnabled ? "hover" : undefined}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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
          <ServiceCoverImage priority={priority} service={service} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {service.isFeatured ? (
          <p className="text-label text-primary uppercase">
            {customerServicesCopy.featuredLabel}
          </p>
        ) : null}
        <Title
          className={cn(
            "text-h3 text-foreground tracking-tight",
            service.isFeatured && "mt-3",
          )}
        >
          {service.name}
        </Title>
        <p className="mt-3 max-w-prose flex-1 text-body-small text-muted-foreground">
          {service.shortDescription}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            aria-label={detailsLabel}
            className="group/details inline-flex min-h-touch items-center gap-1 text-button text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            href={detailsHref}
          >
            {customerServicesCopy.viewDetails}
            {hoverEnabled ? (
              <motion.span
                className="inline-flex"
                transition={hoverTransition}
                variants={{
                  hover: { x: CATALOG_HOVER_ARROW_X_PX },
                  rest: { x: 0 },
                }}
              >
                <CardArrow />
              </motion.span>
            ) : (
              <span className="inline-flex motion-safe:transition-transform motion-safe:duration-fast group-focus-visible/details:translate-x-1">
                <CardArrow />
              </span>
            )}
          </Link>
          <Button asChild>
            <Link aria-label={applyLabel} href={applyHref}>
              {customerServicesCopy.apply}
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function ServiceCoverImage({
  priority,
  service,
}: ServicesDiscoveryCardProps): ReactElement {
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

  return (
    <Image
      alt={alt}
      className="object-cover"
      fill
      priority={priority}
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      src={service.coverImageUrl}
      unoptimized={!isLocalCustomerServiceImage(service.coverImageUrl)}
    />
  );
}

function CardArrow(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}
