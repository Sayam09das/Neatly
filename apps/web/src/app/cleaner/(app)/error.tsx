"use client";

import type { ReactElement } from "react";
import { CleanerErrorState } from "@/components/cleaner/cleaner-states";

interface CleanerErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CleanerErrorPage({
  reset,
}: CleanerErrorPageProps): ReactElement {
  return <CleanerErrorState onRetry={reset} />;
}
