"use client";

import { type RefObject, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";

interface WorkGalleryScroll {
  activeIndex: number;
  canNext: boolean;
  canPrevious: boolean;
  goToNext: (behavior: ScrollBehavior) => void;
  goToPrevious: (behavior: ScrollBehavior) => void;
  viewportRef: RefObject<HTMLElement | null>;
}

function getTrackStep(viewport: HTMLElement): number {
  const track = viewport.firstElementChild;

  if (!(track instanceof HTMLElement)) {
    return 0;
  }

  const first = track.firstElementChild;

  if (!(first instanceof HTMLElement)) {
    return 0;
  }

  const styles = window.getComputedStyle(track);
  const gap =
    Number.parseFloat(styles.columnGap) || Number.parseFloat(styles.gap) || 0;

  return first.getBoundingClientRect().width + gap;
}

function resolveViewport(stored: HTMLElement | null): HTMLElement | null {
  if (stored !== null) {
    return stored;
  }

  return document.querySelector<HTMLElement>("[data-work-gallery]");
}

function scrollGalleryBy(
  viewport: HTMLElement,
  direction: 1 | -1,
  behavior: ScrollBehavior,
): void {
  const step = getTrackStep(viewport);

  if (step === 0) {
    return;
  }

  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const next = Math.min(
    max,
    Math.max(0, viewport.scrollLeft + direction * step),
  );

  if (behavior === "smooth") {
    viewport.scrollTo({ behavior, left: next });
    return;
  }

  viewport.scrollLeft = next;
}

export function useWorkGalleryScroll(): WorkGalleryScroll {
  const viewportRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canNext, setCanNext] = useState(true);
  const [canPrevious, setCanPrevious] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) | undefined => {
    const viewport = viewportRef.current;

    if (viewport === null) {
      return undefined;
    }

    const sync = (): void => {
      if (viewport.clientWidth === 0) {
        return;
      }

      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const step = getTrackStep(viewport);

      setCanPrevious(viewport.scrollLeft > 1);
      setCanNext(max > 1 && viewport.scrollLeft < max - 1);

      if (step === 0) {
        return;
      }

      setActiveIndex(Math.max(0, Math.round(viewport.scrollLeft / step)));
    };

    sync();
    const frame = window.requestAnimationFrame(sync);
    viewport.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(viewport);

    return (): void => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, []);

  const goToNext = (behavior: ScrollBehavior): void => {
    const node = resolveViewport(viewportRef.current);

    if (node === null) {
      return;
    }

    scrollGalleryBy(node, 1, behavior);
  };

  const goToPrevious = (behavior: ScrollBehavior): void => {
    const node = resolveViewport(viewportRef.current);

    if (node === null) {
      return;
    }

    scrollGalleryBy(node, -1, behavior);
  };

  return {
    activeIndex,
    canNext,
    canPrevious,
    goToNext,
    goToPrevious,
    viewportRef,
  };
}
