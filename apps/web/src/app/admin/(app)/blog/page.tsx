import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminBlog } from "@/components/admin/blog/admin-blog";
import { adminBlogCopy } from "@/config/admin-blog";

export const metadata: Metadata = {
  title: adminBlogCopy.title,
};

export default function AdminBlogPage(): ReactElement {
  return (
    <Suspense fallback={<AdminBlog presentation={{ status: "loading" }} />}>
      <AdminBlog />
    </Suspense>
  );
}
