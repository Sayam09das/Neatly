import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AboutPage } from "@/components/about-page";
import { aboutMetadata } from "@/config/about";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: aboutMetadata.description,
  openGraph: {
    description: aboutMetadata.description,
    title: aboutMetadata.title,
  },
  title: aboutMetadata.title,
};

export default async function AboutRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <AboutPage session={session} />;
}
