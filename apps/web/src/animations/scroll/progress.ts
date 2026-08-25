export const SCROLL_PROGRESS_MIN = 0;
export const SCROLL_PROGRESS_MAX = 1;

export function clampScrollProgress(progress: number): number {
  return Math.min(SCROLL_PROGRESS_MAX, Math.max(SCROLL_PROGRESS_MIN, progress));
}

export function shouldEnableScrollLinkedMotion(
  prefersReducedMotion: boolean,
): boolean {
  return !prefersReducedMotion;
}
