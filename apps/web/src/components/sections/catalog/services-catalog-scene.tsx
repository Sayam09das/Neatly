"use client";

import { type ReactElement, type ReactNode, useCallback, useRef } from "react";
import { useAboutSectionAnimation } from "@/components/sections/about/use-about-section-animation";
import { createCatalogAnimation } from "./services-catalog-animation";

interface ServicesCatalogSceneProps {
  children: ReactNode;
}

export function ServicesCatalogScene({
  children,
}: ServicesCatalogSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createCatalogAnimation(root, {
        compact: options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <div className="mx-auto max-w-page px-gutter py-section" ref={rootRef}>
      {children}
    </div>
  );
}
