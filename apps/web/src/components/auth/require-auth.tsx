"use client";

import type { ReactElement, ReactNode } from "react";
import {
  AuthEntrance,
  AuthEntranceItem,
} from "@/components/auth/auth-entrance";
import { AuthTextLink } from "@/components/auth/auth-field";
import { AuthStatus } from "@/components/auth/auth-status";
import { BrandLink } from "@/components/layout/navbar/brand-link";
import {
  authFormPaths,
  authRequiredCopy,
  authSessionLoadingCopy,
} from "@/config/auth-ui";
import { getFrontendAuthStatus } from "@/services/auth-form.service";
import type { FrontendAuthStatus } from "@/types/auth-form";

interface RequireAuthProps {
  children: ReactNode;
  loginHref?: string;
  status?: FrontendAuthStatus;
}

export function RequireAuth({
  children,
  loginHref = authFormPaths.login,
  status = getFrontendAuthStatus(),
}: RequireAuthProps): ReactElement {
  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "unknown") {
    return (
      <AuthEntrance>
        <AuthEntranceItem className="mb-8">
          <BrandLink className="text-foreground focus-visible:ring-offset-background" />
        </AuthEntranceItem>
        <AuthEntranceItem delay="short">
          <AuthStatus
            message={authSessionLoadingCopy.description}
            title={authSessionLoadingCopy.heading}
            titleId="auth-session-loading-heading"
            tone="loading"
          />
        </AuthEntranceItem>
      </AuthEntrance>
    );
  }

  return (
    <AuthEntrance>
      <AuthEntranceItem className="mb-8">
        <BrandLink className="text-foreground focus-visible:ring-offset-background" />
      </AuthEntranceItem>
      <AuthEntranceItem delay="short">
        <AuthStatus
          action={
            <AuthTextLink href={loginHref}>
              {authRequiredCopy.action}
            </AuthTextLink>
          }
          live={false}
          message={authRequiredCopy.description}
          title={authRequiredCopy.heading}
          titleId={authRequiredCopy.headingId}
          tone="info"
        />
      </AuthEntranceItem>
    </AuthEntrance>
  );
}

export const AuthGate = RequireAuth;
export const ProtectedRoute = RequireAuth;
