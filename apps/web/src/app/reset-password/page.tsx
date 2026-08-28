import { redirect } from "next/navigation";
import { AUTH_ADMIN_RESET_PASSWORD_PATH } from "@/config/auth";
import { withSearchParams } from "@/lib/auth/frontend-views";

interface ResetPasswordAliasPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResetPasswordAliasPage({
  searchParams,
}: ResetPasswordAliasPageProps): Promise<never> {
  const params = await searchParams;
  redirect(withSearchParams(AUTH_ADMIN_RESET_PASSWORD_PATH, params));
}
