"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import {
  WORK_NEXT_PHOTO_LABEL,
  WORK_PREVIOUS_PHOTO_LABEL,
} from "./work-animation";

interface WorkGalleryNavProps {
  canNext: boolean;
  canPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  position: string;
}

function NavArrow({
  direction,
}: {
  direction: "next" | "previous";
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

export function WorkGalleryNav({
  canNext,
  canPrevious,
  onNext,
  onPrevious,
  position,
}: WorkGalleryNavProps): ReactElement {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <p aria-live="polite" className="text-label text-muted-foreground">
        {position}
      </p>
      <div className="flex items-center gap-3">
        <Button
          aria-label={WORK_PREVIOUS_PHOTO_LABEL}
          disabled={!canPrevious}
          onClick={onPrevious}
          type="button"
          variant="outline"
        >
          <NavArrow direction="previous" />
          Previous
        </Button>
        <Button
          aria-label={WORK_NEXT_PHOTO_LABEL}
          disabled={!canNext}
          onClick={onNext}
          type="button"
          variant="outline"
        >
          Next
          <NavArrow direction="next" />
        </Button>
      </div>
    </div>
  );
}
