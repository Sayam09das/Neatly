import { redirect } from "next/navigation";
import { AUTH_ADMIN_FORGOT_PASSWORD_PATH } from "@/config/auth";

export default function ForgotPasswordAliasPage(): never {
  redirect(AUTH_ADMIN_FORGOT_PASSWORD_PATH);
}
