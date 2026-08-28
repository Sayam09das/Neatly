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
  const isLocalImage = isLocalServiceImage(coverImageUrl);

  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-foreground"
      data-slot="service-media"
    >
      {isLocalImage ? (
        <Image
          alt=""
          className="size-10 object-cover motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:scale-105"
          height={40}
          src={coverImageUrl}
          width={40}
        />
      ) : (
        <ServicesIcon className="size-5" />
      )}
    </span>
  );
}

function isLocalServiceImage(src: string | null): src is string {
  return src?.startsWith("/") === true && !src.startsWith("//");
}
