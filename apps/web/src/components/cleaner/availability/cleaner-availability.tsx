"use client";

import { Button, Input, Label } from "@neatly/ui";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
  useEffect,
  useState,
} from "react";
import { CleanerRefreshErrorState } from "@/components/cleaner/cleaner-refresh-error";
import {
  CLEANER_PATHS,
  CLEANER_WEEKDAY_LABELS,
  cleanerAvailabilityCopy,
  cleanerJobPath,
  cleanerSurfaceCopy,
} from "@/config/cleaner";
import { saveCleanerAvailability } from "@/lib/cleaner/jobs";
import { useCleanerRefresh } from "@/lib/cleaner/refresh";
import { toast } from "@/lib/toast";
import {
  CLEANER_WEEKDAYS,
  type CleanerAvailability,
  type CleanerAvailabilityConflict,
  type CleanerWeekDayAvailability,
} from "@/types/cleaner";

interface CleanerAvailabilityFormProps {
  availability: CleanerAvailability | null;
}

export function CleanerAvailabilityForm({
  availability,
}: CleanerAvailabilityFormProps): ReactElement {
  if (availability === null) {
    return <CleanerRefreshErrorState />;
  }

  return <AvailabilityEditor initial={availability} />;
}

function AvailabilityEditor({
  initial,
}: {
  initial: CleanerAvailability;
}): ReactElement {
  const refresh = useCleanerRefresh();
  const [week, setWeek] = useState<CleanerWeekDayAvailability[]>(() =>
    sortWeek(initial.week),
  );
  const [baseline, setBaseline] = useState<CleanerWeekDayAvailability[]>(() =>
    sortWeek(initial.week),
  );
  const [conflicts, setConflicts] = useState<CleanerAvailabilityConflict[]>(
    initial.conflicts,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(week) !== JSON.stringify(baseline);
  const hasAvailableDay = week.some((day) => day.available);

  useEffect((): void => {
    const nextWeek = sortWeek(initial.week);
    setWeek(nextWeek);
    setBaseline(nextWeek);
    setConflicts(initial.conflicts);
  }, [initial]);

  useEffect((): (() => void) | undefined => {
    if (!dirty) {
      return undefined;
    }

    function onBeforeUnload(event: BeforeUnloadEvent): void {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return (): void => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [dirty]);

  function updateDay(
    day: CleanerWeekDayAvailability["day"],
    patch: Partial<CleanerWeekDayAvailability>,
  ): void {
    setWeek((current) =>
      current.map((item) => (item.day === day ? { ...item, ...patch } : item)),
    );
  }

  function handleDiscard(): void {
    setWeek(baseline);
    setConflicts(initial.conflicts);
    setError(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const validationError = validateWeek(week);

    if (validationError !== null) {
      setError(validationError);
      return;
    }

    setBusy(true);
    setError(null);
    const result = await saveCleanerAvailability(normalizeWeek(week));
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      toast.error({ title: cleanerAvailabilityCopy.saveError });
      return;
    }

    const nextWeek = sortWeek(result.data.week);
    setWeek(nextWeek);
    setBaseline(nextWeek);
    setConflicts(result.data.conflicts);
    toast.success({ title: cleanerAvailabilityCopy.saveSuccess });
    refresh();
  }

  return (
    <form className="w-full min-w-0 max-w-2xl" onSubmit={handleSubmit}>
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {cleanerSurfaceCopy.availability.heading}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {cleanerSurfaceCopy.availability.description}
        </p>
      </header>
      <p className="mt-6">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CLEANER_PATHS.schedule}
        >
          {cleanerAvailabilityCopy.scheduleLink}
        </Link>
      </p>
      <h2 className="mt-10 text-h2 text-foreground tracking-tight">
        {cleanerAvailabilityCopy.weekHeading}
      </h2>
      {hasAvailableDay ? null : (
        <div className="mt-4">
          <p className="text-body text-foreground">
            {cleanerAvailabilityCopy.emptyTitle}
          </p>
          <p className="mt-2 text-body text-muted-foreground">
            {cleanerAvailabilityCopy.emptyDescription}
          </p>
        </div>
      )}
      <ul className="mt-6 flex flex-col gap-4">
        {week.map((day) => (
          <li className="rounded-xl border border-border p-4" key={day.day}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body font-medium text-foreground">
                {CLEANER_WEEKDAY_LABELS[day.day]}
              </p>
              <label className="inline-flex min-h-touch items-center gap-2 text-body-small">
                <input
                  checked={day.available}
                  disabled={busy}
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    updateDay(day.day, {
                      available: event.target.checked,
                      end: event.target.checked ? day.end : null,
                      start: event.target.checked ? day.start : null,
                    });
                  }}
                  type="checkbox"
                />
                {day.available
                  ? cleanerAvailabilityCopy.availableLabel
                  : cleanerAvailabilityCopy.unavailableLabel}
              </label>
            </div>
            {day.available ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`availability-start-${day.day}`}>
                    {cleanerAvailabilityCopy.startLabel}
                  </Label>
                  <Input
                    className="mt-2"
                    disabled={busy}
                    id={`availability-start-${day.day}`}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                      updateDay(day.day, {
                        start:
                          event.target.value === "" ? null : event.target.value,
                      });
                    }}
                    type="time"
                    value={day.start ?? ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`availability-end-${day.day}`}>
                    {cleanerAvailabilityCopy.endLabel}
                  </Label>
                  <Input
                    className="mt-2"
                    disabled={busy}
                    id={`availability-end-${day.day}`}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                      updateDay(day.day, {
                        end:
                          event.target.value === "" ? null : event.target.value,
                      });
                    }}
                    type="time"
                    value={day.end ?? ""}
                  />
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {conflicts.length === 0 ? null : (
        <section className="mt-8 rounded-xl border border-border p-4">
          <h3 className="text-h3 text-foreground">
            {cleanerAvailabilityCopy.conflictHeading}
          </h3>
          <p className="mt-2 text-body-small text-muted-foreground">
            {cleanerAvailabilityCopy.conflictDescription}
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {conflicts.map((conflict) => (
              <li key={conflict.jobId}>
                <Link
                  className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={cleanerJobPath(conflict.jobId)}
                >
                  {conflict.date}
                  {conflict.serviceName === null
                    ? ""
                    : ` · ${conflict.serviceName}`}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {error === null ? null : (
        <p className="mt-6 text-body text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          disabled={busy || !dirty}
          onClick={handleDiscard}
          type="button"
          variant="outline"
        >
          {cleanerAvailabilityCopy.discardAction}
        </Button>
        <Button disabled={busy || !dirty} type="submit">
          {busy
            ? cleanerAvailabilityCopy.saveBusy
            : cleanerAvailabilityCopy.saveAction}
        </Button>
      </div>
    </form>
  );
}

function sortWeek(
  week: readonly CleanerWeekDayAvailability[],
): CleanerWeekDayAvailability[] {
  return [...week].sort(
    (left, right) =>
      CLEANER_WEEKDAYS.indexOf(left.day) - CLEANER_WEEKDAYS.indexOf(right.day),
  );
}

function normalizeWeek(
  week: readonly CleanerWeekDayAvailability[],
): CleanerWeekDayAvailability[] {
  return sortWeek(week).map((day) =>
    day.available
      ? day
      : { available: false, day: day.day, end: null, start: null },
  );
}

function validateWeek(
  week: readonly CleanerWeekDayAvailability[],
): string | null {
  for (const day of week) {
    if (!day.available) {
      continue;
    }

    if (day.start === null || day.end === null) {
      return cleanerAvailabilityCopy.validationRequired;
    }

    if (day.start >= day.end) {
      return cleanerAvailabilityCopy.validationRange;
    }
  }

  return null;
}
