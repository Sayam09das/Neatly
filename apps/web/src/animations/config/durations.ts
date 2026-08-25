export const durationMs = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

export const durationSeconds = {
  fast: durationMs.fast / 1000,
  normal: durationMs.normal / 1000,
  slow: durationMs.slow / 1000,
} as const;

export const motionDuration = {
  micro: durationSeconds.fast,
  short: durationSeconds.normal,
  medium: durationSeconds.slow,
} as const;

export type DurationToken = keyof typeof durationMs;
export type MotionDurationToken = keyof typeof motionDuration;
