import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { AdminNewsletterDetails } from "@/components/admin/newsletter/newsletter-details";
import { adminNewsletterCopy } from "@/config/admin-newsletter";

export const metadata: Metadata = {
  title: adminNewsletterCopy.detailsTitle,
};

interface AdminNewsletterDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminNewsletterDetailsPage({
  params,
}: AdminNewsletterDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return <AdminNewsletterDetails subscriberId={id} />;
}
