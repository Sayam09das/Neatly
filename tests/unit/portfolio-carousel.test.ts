import { describe, expect, it, vi } from "vitest";
import {
  getSwiperAutoplay,
  syncSwiperAutoplay,
} from "@/components/sections/work/portfolio-carousel";

function createAutoplayHost(overrides?: {
  autoplay?:
    | {
        pause: () => void;
        resume: () => void;
        start: () => boolean;
        stop: () => boolean;
      }
    | undefined;
  destroyed?: boolean;
}): Parameters<typeof getSwiperAutoplay>[0] {
  return {
    autoplay: overrides?.autoplay,
    destroyed: overrides?.destroyed,
  };
}

describe("getSwiperAutoplay", (): void => {
  it("returns undefined when the instance is missing, destroyed, or has no autoplay", (): void => {
    expect(getSwiperAutoplay(null)).toBeUndefined();
    expect(
      getSwiperAutoplay(createAutoplayHost({ destroyed: true })),
    ).toBeUndefined();
    expect(
      getSwiperAutoplay(createAutoplayHost({ autoplay: undefined })),
    ).toBeUndefined();
  });

  it("returns the autoplay API when it is still attached", (): void => {
    const autoplay = {
      pause: vi.fn(),
      resume: vi.fn(),
      start: vi.fn((): boolean => true),
      stop: vi.fn((): boolean => true),
    };

    expect(getSwiperAutoplay(createAutoplayHost({ autoplay }))).toBe(autoplay);
  });
});

describe("syncSwiperAutoplay", (): void => {
  it("does not throw when autoplay is missing after destroy or HMR", (): void => {
    expect((): void => {
      syncSwiperAutoplay(null, true);
      syncSwiperAutoplay(createAutoplayHost({ destroyed: true }), true);
      syncSwiperAutoplay(createAutoplayHost({ autoplay: undefined }), true);
    }).not.toThrow();
  });

  it("starts or stops autoplay when the module is available", (): void => {
    const autoplay = {
      pause: vi.fn(),
      resume: vi.fn(),
      start: vi.fn((): boolean => true),
      stop: vi.fn((): boolean => true),
    };
    const instance = createAutoplayHost({ autoplay });

    syncSwiperAutoplay(instance, true);
    expect(autoplay.start).toHaveBeenCalledTimes(1);

    syncSwiperAutoplay(instance, false);
    expect(autoplay.stop).toHaveBeenCalledTimes(1);
  });
});
