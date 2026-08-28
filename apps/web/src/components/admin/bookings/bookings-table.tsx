"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { BookingCardList } from "@/components/admin/bookings/booking-card";
import { BookingsDesktopTable } from "@/components/admin/bookings/bookings-desktop-table";
import { BookingsPagination } from "@/components/admin/bookings/bookings-pagination";
import {
  BookingsEmptyState,
  BookingsError,
  BookingsLoading,
  BookingsNoMatchesState,
} from "@/components/admin/bookings/bookings-states";
import { shouldRenderBookingPagination } from "@/lib/admin/bookings";
import type {
  AdminBooking,
  AdminBookingPagination,
  AdminBookingPresentation,
} from "@/types/admin-booking";

interface BookingsTableProps {
  bookings: readonly AdminBooking[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  pagination?: AdminBookingPagination;
  presentation: AdminBookingPresentation;
}

export function BookingsTable({
  bookings,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  pagination,
  presentation,
}: BookingsTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="bookings-table">
      <BookingsTableBody
        bookings={bookings}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onCreate={onCreate}
        presentation={presentation}
      />
      {presentation.status === "ready" &&
      shouldRenderBookingPagination(pagination, bookings.length) &&
      pagination !== undefined ? (
        <BookingsPagination pagination={pagination} />
      ) : null}
    </div>
  );
}

interface BookingsTableBodyProps {
  bookings: readonly AdminBooking[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  presentation: AdminBookingPresentation;
}

function BookingsTableBody({
  bookings,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  presentation,
}: BookingsTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <BookingsLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <BookingsError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <BookingsEmptyState onCreate={onCreate} />
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <BookingsNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <BookingsEmptyState onCreate={onCreate} />
        )}
      </Card>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate="visible"
        initial={prefersReducedMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
            },
          },
        }}
      >
        <BookingCardList bookings={bookings} />
        <BookingsDesktopTable bookings={bookings} />
      </motion.div>
    </AnimatePresence>
  );
}
