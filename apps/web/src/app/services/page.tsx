import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { CustomerEmptyState } from "@/components/customer/customer-states";
import { customerEmptyCopy, customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.services.title,
};

export default function ServicesPage(): ReactElement {
  return (
    <CustomerPublicFrame>
      <section className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerSurfaceCopy.services.heading}
        </h1>
        <div className="mt-8">
          <CustomerEmptyState
            description={customerEmptyCopy.services.description}
            title={customerEmptyCopy.services.title}
          />
        </div>
      </section>
    </CustomerPublicFrame>
  );
}
