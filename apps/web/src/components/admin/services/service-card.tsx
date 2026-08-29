"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { ServiceMedia } from "@/components/admin/services/service-media";
import { ServiceRowActions } from "@/components/admin/services/service-row-actions";
import { ServiceStatusBadge } from "@/components/admin/services/service-status-badge";
import {
  getServiceDescriptionLabel,
  getServiceNameLabel,
  getServiceSlugLabel,
} from "@/lib/admin/services";
import type { AdminService } from "@/types/admin-service";

interface ServiceCardProps {
  onMutated?: () => void;
  service: AdminService;
}

export function ServiceCard({
  onMutated,
  service,
}: ServiceCardProps): ReactElement {
  const slug = getServiceSlugLabel(service.slug);

  return (
    <motion.article
      className="group rounded-lg border border-border bg-surface p-4"
      data-slot="service-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ServiceMedia coverImageUrl={service.coverImageUrl} />
          <div className="min-w-0">
            <p className="truncate text-body-small font-medium text-foreground">
              {getServiceNameLabel(service.name)}
            </p>
            {slug !== null ? (
              <p className="mt-1 truncate text-caption text-muted-foreground">
                {slug}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ServiceStatusBadge isActive={service.isActive} />
          <ServiceRowActions onMutated={onMutated} service={service} />
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-caption text-muted-foreground">
        {getServiceDescriptionLabel(service.shortDescription)}
      </p>
    </motion.article>
  );
}

interface ServiceCardListProps {
  onMutated?: () => void;
  services: readonly AdminService[];
}

export function ServiceCardList({
  onMutated,
  services,
}: ServiceCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="service-card-list"
    >
      {services.map((service) => (
        <ServiceCard key={service.id} onMutated={onMutated} service={service} />
      ))}
    </Card>
  );
}
