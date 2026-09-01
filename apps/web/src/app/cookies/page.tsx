import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LegalPage } from "@/components/legal-page";
import { cookiePolicy } from "@/config/legal";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: cookiePolicy.metadata.description,
  openGraph: {
    description: cookiePolicy.metadata.description,
    title: cookiePolicy.metadata.title,
  },
  title: cookiePolicy.metadata.title,
};

export default async function CookiesRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <LegalPage document={cookiePolicy} session={session} />;
}
