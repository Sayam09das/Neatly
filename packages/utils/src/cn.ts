import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-body",
        "text-body-small",
        "text-caption",
        "text-label",
        "text-button",
      ],
    },
  },
});

export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}
