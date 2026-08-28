"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
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

interface CustomersDesktopTableProps {
  customers: readonly AdminCustomer[];
}

export function CustomersDesktopTable({
  customers,
}: CustomersDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminCustomerCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableCustomer}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableContact}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableBookings}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableJoined}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCustomerCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerTableRow customer={customer} key={customer.id} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface CustomerTableRowProps {
  customer: AdminCustomer;
}

function CustomerTableRow({ customer }: CustomerTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="customer-table-row"
      variants={fade}
    >
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar name={customer.name} />
          <span className="truncate text-body-small text-foreground">
            {getCustomerNameLabel(customer.name)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getCustomerContactLabel(customer.email, customer.phone)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getCustomerBookingCountLabel(customer.bookingCount)}
      </td>
      <td className="px-4 py-3">
        <CustomerStatusBadge label={customer.statusLabel} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatCustomerJoinedDate(customer.joinedAt)}
      </td>
      <td className="px-4 py-3">
        <CustomerRowActions />
      </td>
    </motion.tr>
  );
}
