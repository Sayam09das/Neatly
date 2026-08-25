import type { ReactElement, ReactNode } from "react";

export interface LandingSectionProps {
  children: ReactNode;
  id: string;
  labelledBy: string;
}

export function LandingSection({
  children,
  id,
  labelledBy,
}: LandingSectionProps): ReactElement {
  return (
    <section
      aria-labelledby={labelledBy}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id={id}
    >
      {children}
    </section>
  );
}
