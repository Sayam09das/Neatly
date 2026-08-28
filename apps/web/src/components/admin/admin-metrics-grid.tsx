"use client";

import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";

interface AdminMetricsGridProps {
  children: ReactNode;
}

export function AdminMetricsGrid({
  children,
}: AdminMetricsGridProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      data-slot="admin-metrics-grid"
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
