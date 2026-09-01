import type { ReactElement } from "react";
import { landingFinalCta } from "@/config/landing";
import type { HomeCta } from "@/lib/customer/home";
import { FinalCtaScene } from "./final-cta-scene";

interface FinalCtaProps {
  accountCta?: HomeCta | null;
}

export function FinalCta({ accountCta = null }: FinalCtaProps): ReactElement {
  return (
    <section
      aria-labelledby={landingFinalCta.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="quote"
    >
      <FinalCtaScene accountCta={accountCta} />
    </section>
  );
}
