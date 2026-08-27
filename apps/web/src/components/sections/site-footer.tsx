import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { FooterScene } from "@/components/sections/footer-scene";

interface SiteFooterProps {
  surface?: "photo" | "solid";
}

export function SiteFooter({
  surface = "solid",
}: SiteFooterProps): ReactElement {
  return (
    <footer
      className={cn(
        "text-secondary-foreground",
        surface === "solid" ? "bg-secondary" : "bg-transparent",
      )}
    >
      <FooterScene />
    </footer>
  );
}
