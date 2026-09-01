import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/config/legal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: privacyPolicy.metadata.description,
  openGraph: {
    description: privacyPolicy.metadata.description,
    title: privacyPolicy.metadata.title,
  },
  title: privacyPolicy.metadata.title,
};

export default async function PrivacyRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <LegalPage document={privacyPolicy} session={session} />;
}
