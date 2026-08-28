"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { CustomerAvatar } from "@/components/admin/customers/customer-avatar";
import { CustomerRowActions } from "@/components/admin/customers/customer-row-actions";
import { CustomerStatusBadge } from "@/components/admin/customers/customer-status-badge";
import { adminCustomerCopy } from "@/config/admin-customers";
import {
  formatCustomerJoinedDate,
  getCustomerBookingCountLabel,
  getCustomerContactLabel,
  getCustomerNameLabel,
} from "@/lib/admin/customers";
import type { AdminCustomer } from "@/types/admin-customer";

interface CustomerCardProps {
  customer: AdminCustomer;
}

export function CustomerCard({ customer }: CustomerCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="customer-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar name={customer.name} />
          <div className="min-w-0">
            <p className="truncate text-body-small font-medium text-foreground">
              {getCustomerNameLabel(customer.name)}
            </p>
            <p className="mt-1 truncate text-caption text-muted-foreground">
              {getCustomerContactLabel(customer.email, customer.phone)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <CustomerStatusBadge label={customer.statusLabel} />
          <CustomerRowActions />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <CustomerCardField
          label={adminCustomerCopy.tableBookings}
          value={getCustomerBookingCountLabel(customer.bookingCount)}
        />
        <CustomerCardField
          label={adminCustomerCopy.tableJoined}
          value={formatCustomerJoinedDate(customer.joinedAt)}
        />
      </dl>
    </motion.article>
  );
}

interface CustomerCardFieldProps {
  label: string;
  value: string;
}

function CustomerCardField({
  label,
  value,
}: CustomerCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface CustomerCardListProps {
  customers: readonly AdminCustomer[];
}

export function CustomerCardList({
  customers,
}: CustomerCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="customer-card-list"
    >
      {customers.map((customer) => (
        <CustomerCard customer={customer} key={customer.id} />
      ))}
    </Card>
  );
}
