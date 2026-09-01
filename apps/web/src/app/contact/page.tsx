import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ContactPage } from "@/components/contact-page";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";
import { contactMetadata } from "@/config/contact";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: contactMetadata.description,
  openGraph: {
    description: contactMetadata.description,
    title: contactMetadata.title,
  },
  title: contactMetadata.title,
};

export default async function ContactRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return (
    <>
      <LocalBusinessJsonLd />
      <ContactPage session={session} />
    </>
  );
}
