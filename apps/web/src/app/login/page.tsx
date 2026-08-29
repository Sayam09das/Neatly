import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { authLoginCopy, authLoginVisual } from "@/config/auth-ui";

export const metadata: Metadata = {
  description: authLoginCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: "Sign in",
};

export default function CustomerLoginPage(): ReactElement {
  return (
    <AuthShell image={authLoginVisual}>
      <LoginForm mode="customer" />
    </AuthShell>
  );
}
