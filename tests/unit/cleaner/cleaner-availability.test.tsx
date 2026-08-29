/** @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CleanerAvailabilityForm } from "@/components/cleaner/availability/cleaner-availability";
import { Toaster } from "@/components/feedback/toaster";
import {
  CLEANER_PATHS,
  CLEANER_WEEKDAY_LABELS,
  cleanerAvailabilityCopy,
  cleanerJobPath,
} from "@/config/cleaner";
import { saveCleanerAvailability } from "@/lib/cleaner/jobs";
import { clearToasts } from "@/lib/toast";
import {
  CLEANER_WEEKDAYS,
  type CleanerAvailability,
  type CleanerWeekDayAvailability,
} from "@/types/cleaner";

vi.mock("@/lib/cleaner/refresh", () => ({
  useCleanerRefresh: (): (() => void) => (): void => undefined,
}));

vi.mock("@/lib/cleaner/jobs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/cleaner/jobs")>();
  return { ...actual, saveCleanerAvailability: vi.fn() };
});

const mockedSave = vi.mocked(saveCleanerAvailability);

function emptyWeek(): CleanerWeekDayAvailability[] {
  return CLEANER_WEEKDAYS.map((day) => ({
    available: false,
    day,
    end: null,
    start: null,
  }));
}

function availability(
  overrides: Partial<CleanerAvailability> = {},
): CleanerAvailability {
  return {
    conflicts: [],
    week: emptyWeek(),
    ...overrides,
  };
}

describe("CleanerAvailabilityForm", (): void => {
  afterEach((): void => {
    mockedSave.mockReset();
    clearToasts();
  });

  it("validates time ranges before saving server-backed hours", async (): Promise<void> => {
    mockedSave.mockResolvedValue({
      data: availability({
        week: emptyWeek().map((day) =>
          day.day === "monday"
            ? { available: true, day: "monday", end: "17:00", start: "09:00" }
            : day,
        ),
      }),
      ok: true,
      status: 200,
    });
    const user = userEvent.setup();
    render(
      <>
        <CleanerAvailabilityForm availability={availability()} />
        <Toaster />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Availability" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cleanerAvailabilityCopy.emptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: cleanerAvailabilityCopy.scheduleLink }),
    ).toHaveAttribute("href", CLEANER_PATHS.schedule);

    const monday = screen
      .getByText(CLEANER_WEEKDAY_LABELS.monday)
      .closest("li");
    expect(monday).not.toBeNull();
    await user.click(
      monday?.querySelector("input[type='checkbox']") as HTMLInputElement,
    );
    fireEvent.change(
      screen.getByLabelText(cleanerAvailabilityCopy.startLabel),
      {
        target: { value: "17:00" },
      },
    );
    fireEvent.change(screen.getByLabelText(cleanerAvailabilityCopy.endLabel), {
      target: { value: "09:00" },
    });
    await user.click(
      screen.getByRole("button", { name: cleanerAvailabilityCopy.saveAction }),
    );
    expect(mockedSave).not.toHaveBeenCalled();
    expect(
      screen.getByText(cleanerAvailabilityCopy.validationRange),
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText(cleanerAvailabilityCopy.startLabel),
      {
        target: { value: "09:00" },
      },
    );
    fireEvent.change(screen.getByLabelText(cleanerAvailabilityCopy.endLabel), {
      target: { value: "17:00" },
    });
    await user.click(
      screen.getByRole("button", { name: cleanerAvailabilityCopy.saveAction }),
    );
    await waitFor((): void => {
      expect(mockedSave).toHaveBeenCalled();
    });
    expect(
      screen.getByText(cleanerAvailabilityCopy.saveSuccess),
    ).toBeInTheDocument();
  });

  it("shows existing job conflicts without inventing exceptions", (): void => {
    render(
      <CleanerAvailabilityForm
        availability={availability({
          conflicts: [
            {
              date: "2026-09-07",
              jobId: "booking_own_1",
              serviceName: "Home Refresh",
            },
          ],
        })}
      />,
    );

    expect(
      screen.getByText(cleanerAvailabilityCopy.conflictHeading),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Home Refresh/ })).toHaveAttribute(
      "href",
      cleanerJobPath("booking_own_1"),
    );
    expect(screen.queryByText("Add Exception")).not.toBeInTheDocument();
    expect(screen.queryByText("Vacation")).not.toBeInTheDocument();
  });
});
