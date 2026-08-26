"use client";

import type { ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { useProofAnimation } from "./use-proof-animation";

interface ProofSceneProps {
  children: ReactNode;
}

export function ProofScene({ children }: ProofSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useProofAnimation({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      {children}
    </div>
  );
}
