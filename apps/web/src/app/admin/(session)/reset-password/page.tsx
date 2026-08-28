import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { authResetPasswordCopy } from "@/config/auth-ui";
import { parseResetLinkView, readSearchParam } from "@/lib/auth/frontend-views";

export const metadata: Metadata = {
  description: authResetPasswordCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: authResetPasswordCopy.title,
};

interface AdminResetPasswordPageProps {
  searchParams: Promise<{
    link?: string | string[];
  }>;
}

export default async function AdminResetPasswordPage({
  searchParams,
}: AdminResetPasswordPageProps): Promise<ReactElement> {
  const params = await searchParams;

  return (
    <AuthShell>
      <ResetPasswordForm
        linkView={parseResetLinkView(readSearchParam(params.link))}
      />
    </AuthShell>
  );
}
