import { durationSeconds, motionDuration } from "./durations";
import { easings } from "./easings";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const reducedMotionTransition = {
  duration: 0,
} as const;

export const motionTransition = {
  micro: {
    duration: motionDuration.micro,
    ease: easings.standard.framer,
  },
  short: {
    duration: motionDuration.short,
    ease: easings.standard.framer,
  },
  medium: {
    duration: motionDuration.medium,
    ease: easings.enter.framer,
  },
} as const;

export function getMotionTransition(prefersReducedMotion: boolean): {
  duration: number;
  ease?: typeof easings.standard.framer;
} {
  if (prefersReducedMotion) {
    return reducedMotionTransition;
  }

  return {
    duration: durationSeconds.normal,
    ease: easings.standard.framer,
  };
}
