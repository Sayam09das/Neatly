export const easings = {
  standard: {
    css: "cubic-bezier(0.2, 0, 0, 1)",
    framer: [0.2, 0, 0, 1] as const,
    gsap: "power2.out",
  },
  emphasized: {
    css: "cubic-bezier(0.2, 0, 0, 1)",
    framer: [0.2, 0, 0, 1] as const,
    gsap: "power2.out",
  },
  enter: {
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    framer: [0.16, 1, 0.3, 1] as const,
    gsap: "power3.out",
  },
  exit: {
    css: "cubic-bezier(0.7, 0, 0.84, 0)",
    framer: [0.7, 0, 0.84, 0] as const,
    gsap: "power2.in",
  },
} as const;

export type EasingToken = keyof typeof easings;
