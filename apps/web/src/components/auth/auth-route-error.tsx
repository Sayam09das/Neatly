"use client";

import type { ReactElement } from "react";
import { AuthErrorFallback } from "@/components/auth/auth-error-fallback";
import { AuthShell } from "@/components/auth/auth-shell";

interface AuthRouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthRouteError({
  reset,
}: AuthRouteErrorProps): ReactElement {
  return (
    <AuthShell>
      <AuthErrorFallback reset={reset} />
    </AuthShell>
  );
}
