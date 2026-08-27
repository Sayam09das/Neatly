"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { formatTestimonialIndex } from "./testimonial-index";

interface TestimonialNavigationProps {
  activeIndex: number;
  count: number;
  getSelectLabel?: (label: string, paddedCount: string) => string;
  nextLabel?: string;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  previousLabel?: string;
  regionLabel?: string;
}

function NavArrow({
  direction,
}: {
  direction: "previous" | "next";
}): ReactElement {
  const isPrevious = direction === "previous";

  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d={isPrevious ? "M13 8H3M7 4 3 8l4 4" : "M3 8h10M9 4l4 4-4 4"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function TestimonialNavigation({
  activeIndex,
  count,
  getSelectLabel,
  nextLabel = "Next testimonial",
  onNext,
  onPrevious,
  onSelect,
  previousLabel = "Previous testimonial",
  regionLabel = "Customer stories",
}: TestimonialNavigationProps): ReactElement {
  const indexes = Array.from({ length: count }, (_, index) => index);
  const paddedCount = String(count).padStart(2, "0");

  return (
    <nav
      aria-label={regionLabel}
      className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <ol className="flex min-w-0 flex-1 items-center gap-3">
        {indexes.map((index) => {
          const isActive = index === activeIndex;
          const label = formatTestimonialIndex(index);
          const selectLabel =
            getSelectLabel?.(label, paddedCount) ??
            `Show story ${label} of ${paddedCount}`;

          return (
            <li className="flex min-w-0 flex-1 items-center gap-3" key={label}>
              <button
                aria-current={isActive ? "true" : undefined}
                aria-label={selectLabel}
                className={cn(
                  "text-label uppercase transition-colors duration-normal ease-standard",
                  "min-h-touch min-w-touch rounded-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={(): void => {
                  onSelect(index);
                }}
                type="button"
              >
                {label}
              </button>
              {index < count - 1 ? (
                <div
                  aria-hidden="true"
                  className="h-px min-w-0 flex-1 bg-border"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3">
        <Button
          aria-label={previousLabel}
          onClick={onPrevious}
          type="button"
          variant="outline"
        >
          <NavArrow direction="previous" />
          Previous
        </Button>
        <Button
          aria-label={nextLabel}
          onClick={onNext}
          type="button"
          variant="outline"
        >
          Next
          <NavArrow direction="next" />
        </Button>
      </div>
    </nav>
  );
}
