// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { TIncident } from "@/schemas/incident.schema";
import { afterEach, describe, expect, it, vi } from "vitest";
import IncidentTable from "./incident-table";

const continuedIncident: TIncident = {
  incidentId: "incident-continued",
  tripId: "trip-1",
  incidentType: "VEHICLE_BREAKDOWN",
  severity: "MEDIUM",
  riskLevel: "WARNING",
  description: "Lủng lốp",
  driverPaidAmount: 0,
  requiresRescue: false,
  expenseStatus: "NOT_REQUIRED",
  status: "CONTINUED",
  reportedBy: "driver-1",
  reportedByUsername: "driver",
  evidences: [],
};

describe("IncidentTable resolve action", () => {
  afterEach(cleanup);

  it("hiển thị CTA đóng cho Dispatcher khi Incident CONTINUED đủ điều kiện", () => {
    const onResolve = vi.fn();
    render(
      <IncidentTable
        incidents={[continuedIncident]}
        currentRole="Dispatcher"
        onSelect={vi.fn()}
        onResolve={onResolve}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Đóng Incident" }));
    expect(onResolve).toHaveBeenCalledWith(continuedIncident);
  });

  it("không hiển thị CTA đóng cho role không có quyền", () => {
    render(
      <IncidentTable
        incidents={[continuedIncident]}
        currentRole="Accountant"
        onSelect={vi.fn()}
        onResolve={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Đóng Incident" })).toBeNull();
  });
});
