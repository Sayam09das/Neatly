"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import {
  AuthEntrance,
  AuthEntranceItem,
} from "@/components/auth/auth-entrance";
import { AuthTextLink } from "@/components/auth/auth-field";
import { AuthStatus } from "@/components/auth/auth-status";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import { authErrorCopy, authFormPaths } from "@/config/auth-ui";

interface AuthErrorFallbackProps {
  reset: () => void;
}

export function AuthErrorFallback({
  reset,
}: AuthErrorFallbackProps): ReactElement {
  return (
    <AuthEntrance>
      <AuthEntranceItem className="mb-8">
        <BrandLink className="text-foreground focus-visible:ring-offset-background" />
      </AuthEntranceItem>
      <AuthEntranceItem delay="short">
        <AuthStatus
          action={
            <>
              <Button onClick={reset} type="button" variant="secondary">
                {authErrorCopy.action}
              </Button>
              <AuthTextLink href={authFormPaths.login}>
                {authErrorCopy.backToLogin}
              </AuthTextLink>
            </>
          }
          live={false}
          message={authErrorCopy.description}
          title={authErrorCopy.heading}
          titleId="auth-error-heading"
          tone="error"
        />
      </AuthEntranceItem>
    </AuthEntrance>
  );
}
