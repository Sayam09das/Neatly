"use client";

import { Button } from "@neatly/ui";
import { type ReactElement, useState } from "react";
import { adminReviewCopy } from "@/config/admin-reviews";
import { getReviewPreview } from "@/lib/admin/reviews";

interface ReviewTextProps {
  content: string | null;
}

export function ReviewText({ content }: ReviewTextProps): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const preview = getReviewPreview(content);
  const fullText = content?.trim() || adminReviewCopy.emptyValue;

  return (
    <div data-slot="review-text">
      <p className="text-body-small leading-relaxed text-foreground">
        {expanded ? fullText : preview.text}
      </p>
      {preview.isCollapsed ? (
        <Button
          className="mt-1 h-auto min-h-touch px-0"
          onClick={(): void => {
            setExpanded((current) => !current);
          }}
          size="sm"
          type="button"
          variant="link"
        >
          {expanded ? adminReviewCopy.readLess : adminReviewCopy.readMore}
        </Button>
      ) : null}
    </div>
  );
}
