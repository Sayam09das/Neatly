import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { authRegisterCopy, authRegisterVisual } from "@/config/auth-ui";

export const metadata: Metadata = {
  description: authRegisterCopy.description,
  robots: {
    follow: false,
    index: false,
  },
  title: authRegisterCopy.title,
};

export default function AdminRegisterPage(): ReactElement {
  return (
    <AuthShell image={authRegisterVisual}>
      <RegisterForm />
    </AuthShell>
  );
}
