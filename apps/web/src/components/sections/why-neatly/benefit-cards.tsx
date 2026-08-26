import type { ReactElement } from "react";
import { landingWhyNeatly } from "@/config/landing";
import { BenefitCard } from "./benefit-card";

export function BenefitCards(): ReactElement {
  const lastBenefitIndex = landingWhyNeatly.benefits.length - 1;

  return (
    <ul
      className="mt-16 grid gap-grid md:grid-cols-2 lg:grid-cols-3 lg:items-end"
      data-why-cards
    >
      {landingWhyNeatly.benefits.map((benefit, index) => (
        <li
          className={
            index === lastBenefitIndex
              ? "md:col-span-2 md:mx-auto md:w-full md:max-w-xl lg:col-span-1 lg:mx-0 lg:max-w-none"
              : undefined
          }
          data-why-card
          key={benefit.title}
        >
          <BenefitCard benefit={benefit} />
        </li>
      ))}
    </ul>
  );
}
