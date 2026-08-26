import type { ReactElement } from "react";
import { landingTrustProof } from "@/config/landing";
import { ProofMedia } from "./proof-media";
import { ProofScene } from "./proof-scene";
import { TrustItem } from "./trust-item";

export function TrustSection(): ReactElement {
  return (
    <section
      aria-labelledby={landingTrustProof.headingId}
      className="bg-background text-foreground"
      id="proof"
    >
      <ProofScene>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-16">
          <div className="order-1 lg:order-2 lg:col-span-5" data-proof-copy>
            <p className="text-label text-primary uppercase" data-proof-eyebrow>
              {landingTrustProof.eyebrow}
            </p>
            <div className="mt-4 max-w-xl" data-proof-heading-mask>
              <h2
                className="text-display tracking-tight"
                data-proof-heading
                id={landingTrustProof.headingId}
              >
                {landingTrustProof.headingLead}{" "}
                <span className="block">{landingTrustProof.headingTail}</span>
              </h2>
            </div>
            <p
              className="mt-6 max-w-xl text-body text-muted-foreground"
              data-proof-intro
            >
              {landingTrustProof.intro}
            </p>
          </div>
          <div
            className="order-2 lg:order-1 lg:col-span-7 lg:row-span-2"
            data-proof-media
          >
            <ProofMedia />
          </div>
          <ol
            className="order-3 space-y-8 lg:order-2 lg:col-span-5"
            data-proof-list
          >
            {landingTrustProof.items.map((item) => (
              <li data-proof-item key={item.number}>
                <TrustItem item={item} />
              </li>
            ))}
          </ol>
        </div>
      </ProofScene>
    </section>
  );
}
