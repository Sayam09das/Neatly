import { notFound, redirect } from "next/navigation";
import {
  CUSTOMER_LOGIN_PATH,
  customerDashboardServiceApplyPath,
} from "@/config/customer";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSafeServiceSlug } from "@/lib/auth/paths";

export const dynamic = "force-dynamic";

interface ServiceApplyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceApplyPage({
  params,
}: ServiceApplyPageProps): Promise<void> {
  const { slug } = await params;

  if (!isSafeServiceSlug(slug)) {
    notFound();
  }

  const destination = customerDashboardServiceApplyPath(slug);
  const user = await getCurrentUser();

  if (user === null) {
    redirect(`${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(destination)}`);
  }

  redirect(destination);
}
