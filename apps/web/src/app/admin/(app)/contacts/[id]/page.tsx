import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { AdminContactDetails } from "@/components/admin/contacts/contact-details";
import { adminContactCopy } from "@/config/admin-contacts";

export const metadata: Metadata = {
  title: adminContactCopy.detailsTitle,
};

interface AdminContactDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminContactDetailsPage({
  params,
}: AdminContactDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return <AdminContactDetails contactId={id} />;
}
