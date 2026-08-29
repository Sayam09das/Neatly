import { notFound } from "next/navigation";
import type { ReactElement } from "react";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<ReactElement> {
  const { slug } = await params;

  if (slug.trim() === "") {
    notFound();
  }

  notFound();
}
