import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { PortfolioLoading } from "@/components/admin/portfolio/portfolio-states";
import { adminPortfolioCopy } from "@/config/admin-portfolio";

export default function AdminPortfolioLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminPortfolioCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminPortfolioCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <PortfolioLoading />
      </Card>
    </div>
  );
}
