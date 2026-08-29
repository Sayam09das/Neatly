import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { FooterScene } from "@/components/sections/footer-scene";
import type {
  CustomerNavbarArea,
  CustomerNavbarSession,
} from "@/lib/customer/navbar";

interface SiteFooterProps {
  area?: CustomerNavbarArea;
  session?: CustomerNavbarSession | null;
  surface?: "photo" | "solid";
}

export function SiteFooter({
  area = "public",
  session = null,
  surface = "solid",
}: SiteFooterProps): ReactElement {
  return (
    <footer
      className={cn(
        "text-secondary-foreground",
        surface === "solid" ? "bg-secondary" : "bg-transparent",
      )}
    >
      <FooterScene area={area} session={session} />
    </footer>
  );
}
