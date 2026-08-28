"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { type ReactElement, Suspense, useState } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import {
  AccountFields,
  AppearanceFields,
  BusinessFields,
  NotificationFields,
  ProfileFields,
  SecurityFields,
} from "@/components/admin/settings/settings-forms";
import {
  SettingsError,
  SettingsLoading,
} from "@/components/admin/settings/settings-states";
import {
  adminSettingsCopy,
  adminSettingsSections,
} from "@/config/admin-settings";
import type {
  AdminSettingsPresentation,
  AdminSettingsSectionId,
} from "@/types/admin-settings";

interface AdminSettingsProps {
  presentation: AdminSettingsPresentation;
}

export function AdminSettings({
  presentation,
}: AdminSettingsProps): ReactElement {
  return (
    <Suspense
      fallback={
        <Card className="p-6 shadow-none">
          <SettingsLoading />
        </Card>
      }
    >
      <AdminSettingsBody presentation={presentation} />
    </Suspense>
  );
}

function AdminSettingsBody({ presentation }: AdminSettingsProps): ReactElement {
  const searchParams = useSearchParams();
  const requested = searchParams?.get("section") ?? null;
  const initialSection = adminSettingsSections.some(
    (item) => item.id === requested,
  )
    ? (requested as AdminSettingsSectionId)
    : "profile";
  const [section, setSection] =
    useState<AdminSettingsSectionId>(initialSection);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-settings"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminSettingsCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminSettingsCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          {presentation.status === "loading" ? (
            <Card className="p-6 shadow-none">
              <SettingsLoading />
            </Card>
          ) : null}
          {presentation.status === "error" ? (
            <Card className="p-6 shadow-none">
              <SettingsError onRetry={presentation.onRetry} />
            </Card>
          ) : null}
          {presentation.status === "ready" ? (
            <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <nav
                aria-label={adminSettingsCopy.navLabel}
                className="flex flex-col gap-1"
              >
                {adminSettingsSections.map((item) => (
                  <Button
                    aria-current={section === item.id ? "page" : undefined}
                    className="justify-start"
                    key={item.id}
                    onClick={(): void => {
                      setSection(item.id);
                    }}
                    type="button"
                    variant={section === item.id ? "secondary" : "ghost"}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{
                  opacity: prefersReducedMotion ? 1 : 0,
                  y: prefersReducedMotion ? 0 : 6,
                }}
                key={section}
                transition={getMotionTransition(prefersReducedMotion)}
              >
                <SettingsSectionPanel section={section} />
              </motion.div>
            </div>
          ) : null}
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface SettingsSectionPanelProps {
  section: AdminSettingsSectionId;
}

function SettingsSectionPanel({
  section,
}: SettingsSectionPanelProps): ReactElement {
  const copy = adminSettingsSections.find((item) => item.id === section);

  return (
    <Card className="p-6 shadow-none" data-slot={`settings-section-${section}`}>
      <h2 className="text-h3 text-foreground">{copy?.label}</h2>
      <p className="mt-2 text-body-small text-muted-foreground">
        {copy?.description}
      </p>
      <div className="mt-6">
        {section === "profile" ? <ProfileFields /> : null}
        {section === "account" ? <AccountFields /> : null}
        {section === "notifications" ? <NotificationFields /> : null}
        {section === "appearance" ? <AppearanceFields /> : null}
        {section === "security" ? <SecurityFields /> : null}
        {section === "business" ? <BusinessFields /> : null}
      </div>
    </Card>
  );
}
