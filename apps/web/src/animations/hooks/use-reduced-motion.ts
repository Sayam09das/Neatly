"use client";

import { useEffect, useState } from "react";
import { REDUCED_MOTION_QUERY } from "@/animations/config/motion";

export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect((): (() => void) => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (): void => {
      setPrefersReducedMotion(media.matches);
    };

    onChange();
    media.addEventListener("change", onChange);

    return (): void => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  return prefersReducedMotion;
}
