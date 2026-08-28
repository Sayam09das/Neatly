import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { authForgotPasswordCopy } from "@/config/auth-ui";

export const metadata: Metadata = {
  description: authForgotPasswordCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: authForgotPasswordCopy.title,
};

export default function AdminForgotPasswordPage(): ReactElement {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
