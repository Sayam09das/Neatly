"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactElement } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { CATALOG_HOVER_IMAGE_SCALE } from "@/components/sections/catalog/services-catalog-animation";
import { customerServicesCopy } from "@/config/customer";
import { landingServiceStillBySrc } from "@/config/landing";
import {
  isLocalCustomerServiceImage,
  isUsableCustomerServiceImage,
} from "@/lib/customer/catalog";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceDetailCoverProps {
  service: CustomerServiceDetail;
}

const imageHoverTransition = {
  duration: durationSeconds.slow,
  ease: easings.enter.framer,
} as const;

export function ServiceDetailCover({
  service,
}: ServiceDetailCoverProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
      {prefersReducedMotion ? (
        <ServiceDetailImage service={service} />
      ) : (
        <motion.div
          className="absolute inset-0"
          initial="rest"
          transition={imageHoverTransition}
          variants={{
            hover: { scale: CATALOG_HOVER_IMAGE_SCALE },
            rest: { scale: 1 },
          }}
          whileHover="hover"
        >
          <ServiceDetailImage service={service} />
        </motion.div>
      )}
    </div>
  );
}

function ServiceDetailImage({
  service,
}: ServiceDetailCoverProps): ReactElement {
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
      priority
      sizes="(min-width: 1024px) 48vw, 100vw"
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
