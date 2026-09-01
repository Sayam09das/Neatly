import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ProcessPage } from "@/components/process-page";
import { processMetadata } from "@/config/process";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const metadata: Metadata = {
  description: processMetadata.description,
  openGraph: {
    description: processMetadata.description,
    title: processMetadata.title,
  },
  title: processMetadata.title,
};

export default async function ProcessRoute(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <ProcessPage session={session} />;
}
