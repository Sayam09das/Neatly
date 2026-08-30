import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";
import { authVerifyEmailCopy } from "@/config/auth-ui";
import {
  parseVerifyEmailView,
  readSearchParam,
} from "@/lib/auth/frontend-views";

export const metadata: Metadata = {
  description: authVerifyEmailCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: authVerifyEmailCopy.title,
};

interface VerifyEmailPageProps {
  searchParams: Promise<{
    email?: string | string[];
    status?: string | string[];
    token?: string | string[];
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const view = parseVerifyEmailView(readSearchParam(params.status));

  return (
    <AuthShell>
      <VerifyEmailPanel
        email={readSearchParam(params.email)}
        initialView={view ?? "idle"}
        token={readSearchParam(params.token) ?? null}
      />
    </AuthShell>
  );
}
