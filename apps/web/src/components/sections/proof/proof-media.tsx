"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { landingTrustProof } from "@/config/landing";
import {
  PROOF_FINE_POINTER_QUERY,
  PROOF_HOVER_IMAGE_SCALE,
} from "./proof-animation";

const imageHoverTransition = {
  duration: durationSeconds.slow,
  ease: easings.enter.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(PROOF_FINE_POINTER_QUERY);
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

export function ProofMedia(): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  const photo = (
    <Image
      alt={landingTrustProof.image.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      src={landingTrustProof.image.src}
      style={{ objectPosition: landingTrustProof.image.objectPosition }}
    />
  );

  return (
    <figure className="m-0">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted"
        data-proof-image-mask
      >
        <div className="absolute inset-0" data-proof-image-reveal>
          <div className="absolute inset-0" data-proof-image-parallax>
            {hoverEnabled ? (
              <motion.div
                className="absolute inset-0"
                initial="rest"
                transition={imageHoverTransition}
                variants={{
                  hover: { scale: PROOF_HOVER_IMAGE_SCALE },
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
      </div>
    </figure>
  );
}
