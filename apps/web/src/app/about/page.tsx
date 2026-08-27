import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AboutPage } from "@/components/about-page";
import { aboutMetadata } from "@/config/about";

export const metadata: Metadata = {
  description: aboutMetadata.description,
  openGraph: {
    description: aboutMetadata.description,
    title: aboutMetadata.title,
  },
  title: aboutMetadata.title,
};

export default function AboutRoute(): ReactElement {
  return <AboutPage />;
}
