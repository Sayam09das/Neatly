import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminPortfolio } from "@/components/admin/portfolio/admin-portfolio";
import { adminPortfolioCopy } from "@/config/admin-portfolio";

export const metadata: Metadata = {
  title: adminPortfolioCopy.title,
};

export default function AdminPortfolioPage(): ReactElement {
  return (
    <Suspense
      fallback={<AdminPortfolio presentation={{ status: "loading" }} />}
    >
      <AdminPortfolio />
    </Suspense>
  );
}
