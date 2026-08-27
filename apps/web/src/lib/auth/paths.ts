import { AUTH_PUBLIC_ADMIN_PATHS } from "@/config/auth";

export function isPublicAdminPath(pathname: string): boolean {
  return AUTH_PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
