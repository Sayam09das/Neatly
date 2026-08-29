import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.bookingDetail.title,
};

interface CustomerBookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerBookingDetailPage({
  params,
}: CustomerBookingDetailPageProps): Promise<ReactElement> {
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  return (
    <CustomerSurface
      description={customerSurfaceCopy.bookingDetail.description}
      heading={customerSurfaceCopy.bookingDetail.heading}
    />
  );
}
