import Link from "next/link";
import type { ReactElement } from "react";
import { customerServicesCopy } from "@/config/customer";
import {
  type CustomerServicesQuery,
  customerServicesHref,
} from "@/lib/customer/catalog";
import type { CustomerServicePagination } from "@/types/customer";

interface ServicesDiscoveryPaginationProps {
  pagination: CustomerServicePagination;
  query: CustomerServicesQuery;
}

export function ServicesDiscoveryPagination({
  pagination,
  query,
}: ServicesDiscoveryPaginationProps): ReactElement | null {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousHref =
    pagination.page > 1
      ? customerServicesHref({ ...query, page: pagination.page - 1 })
      : null;
  const nextHref =
    pagination.page < pagination.totalPages
      ? customerServicesHref({ ...query, page: pagination.page + 1 })
      : null;

  return (
    <nav
      aria-label={customerServicesCopy.paginationLabel}
      className="mt-10 flex flex-wrap items-center justify-between gap-4"
      data-slot="customer-services-pagination"
    >
      <PaginationControl
        href={previousHref}
        label={customerServicesCopy.paginationPrevious}
      />
      <p className="text-body-small text-muted-foreground">
        {`Page ${String(pagination.page)} of ${String(pagination.totalPages)}`}
      </p>
      <PaginationControl
        href={nextHref}
        label={customerServicesCopy.paginationNext}
      />
    </nav>
  );
}

interface PaginationControlProps {
  href: string | null;
  label: string;
}

function PaginationControl({
  href,
  label,
}: PaginationControlProps): ReactElement {
  if (href === null) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex min-h-touch items-center text-button text-muted-foreground"
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      href={href}
    >
      {label}
    </Link>
  );
}
