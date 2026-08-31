import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

const TEST_SESSION_SECRET = "test-session-secret-value-32-chars-min";
const TEST_SITE_URL = "http://localhost:3000";

function isUnset(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

function applyTestEnvDefaults(): void {
  if (isUnset(process.env.SESSION_SECRET)) {
    process.env.SESSION_SECRET = TEST_SESSION_SECRET;
  }

  if (
    isUnset(process.env.SITE_URL) &&
    isUnset(process.env.NEXT_PUBLIC_SITE_URL)
  ) {
    process.env.SITE_URL = TEST_SITE_URL;
  }
}

applyTestEnvDefaults();

function stubDomApis(): void {
  if (typeof window === "undefined") {
    return;
  }

  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];

    constructor(private readonly callback: IntersectionObserverCallback) {}

    observe(target: Element): void {
      this.callback(
        [
          {
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target,
            time: 0,
          },
        ],
        this,
      );
    }

    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  window.ResizeObserver = ResizeObserverStub;
  window.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;

  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: (): void => undefined,
  });

  Object.defineProperty(window.HTMLElement.prototype, "hasPointerCapture", {
    configurable: true,
    value: (): boolean => false,
  });
  Object.defineProperty(window.HTMLElement.prototype, "setPointerCapture", {
    configurable: true,
    value: (): void => undefined,
  });
  Object.defineProperty(window.HTMLElement.prototype, "releasePointerCapture", {
    configurable: true,
    value: (): void => undefined,
  });
  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: (): void => undefined,
  });

  if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: false,
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

  const originalGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = (
    elt: Element,
    pseudoElt?: string | null,
  ): CSSStyleDeclaration => {
    const style = originalGetComputedStyle(elt, pseudoElt);
    const transform = style.transform;

    if (transform === "" || transform == null) {
      Object.defineProperty(style, "transform", {
        configurable: true,
        get: (): string => "matrix(1, 0, 0, 1, 0, 0)",
      });
    }

    return style;
  };
}

stubDomApis();

afterEach((): void => {
  if (typeof document !== "undefined") {
    cleanup();
  }
});
