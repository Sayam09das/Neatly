import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { AdminBlogDetails } from "@/components/admin/blog/blog-details";
import { adminBlogCopy } from "@/config/admin-blog";

export const metadata: Metadata = {
  title: adminBlogCopy.detailsTitle,
};

interface AdminBlogDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogDetailsPage({
  params,
}: AdminBlogDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return <AdminBlogDetails postId={id} />;
}
