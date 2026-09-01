import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalPage } from "@/components/legal-page";
import { termsOfService } from "@/config/legal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: termsOfService.metadata.description,
  openGraph: {
    description: termsOfService.metadata.description,
    title: termsOfService.metadata.title,
  },
  title: termsOfService.metadata.title,
};

export default async function TermsRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <LegalPage document={termsOfService} session={session} />;
}
