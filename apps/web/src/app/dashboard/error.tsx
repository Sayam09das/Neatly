"use client";

import type { ReactElement } from "react";
import { CustomerErrorState } from "@/components/customer/customer-states";

interface CustomerErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerErrorPage({
  reset,
}: CustomerErrorPageProps): ReactElement {
  return <CustomerErrorState onRetry={reset} />;
}
