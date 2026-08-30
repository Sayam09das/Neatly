"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useSyncExternalStore } from "react";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";
import { customerFirstName } from "@/lib/customer/schedule";

interface DashboardGreetingProps {
  name: string;
}

export function DashboardGreeting({
  name,
}: DashboardGreetingProps): ReactElement {
  const hour = useSyncExternalStore(
    subscribeToHour,
    readLocalHour,
    readServerHour,
  );
  const firstName = customerFirstName(name);
  const greeting = resolveGreeting(firstName, hour);

  return (
    <header className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-h1 text-foreground tracking-tight">{greeting}</h1>
        <p className="mt-3 text-body text-muted-foreground">
          {customerDashboardCopy.intro}
        </p>
      </div>
      <Button asChild>
        <Link href={CUSTOMER_PATHS.dashboardServices}>
          {customerDashboardCopy.exploreServices}
        </Link>
      </Button>
    </header>
  );
}

function resolveGreeting(firstName: string, hour: number | null): string {
  if (firstName === "") {
    return customerDashboardCopy.greetingFallback;
  }

  if (hour === null) {
    return customerDashboardCopy.greetingNamed.replace("{name}", firstName);
  }

  const template =
    hour < 12
      ? customerDashboardCopy.greetingMorning
      : hour < 17
        ? customerDashboardCopy.greetingAfternoon
        : customerDashboardCopy.greetingEvening;

  return template.replace("{name}", firstName);
}

function subscribeToHour(onStoreChange: () => void): () => void {
  const interval = window.setInterval(onStoreChange, 60_000);
  return (): void => {
    window.clearInterval(interval);
  };
}

function readLocalHour(): number {
  return new Date().getHours();
}

function readServerHour(): number | null {
  return null;
}
