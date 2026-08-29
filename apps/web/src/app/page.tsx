import type { ReactElement } from "react";
import { LandingPage } from "@/components/landing-page";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export default async function HomePage(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());

  return <LandingPage session={session} />;
}
