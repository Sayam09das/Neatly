"use client";

import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { fadeUp } from "@/animations/motion/variants";

interface AdminDashboardMotionProps {
  children: ReactNode;
}

export function AdminDashboardMotion({
  children,
}: AdminDashboardMotionProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      className="flex flex-col gap-10 lg:gap-12"
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
      {children}
    </motion.div>
  );
}

interface AdminDashboardBlockProps {
  children: ReactNode;
}

export function AdminDashboardBlock({
  children,
}: AdminDashboardBlockProps): ReactElement {
  return <motion.div variants={fadeUp}>{children}</motion.div>;
}
