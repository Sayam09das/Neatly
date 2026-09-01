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
import { landingServices } from "@/config/landing";
import {
  SERVICES_FINE_POINTER_QUERY,
  SERVICES_HOVER_ARROW_X_PX,
  SERVICES_HOVER_IMAGE_SCALE,
} from "./services-animation";

type ServiceItem = (typeof landingServices.items)[number];

interface ServiceCardProps {
  service: ServiceItem;
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
    const media = window.matchMedia(SERVICES_FINE_POINTER_QUERY);
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

export function ServiceCard({ service }: ServiceCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const cardClassName = cn(
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground",
    "motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard",
    "hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  const body = (
    <>
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted"
        data-service-image-mask
      >
        <div className="absolute inset-0" data-service-image-reveal>
          <div className="absolute inset-0" data-service-image-parallax>
            {hoverEnabled ? (
              <motion.div
                className="absolute inset-0"
                transition={imageHoverTransition}
                variants={{
                  hover: { scale: SERVICES_HOVER_IMAGE_SCALE },
                  rest: { scale: 1 },
                }}
              >
                <ServiceImage service={service} />
              </motion.div>
            ) : (
              <div className="absolute inset-0">
                <ServiceImage service={service} />
              </div>
            )}
          </div>
        </div>
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-background/30 bg-background/80 text-foreground backdrop-blur-sm"
        >
          <ServiceArrow hoverEnabled={hoverEnabled} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-label text-primary uppercase">{service.number}</p>
        <h3 className="mt-3 text-h3 text-foreground tracking-tight">
          {service.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-body-small text-muted-foreground">
          {service.description}
        </p>
        <p className="mt-auto flex min-h-touch items-center justify-between pt-6 text-body-small font-medium">
          <span>{landingServices.viewLabel}</span>
          <ServiceArrow hoverEnabled={hoverEnabled} />
        </p>
      </div>
    </>
  );

  if (prefersReducedMotion) {
    return (
      <Link
        aria-label={`View ${service.title}`}
        className={cardClassName}
        href={service.href}
      >
        {body}
      </Link>
    );
  }

  return (
    <motion.div
      className="h-full"
      initial="rest"
      transition={hoverTransition}
      variants={{ hover: {}, rest: {} }}
      whileHover={hoverEnabled ? "hover" : undefined}
    >
      <Link
        aria-label={`View ${service.title}`}
        className={cardClassName}
        href={service.href}
      >
        {body}
      </Link>
    </motion.div>
  );
}

function ServiceImage({ service }: ServiceCardProps): ReactElement {
  return (
    <Image
      alt={service.image.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      src={service.image.src}
      style={{ objectPosition: service.image.objectPosition }}
    />
  );
}

interface ServiceArrowProps {
  hoverEnabled: boolean;
}

function ServiceArrow({ hoverEnabled }: ServiceArrowProps): ReactElement {
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
        hover: { x: SERVICES_HOVER_ARROW_X_PX },
        rest: { x: 0 },
      }}
    >
      {arrow}
    </motion.span>
  );
}
