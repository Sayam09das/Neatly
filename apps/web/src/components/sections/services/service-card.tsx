"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingServices } from "@/config/landing";
import {
  SERVICES_FINE_POINTER_QUERY,
  SERVICES_HOVER_ARROW_X_PX,
  SERVICES_HOVER_IMAGE_SCALE,
  SERVICES_HOVER_LIFT_PX,
  SERVICES_TAP_SCALE,
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

function ServiceArrow(): ReactElement {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
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

export function ServiceCard({ service }: ServiceCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  const cardClassName = cn(
    "group flex h-full overflow-hidden rounded-xl border border-border bg-background text-foreground",
    "motion-safe:transition-shadow motion-safe:duration-normal motion-safe:ease-standard",
    "motion-safe:hover:shadow-md",
    service.featured
      ? "flex-col lg:grid lg:grid-cols-2 lg:items-stretch"
      : "flex-col",
  );

  const image = (
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
    </div>
  );

  const action = (
    <Button asChild size="icon">
      <Link aria-label={`View ${service.title}`} href={service.href}>
        {hoverEnabled ? (
          <motion.span
            className="inline-flex"
            transition={hoverTransition}
            variants={{
              hover: { x: SERVICES_HOVER_ARROW_X_PX },
              rest: { x: 0 },
            }}
          >
            <ServiceArrow />
          </motion.span>
        ) : (
          <ServiceArrow />
        )}
      </Link>
    </Button>
  );

  const body = (
    <div
      className={cn(
        "flex flex-1 flex-col p-6",
        service.featured && "lg:justify-center lg:p-10",
      )}
    >
      <p className="text-label text-primary uppercase">{service.number}</p>
      <h3 className="mt-3 text-h3 text-foreground tracking-tight">
        {service.title}
      </h3>
      <p className="mt-3 max-w-prose text-body-small text-muted-foreground">
        {service.description}
      </p>
      <div className="mt-6 flex justify-end">{action}</div>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <article className={cardClassName}>
        {image}
        {body}
      </article>
    );
  }

  return (
    <motion.article
      className={cardClassName}
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { y: -SERVICES_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: SERVICES_TAP_SCALE }}
    >
      {image}
      {body}
    </motion.article>
  );
}

function ServiceImage({ service }: ServiceCardProps): ReactElement {
  return (
    <Image
      alt={service.image.alt}
      className="object-cover"
      fill
      sizes={
        service.featured
          ? "(min-width: 1024px) 50vw, 100vw"
          : "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      }
      src={service.image.src}
      style={{ objectPosition: service.image.objectPosition }}
    />
  );
}
