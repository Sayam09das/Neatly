"use client";

import { Button, Card, Skeleton } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  type ComponentType,
  type ReactElement,
  type SVGProps,
  useId,
} from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { fade } from "@/animations/motion/variants";
import {
  AdminMetricTrend,
  type AdminMetricTrendValue,
} from "@/components/admin/admin-metric-trend";
import { adminDashboardCopy } from "@/config/admin-dashboard";
import { adminShellCopy } from "@/config/admin-ui";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const METRIC_HOVER_LIFT_PX = 2;

export type AdminMetricPresentation =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry?: () => void; status: "error" }
  | {
      periodLabel?: string;
      status: "success";
      supportingText?: string;
      trend?: AdminMetricTrendValue;
      value: string;
    };

interface AdminMetricCardProps {
  href?: string;
  icon: IconComponent;
  label: string;
  presentation: AdminMetricPresentation;
}

export function AdminMetricCard({
  href,
  icon: Icon,
  label,
  presentation,
}: AdminMetricCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const transition = getMotionTransition(prefersReducedMotion);
  const labelId = useId();
  const isLoading = presentation.status === "loading";
  const card = (
    <Card
      aria-busy={isLoading || undefined}
      aria-labelledby={isLoading ? undefined : labelId}
      className={cn(
        "h-full p-5 shadow-none",
        href === undefined
          ? undefined
          : "motion-safe:transition-colors motion-safe:duration-fast hover:bg-muted/40",
      )}
      data-slot="admin-metric-card"
    >
      <div className="flex justify-end">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-3 flex flex-col"
          exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          key={presentation.status}
          transition={transition}
        >
          <AdminMetricBody
            label={label}
            labelId={labelId}
            presentation={presentation}
          />
        </motion.div>
      </AnimatePresence>
    </Card>
  );

  return (
    <motion.article
      className="min-w-0"
      data-slot="admin-metric"
      transition={transition}
      variants={fade}
      whileHover={
        prefersReducedMotion ? undefined : { y: -METRIC_HOVER_LIFT_PX }
      }
    >
      {href === undefined ? (
        card
      ) : (
        <Link
          className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={href}
        >
          {card}
        </Link>
      )}
    </motion.article>
  );
}

interface AdminMetricBodyProps {
  label: string;
  labelId: string;
  presentation: AdminMetricPresentation;
}

function AdminMetricBody({
  label,
  labelId,
  presentation,
}: AdminMetricBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <div className="space-y-3" role="status">
        <p className="sr-only">{adminShellCopy.loadingLabel}</p>
        <Skeleton className="h-8 w-16 max-w-full" />
        <Skeleton className="h-3 w-28 max-w-full" />
        <Skeleton className="h-3 w-20 max-w-full" />
      </div>
    );
  }

  const value = getMetricValue(presentation);
  const supporting = getMetricSupportingText(presentation);
  const hidePlaceholderValue = presentation.status !== "success";

  return (
    <div role={presentation.status === "error" ? "alert" : undefined}>
      <p
        className="order-2 mt-2 text-caption font-medium text-muted-foreground uppercase"
        id={labelId}
      >
        {label}
      </p>
      <p
        aria-hidden={hidePlaceholderValue}
        className={cn(
          "order-1 text-h2 tracking-tight",
          presentation.status === "success"
            ? "text-foreground"
            : "text-muted-foreground",
        )}
      >
        {value}
      </p>
      {supporting === undefined ? null : (
        <p className="order-3 mt-1 text-caption text-muted-foreground">
          {supporting}
        </p>
      )}
      {presentation.status === "success" &&
      presentation.periodLabel !== undefined ? (
        <p className="order-4 mt-1 text-caption text-muted-foreground">
          {presentation.periodLabel}
        </p>
      ) : null}
      {presentation.status === "success" && presentation.trend !== undefined ? (
        <div className="order-5">
          <AdminMetricTrend trend={presentation.trend} />
        </div>
      ) : null}
      {presentation.status === "error" && presentation.onRetry !== undefined ? (
        <Button
          className="order-6 mt-3"
          onClick={presentation.onRetry}
          size="sm"
          type="button"
          variant="outline"
        >
          {adminDashboardCopy.retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

function getMetricValue(presentation: AdminMetricPresentation): string {
  if (presentation.status === "success") {
    return presentation.value;
  }

  return adminDashboardCopy.emptyValue;
}

function getMetricSupportingText(
  presentation: AdminMetricPresentation,
): string | undefined {
  if (presentation.status === "empty") {
    return adminDashboardCopy.emptyValueLabel;
  }

  if (presentation.status === "error") {
    return adminDashboardCopy.metricErrorLabel;
  }

  if (presentation.status === "success") {
    return presentation.supportingText;
  }

  return undefined;
}
