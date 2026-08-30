import { redirect } from "next/navigation";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";

export default function AdminIndexPage(): never {
  redirect(AUTH_ADMIN_HOME_PATH);
}
