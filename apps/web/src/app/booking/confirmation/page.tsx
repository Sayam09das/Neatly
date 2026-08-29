import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.bookingConfirmation.title,
};

export default function BookingConfirmationIndexPage(): ReactElement {
  notFound();
}
