"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";

interface AuthSubmitButtonProps {
  isSubmitting: boolean;
  label: string;
  submittingLabel: string;
}

export function AuthSubmitButton({
  isSubmitting,
  label,
  submittingLabel,
}: AuthSubmitButtonProps): ReactElement {
  return (
    <Button
      className="w-full"
      disabled={isSubmitting}
      isLoading={isSubmitting}
      type="submit"
      variant="secondary"
    >
      {isSubmitting ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
          />
          {submittingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
