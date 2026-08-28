"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { ServiceMedia } from "@/components/admin/services/service-media";
import { ServiceRowActions } from "@/components/admin/services/service-row-actions";
import { ServiceStatusBadge } from "@/components/admin/services/service-status-badge";
import { adminServiceCopy } from "@/config/admin-services";
import {
  getServiceDescriptionLabel,
  getServiceNameLabel,
  getServiceSlugLabel,
} from "@/lib/admin/services";
import type { AdminService } from "@/types/admin-service";

interface ServicesDesktopTableProps {
  services: readonly AdminService[];
}

export function ServicesDesktopTable({
  services,
}: ServicesDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminServiceCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminServiceCopy.tableService}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminServiceCopy.tableDescription}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminServiceCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminServiceCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <ServiceTableRow key={service.id} service={service} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface ServiceTableRowProps {
  service: AdminService;
}

function ServiceTableRow({ service }: ServiceTableRowProps): ReactElement {
  const slug = getServiceSlugLabel(service.slug);

  return (
    <motion.tr
      className="group border-b border-border last:border-b-0"
      data-slot="service-table-row"
      variants={fade}
    >
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <ServiceMedia coverImageUrl={service.coverImageUrl} />
          <div className="min-w-0">
            <p className="truncate text-body-small text-foreground">
              {getServiceNameLabel(service.name)}
            </p>
            {slug !== null ? (
              <p className="mt-1 truncate text-caption text-muted-foreground">
                {slug}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="max-w-xs px-4 py-3 text-body-small text-muted-foreground">
        <span className="line-clamp-2">
          {getServiceDescriptionLabel(service.shortDescription)}
        </span>
      </td>
      <td className="px-4 py-3">
        <ServiceStatusBadge isActive={service.isActive} />
      </td>
      <td className="px-4 py-3">
        <ServiceRowActions />
      </td>
    </motion.tr>
  );
}
