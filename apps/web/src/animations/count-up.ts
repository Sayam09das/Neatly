export const COUNT_UP_DURATION_MS = 1400;
export const COUNT_UP_THRESHOLD = 0.45;
export const COUNT_UP_RAF_FALLBACK_MS = 48;
export const COUNT_UP_FRAME_MS = 16;

export function formatCountFigure(value: number, suffix: string): string {
  return `${String(value)}${suffix}`;
}

export interface CountUpPlayback {
  pause: () => void;
}

export interface CountUpOptions {
  durationMs: number;
  from: number;
  onUpdate: (value: number) => void;
  to: number;
}

export function playCountUp(options: CountUpOptions): CountUpPlayback {
  let frame = 0;
  let timeoutId = 0;
  let stopped = false;
  let usedRaf = false;
  const start = performance.now();

  const apply = (now: number): boolean => {
    const progress = Math.min((now - start) / options.durationMs, 1);
    const eased = 1 - (1 - progress) ** 3;
    const next = Math.round(options.from + (options.to - options.from) * eased);

    options.onUpdate(next);

    return progress < 1;
  };

  const tickRaf = (now: number): void => {
    if (stopped) {
      return;
    }

    usedRaf = true;

    if (apply(now)) {
      frame = requestAnimationFrame(tickRaf);
    }
  };

  const tickTimeout = (): void => {
    if (stopped) {
      return;
    }

    if (apply(performance.now())) {
      timeoutId = window.setTimeout(tickTimeout, COUNT_UP_FRAME_MS);
    }
  };

  frame = requestAnimationFrame(tickRaf);
  timeoutId = window.setTimeout((): void => {
    if (stopped || usedRaf) {
      return;
    }

    tickTimeout();
  }, COUNT_UP_RAF_FALLBACK_MS);

  return {
    pause: (): void => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timeoutId);
    },
  };
}
