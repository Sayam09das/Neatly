import { motionTransition } from "@/animations/config/motion";

const FADE_DISTANCE_PX = 12;
const SCALE_AMOUNT = 0.98;

export const fade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionTransition.short,
  },
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: FADE_DISTANCE_PX },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransition.medium,
  },
} as const;

export const fadeDown = {
  hidden: { opacity: 0, y: -FADE_DISTANCE_PX },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransition.medium,
  },
} as const;

export const scale = {
  hidden: { opacity: 0, scale: SCALE_AMOUNT },
  visible: {
    opacity: 1,
    scale: 1,
    transition: motionTransition.short,
  },
} as const;
