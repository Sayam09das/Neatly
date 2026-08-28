import { redirect } from "next/navigation";
import { AUTH_ADMIN_VERIFY_EMAIL_PATH } from "@/config/auth";
import { withSearchParams } from "@/lib/auth/frontend-views";

interface VerifyEmailAliasPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VerifyEmailAliasPage({
  searchParams,
}: VerifyEmailAliasPageProps): Promise<never> {
  const params = await searchParams;
  redirect(withSearchParams(AUTH_ADMIN_VERIFY_EMAIL_PATH, params));
}
