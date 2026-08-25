/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  getPrefersReducedMotion,
  useReducedMotion,
} from "@/animations/hooks/use-reduced-motion";

function stubMatchMedia(matches: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: query.includes("prefers-reduced-motion: reduce")
          ? matches
          : false,
        media: query,
        onchange: null,
        addEventListener: (): void => undefined,
        removeEventListener: (): void => undefined,
        addListener: (): void => undefined,
        removeListener: (): void => undefined,
        dispatchEvent: (): boolean => false,
      }) as MediaQueryList,
  });
}

describe("useReducedMotion", (): void => {
  afterEach((): void => {
    stubMatchMedia(false);
  });

  it("reads the current reduced-motion media query", (): void => {
    stubMatchMedia(true);
    expect(getPrefersReducedMotion()).toBe(true);

    const { result } = renderHook((): boolean => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("defaults to allowing motion when the query does not match", (): void => {
    stubMatchMedia(false);
    expect(getPrefersReducedMotion()).toBe(false);

    const { result } = renderHook((): boolean => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
