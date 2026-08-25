import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

function stubDomApis(): void {
  if (typeof window === "undefined") {
    return;
  }

  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  window.ResizeObserver = ResizeObserverStub;

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
