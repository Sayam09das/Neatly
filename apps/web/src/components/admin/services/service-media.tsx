"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import { ServicesIcon } from "@/components/admin/admin-icons";

interface ServiceMediaProps {
  coverImageUrl: string | null;
}

export function ServiceMedia({
  coverImageUrl,
}: ServiceMediaProps): ReactElement {
  const src = usableCoverImage(coverImageUrl);

  return (
    <span
      aria-hidden="true"
      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-foreground"
      data-slot="service-media"
    >
      {src !== null ? (
        <Image
          alt=""
          className="object-cover motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:scale-105"
          fill
          sizes="40px"
          src={src}
          unoptimized
        />
      ) : (
        <ServicesIcon className="size-5" />
      )}
    </span>
  );
}

function usableCoverImage(src: string | null): string | null {
  if (src === null || src.trim() === "") {
    return null;
  }

  if (src.startsWith("/") && !src.startsWith("//")) {
    return src;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" ? src : null;
  } catch {
    return null;
  }
}
