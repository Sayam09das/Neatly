import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { AdminPortfolioDetails } from "@/components/admin/portfolio/portfolio-details";
import { adminPortfolioCopy } from "@/config/admin-portfolio";

export const metadata: Metadata = {
  title: adminPortfolioCopy.detailsTitle,
};

interface AdminPortfolioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPortfolioDetailsPage({
  params,
}: AdminPortfolioDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return <AdminPortfolioDetails projectId={id} />;
}
