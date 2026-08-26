export const COUNT_UP_DURATION_MS = 1400;
export const COUNT_UP_THRESHOLD = 0.45;

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
  const start = performance.now();

  const tick = (now: number): void => {
    const progress = Math.min((now - start) / options.durationMs, 1);
    const eased = 1 - (1 - progress) ** 3;
    const next = Math.round(options.from + (options.to - options.from) * eased);

    options.onUpdate(next);

    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    }
  };

  frame = requestAnimationFrame(tick);

  return {
    pause: (): void => {
      cancelAnimationFrame(frame);
    },
  };
}
