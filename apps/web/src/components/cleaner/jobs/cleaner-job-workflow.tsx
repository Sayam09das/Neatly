"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useState } from "react";
import { CleanerConfirmDialog } from "@/components/cleaner/cleaner-confirm-dialog";
import { CleanerJobStatusBadge } from "@/components/cleaner/cleaner-job-status-badge";
import { cleanerWorkflowCopy } from "@/config/cleaner";
import { mutateCleanerJob } from "@/lib/cleaner/jobs";
import { useCleanerRefresh } from "@/lib/cleaner/refresh";
import { formatCleanerSchedule } from "@/lib/cleaner/schedule";
import { toast } from "@/lib/toast";
import type { CleanerJob, CleanerJobStatus } from "@/types/cleaner";

interface CleanerJobWorkflowProps {
  job: CleanerJob;
}

type WorkflowBusy = "start" | "complete" | null;

const WORKFLOW_STEPS = [
  { id: "ASSIGNED", label: cleanerWorkflowCopy.stepAssigned },
  { id: "IN_PROGRESS", label: cleanerWorkflowCopy.stepInProgress },
  { id: "COMPLETED", label: cleanerWorkflowCopy.stepCompleted },
] as const;

export function CleanerJobWorkflow({
  job,
}: CleanerJobWorkflowProps): ReactElement {
  const refresh = useCleanerRefresh();
  const [busy, setBusy] = useState<WorkflowBusy>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hint = statusHint(job.status);
  const updatedAt = formatCleanerSchedule(job.updatedAt);

  async function runMutation(action: "start" | "complete"): Promise<void> {
    setBusy(action);
    setError(null);
    const result = await mutateCleanerJob(job.id, action);
    setBusy(null);

    if (!result.ok) {
      const message =
        result.code === "CONFLICT"
          ? cleanerWorkflowCopy.staleError
          : action === "start"
            ? cleanerWorkflowCopy.startError
            : cleanerWorkflowCopy.completeError;
      setError(result.message === "" ? message : result.message);
      toast.error({ title: message });
      refresh();
      return;
    }

    setConfirmOpen(false);
    toast.success({
      title:
        action === "start"
          ? cleanerWorkflowCopy.startSuccess
          : cleanerWorkflowCopy.completeSuccess,
    });
    refresh();
  }

  return (
    <section className="mt-10 max-w-2xl">
      <h2 className="text-h2 text-foreground tracking-tight">
        {cleanerWorkflowCopy.progressHeading}
      </h2>
      <p className="mt-4 text-label font-medium text-foreground uppercase tracking-wide">
        {cleanerWorkflowCopy.currentStatus}
      </p>
      <div className="mt-3">
        <CleanerJobStatusBadge status={job.status} />
      </div>
      <p className="mt-3 text-body text-muted-foreground">{hint}</p>
      {updatedAt === null ? null : (
        <p className="mt-2 text-caption text-muted-foreground">
          {cleanerWorkflowCopy.lastUpdated} · {updatedAt}
        </p>
      )}
      <ol className="mt-6 space-y-3">
        {WORKFLOW_STEPS.map((step) => {
          const state = stepState(job.status, step.id);
          return (
            <li className="flex items-start gap-3" key={step.id}>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-6 items-center justify-center rounded-full text-caption font-medium",
                  state === "complete" &&
                    "bg-secondary text-secondary-foreground",
                  state === "current" && "bg-primary text-primary-foreground",
                  state === "upcoming" && "bg-muted text-muted-foreground",
                )}
              >
                {state === "complete" ? "✓" : state === "current" ? "●" : "○"}
              </span>
              <div>
                <p className="text-body-small font-medium text-foreground">
                  {step.label}
                </p>
                <p className="sr-only">
                  {state === "complete"
                    ? "Complete"
                    : state === "current"
                      ? "Current"
                      : "Upcoming"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {error === null ? null : (
        <p className="mt-4 text-body text-destructive" role="alert">
          {error}
        </p>
      )}
      {job.actions.canStart || job.actions.canComplete ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {job.actions.canStart ? (
            <Button
              disabled={busy !== null}
              onClick={(): void => {
                void runMutation("start");
              }}
              type="button"
            >
              {busy === "start"
                ? cleanerWorkflowCopy.startBusy
                : cleanerWorkflowCopy.startAction}
            </Button>
          ) : null}
          {job.actions.canComplete ? (
            <Button
              disabled={busy !== null}
              onClick={(): void => {
                setConfirmOpen(true);
              }}
              type="button"
            >
              {busy === "complete"
                ? cleanerWorkflowCopy.completeBusy
                : cleanerWorkflowCopy.completeAction}
            </Button>
          ) : null}
        </div>
      ) : null}
      <CleanerConfirmDialog
        busy={busy === "complete"}
        busyLabel={cleanerWorkflowCopy.completeBusy}
        cancelLabel={cleanerWorkflowCopy.completeKeep}
        confirmLabel={cleanerWorkflowCopy.completeConfirm}
        description={cleanerWorkflowCopy.completeDescription}
        error={confirmOpen ? error : null}
        onCancel={(): void => {
          setConfirmOpen(false);
        }}
        onConfirm={(): void => {
          void runMutation("complete");
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={cleanerWorkflowCopy.completeTitle}
      />
    </section>
  );
}

function statusHint(status: CleanerJobStatus): string {
  switch (status) {
    case "ASSIGNED":
      return cleanerWorkflowCopy.assignedHint;
    case "IN_PROGRESS":
      return cleanerWorkflowCopy.inProgressHint;
    case "COMPLETED":
      return cleanerWorkflowCopy.completedHint;
    case "CANCELLED":
      return cleanerWorkflowCopy.cancelledHint;
    case "CONFIRMED":
      return cleanerWorkflowCopy.confirmedHint;
    default:
      return cleanerWorkflowCopy.pendingHint;
  }
}

function stepState(
  status: CleanerJobStatus,
  step: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED",
): "complete" | "current" | "upcoming" {
  if (status === "CANCELLED") {
    return "upcoming";
  }

  if (step === "ASSIGNED") {
    if (status === "ASSIGNED") {
      return "current";
    }

    return status === "IN_PROGRESS" || status === "COMPLETED"
      ? "complete"
      : "upcoming";
  }

  if (step === "IN_PROGRESS") {
    if (status === "IN_PROGRESS") {
      return "current";
    }

    return status === "COMPLETED" ? "complete" : "upcoming";
  }

  return status === "COMPLETED" ? "complete" : "upcoming";
}
