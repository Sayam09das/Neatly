/** @vitest-environment jsdom */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CleanerJobDetails } from "@/components/cleaner/jobs/cleaner-job-details";
import { Toaster } from "@/components/feedback/toaster";
import { cleanerWorkflowCopy } from "@/config/cleaner";
import { mutateCleanerJob } from "@/lib/cleaner/jobs";
import { clearToasts } from "@/lib/toast";
import type { CleanerJob } from "@/types/cleaner";

vi.mock("@/lib/cleaner/refresh", () => ({
  useCleanerRefresh: (): (() => void) => (): void => undefined,
}));

vi.mock("@/lib/cleaner/jobs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/cleaner/jobs")>();
  return { ...actual, mutateCleanerJob: vi.fn() };
});

const mockedMutate = vi.mocked(mutateCleanerJob);

function job(overrides: Partial<CleanerJob> = {}): CleanerJob {
  return {
    actions: { canComplete: false, canStart: true },
    customerName: "Ada",
    id: "booking_own_1",
    scheduledAt: "2026-09-04T10:00:00.000Z",
    service: { id: "service_1", name: "Home Refresh" },
    serviceAddress: "12 Harbour Street",
    status: "ASSIGNED",
    updatedAt: "2026-08-30T09:00:00.000Z",
    ...overrides,
  };
}

describe("CleanerJobWorkflow", (): void => {
  afterEach((): void => {
    mockedMutate.mockReset();
    clearToasts();
  });

  it("starts an assigned job and then offers complete", async (): Promise<void> => {
    mockedMutate.mockResolvedValue({
      data: job({
        actions: { canComplete: true, canStart: false },
        status: "IN_PROGRESS",
      }),
      ok: true,
      status: 200,
    });
    const user = userEvent.setup();
    render(
      <>
        <CleanerJobDetails job={job()} />
        <Toaster />
      </>,
    );

    expect(
      screen.getByText(cleanerWorkflowCopy.progressHeading),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: cleanerWorkflowCopy.startAction }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: cleanerWorkflowCopy.completeAction,
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Accept Job")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: cleanerWorkflowCopy.startAction }),
    );
    await waitFor((): void => {
      expect(mockedMutate).toHaveBeenCalledWith("booking_own_1", "start");
    });
    expect(
      screen.getByText(cleanerWorkflowCopy.startSuccess),
    ).toBeInTheDocument();
  });

  it("confirms completion and rejects cancelled actions", async (): Promise<void> => {
    mockedMutate.mockResolvedValue({
      data: job({
        actions: { canComplete: false, canStart: false },
        status: "COMPLETED",
      }),
      ok: true,
      status: 200,
    });
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <CleanerJobDetails
          job={job({
            actions: { canComplete: true, canStart: false },
            status: "IN_PROGRESS",
          })}
        />
        <Toaster />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: cleanerWorkflowCopy.completeAction }),
    );
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByRole("heading", {
        name: cleanerWorkflowCopy.completeTitle,
      }),
    ).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole("button", {
        name: cleanerWorkflowCopy.completeConfirm,
      }),
    );
    await waitFor((): void => {
      expect(mockedMutate).toHaveBeenCalledWith("booking_own_1", "complete");
    });

    rerender(
      <>
        <CleanerJobDetails
          job={job({
            actions: { canComplete: false, canStart: false },
            status: "CANCELLED",
          })}
        />
        <Toaster />
      </>,
    );
    expect(
      screen.getByText(cleanerWorkflowCopy.cancelledHint),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: cleanerWorkflowCopy.startAction }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: cleanerWorkflowCopy.completeAction,
      }),
    ).not.toBeInTheDocument();
  });

  it("shows a safe error and refreshes after a rejected transition", async (): Promise<void> => {
    mockedMutate.mockResolvedValue({
      code: "CONFLICT",
      fields: {},
      forbidden: false,
      message: "The booking was updated by another request.",
      ok: false,
      status: 409,
      unauthorized: false,
    });
    const user = userEvent.setup();
    render(
      <>
        <CleanerJobDetails job={job()} />
        <Toaster />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: cleanerWorkflowCopy.startAction }),
    );
    await waitFor((): void => {
      expect(
        screen.getByText(cleanerWorkflowCopy.staleError),
      ).toBeInTheDocument();
    });
  });
});
