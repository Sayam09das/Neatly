import type { ReactElement } from "react";

interface CustomerSurfaceProps {
  description: string;
  heading: string;
}

export function CustomerSurface({
  description,
  heading,
}: CustomerSurfaceProps): ReactElement {
  return (
    <section className="max-w-prose" data-slot="customer-surface">
      <h1 className="text-h1 text-foreground tracking-tight">{heading}</h1>
      <p className="mt-4 text-body text-muted-foreground">{description}</p>
    </section>
  );
}
