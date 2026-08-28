"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  getPasswordStrengthCount,
  PASSWORD_STRENGTH_LABELS,
  PASSWORD_STRENGTH_LEVELS,
  type PasswordStrength,
} from "@/lib/auth/password-strength";

interface PasswordStrengthHintProps {
  id: string;
  strength: PasswordStrength | null;
}

export function PasswordStrengthHint({
  id,
  strength,
}: PasswordStrengthHintProps): ReactElement | null {
  const prefersReducedMotion = useReducedMotion();
  const activeCount = getPasswordStrengthCount(strength);

  if (strength === null) {
    return null;
  }

  return (
    <div className="-mt-1 flex flex-col gap-2" id={id}>
      <div aria-hidden="true" className="flex gap-1">
        {PASSWORD_STRENGTH_LEVELS.map((level, index) => (
          <span
            className={cn(
              "h-1 flex-1 rounded-full bg-muted",
              index < activeCount ? "bg-primary" : "bg-muted",
            )}
            key={level}
          />
        ))}
      </div>
      <motion.p
        animate={{ opacity: 1 }}
        className="text-caption text-muted-foreground"
        initial={false}
        key={strength}
        transition={
          prefersReducedMotion ? { duration: 0 } : motionTransition.short
        }
      >
        {PASSWORD_STRENGTH_LABELS[strength]}
      </motion.p>
    </div>
  );
}
