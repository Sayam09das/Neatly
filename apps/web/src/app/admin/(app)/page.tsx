import type { Metadata } from "next";
import type { ReactElement } from "react";
import { adminHomeCopy } from "@/config/admin-ui";

export const metadata: Metadata = {
  title: adminHomeCopy.title,
};

export default function AdminHomePage(): ReactElement {
  return (
    <section className="max-w-prose">
      <h1 className="text-h1 text-foreground tracking-tight">
        {adminHomeCopy.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {adminHomeCopy.description}
      </p>
    </section>
  );
}
