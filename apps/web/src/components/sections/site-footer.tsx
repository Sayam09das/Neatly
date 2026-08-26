import type { ReactElement } from "react";
import { FooterScene } from "@/components/sections/footer-scene";

export function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-border bg-background">
      <FooterScene />
    </footer>
  );
}
