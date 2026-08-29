import type { ReactElement, ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/sections/site-footer";

interface CustomerPublicFrameProps {
  children: ReactNode;
}

export function CustomerPublicFrame({
  children,
}: CustomerPublicFrameProps): ReactElement {
  return (
    <>
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navbar />
      <main
        className="mx-auto w-full min-w-0 max-w-page px-gutter py-section"
        id="main-content"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
