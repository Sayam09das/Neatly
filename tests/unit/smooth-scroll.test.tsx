/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLenis,
  hasLenisPreventAttribute,
  SmoothScroll,
  shouldSkipSmoothScroll,
} from "@/animations/lenis/smooth-scroll";

vi.mock("lenis/dist/lenis.css", () => ({}));

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

describe("shouldSkipSmoothScroll", (): void => {
  it("skips Lenis on admin routes so the shell uses native scrolling", (): void => {
    expect(shouldSkipSmoothScroll("/", false)).toBe(false);
    expect(shouldSkipSmoothScroll("/admin", false)).toBe(true);
    expect(shouldSkipSmoothScroll("/admin/login", false)).toBe(true);
    expect(shouldSkipSmoothScroll("/about", true)).toBe(true);
  });
});

describe("SmoothScroll", (): void => {
  beforeEach((): void => {
    stubMatchMedia(false);
  });

  afterEach((): void => {
    stubMatchMedia(false);
  });

  it("mounts children, starts one Lenis instance, and clears it on unmount", (): void => {
    const { unmount } = render(
      <SmoothScroll>
        <p>Foundation ready</p>
      </SmoothScroll>,
    );

    expect(screen.getByText("Foundation ready")).toBeInTheDocument();
    expect(getLenis()).not.toBeNull();

    unmount();

    expect(getLenis()).toBeNull();
  });

  it("skips Lenis when reduced motion is preferred", (): void => {
    stubMatchMedia(true);

    const { unmount } = render(
      <SmoothScroll>
        <p>Native scroll</p>
      </SmoothScroll>,
    );

    expect(screen.getByText("Native scroll")).toBeInTheDocument();
    expect(getLenis()).toBeNull();

    unmount();
    expect(getLenis()).toBeNull();
  });

  it("recognizes nested scroll-lock hosts", (): void => {
    const node = document.createElement("div");
    expect(hasLenisPreventAttribute(node)).toBe(false);
    node.setAttribute("data-lenis-prevent", "");
    expect(hasLenisPreventAttribute(node)).toBe(true);
  });
});
