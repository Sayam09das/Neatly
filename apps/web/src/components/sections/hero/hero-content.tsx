"use client";

import { Button } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { fadeUp } from "@/animations/motion/variants";
import { landingCtas, landingHero } from "@/config/landing";
import type { HomeCta } from "@/lib/customer/home";

interface HeroContentProps {
  secondaryAction: HomeCta;
}

export function HeroContent({
  secondaryAction,
}: HeroContentProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const emphasisIndex = landingHero.heading.indexOf(landingHero.emphasis);
  const headingLead =
    emphasisIndex === -1
      ? landingHero.heading
      : landingHero.heading.slice(0, emphasisIndex);

  return (
    <motion.div
      animate="visible"
      className="max-w-lg"
      initial={prefersReducedMotion ? false : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
          },
        },
      }}
    >
      <motion.p
        className="text-label text-secondary-foreground/70"
        variants={fadeUp}
      >
        {landingHero.eyebrow}
      </motion.p>
      <motion.h1
        aria-label={landingHero.heading}
        className="mt-4 text-display tracking-tight"
        id={landingHero.headingId}
        variants={fadeUp}
      >
        <span aria-hidden="true" className="block text-secondary-foreground">
          {headingLead.trimEnd()}
        </span>
        <span aria-hidden="true" className="mt-1 block text-primary">
          {landingHero.emphasis}
        </span>
      </motion.h1>
      <motion.p
        className="mt-5 max-w-lg text-body text-secondary-foreground/90"
        variants={fadeUp}
      >
        {landingHero.description}
      </motion.p>
      <motion.div
        className="mt-7 flex flex-col gap-4 lg:mt-8"
        variants={fadeUp}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild className="uppercase">
            <Link href={landingCtas.primary.href}>
              {landingCtas.primary.label}
              <ArrowUpRightIcon />
            </Link>
          </Button>
          <Link
            className="inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80 underline-offset-4 transition-colors duration-normal ease-standard hover:text-secondary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={secondaryAction.href}
          >
            {secondaryAction.label}
          </Link>
        </div>
        <ul className="flex flex-col gap-1.5 text-caption text-secondary-foreground/75 sm:flex-row sm:flex-wrap sm:gap-x-5">
          {landingHero.trustSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
