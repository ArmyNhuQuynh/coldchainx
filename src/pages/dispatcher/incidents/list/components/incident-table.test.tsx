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

describe("IncidentTable dispatcher list", () => {
  afterEach(cleanup);

  it("không hiển thị CTA đóng Incident trong bảng", () => {
    render(
      <IncidentTable
        incidents={[continuedIncident]}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Đóng Incident" })).toBeNull();
  });

  it("bấm vào dòng để mở chi tiết sự cố", () => {
    const onSelect = vi.fn();
    render(
      <IncidentTable
        incidents={[continuedIncident]}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("driver").closest("tr")!);
    expect(onSelect).toHaveBeenCalledWith(continuedIncident);
  });
});
