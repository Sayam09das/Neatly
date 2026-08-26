"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { landingCtas, landingServices } from "@/config/landing";
import { ServiceCard } from "./service-card";
import { useServicesAnimation } from "./use-services-animation";

export function ServicesScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useServicesAnimation({ rootRef });

  return (
    <div className="relative" ref={rootRef}>
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="text-label text-accent uppercase"
          data-services-header-item
        >
          {landingServices.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-secondary-foreground tracking-tight"
          data-services-header-item
          id={landingServices.headingId}
        >
          {landingServices.headingLead}{" "}
          <span className="text-accent">{landingServices.headingEmphasis}</span>
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
          data-services-header-item
        >
          {landingServices.intro}
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-px w-24 origin-left bg-accent/70"
          data-services-rule
        />
      </div>
      <ul className="mt-16 grid gap-grid md:grid-cols-2">
        {landingServices.items.map((service) => (
          <li
            className={service.featured ? "md:col-span-2" : undefined}
            data-service-card
            key={service.title}
          >
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button
          asChild
          className="border-secondary-foreground/40 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
          variant="outline"
        >
          <Link href={landingCtas.secondary.href}>
            {landingCtas.secondary.label}
          </Link>
        </Button>
      </div>
    </div>
  );
}
