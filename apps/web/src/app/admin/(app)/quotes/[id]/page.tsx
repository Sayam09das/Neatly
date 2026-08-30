import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { AdminQuoteDetails } from "@/components/admin/quotes/quote-details";
import { adminQuoteCopy } from "@/config/admin-quotes";

export const metadata: Metadata = {
  title: adminQuoteCopy.detailsTitle,
};

interface AdminQuoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminQuoteDetailsPage({
  params,
}: AdminQuoteDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return <AdminQuoteDetails quoteId={id} />;
}
