// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TIncident, TIncidentRescuePlan } from "@/schemas/incident.schema";

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  state: { isPending: false },
  toastSuccess: vi.fn(),
  toastWarning: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/hooks/use-incident", () => ({
  useIncident: () => ({
    dispatchExternalReefer: {
      mutateAsync: mocks.mutateAsync,
      isPending: mocks.state.isPending,
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    warning: mocks.toastWarning,
    error: mocks.toastError,
  },
}));

import ExternalReeferDispatchForm from "./external-reefer-dispatch-form";

const incident: TIncident = {
  incidentId: "incident-1",
  tripId: "trip-1",
  incidentType: "VEHICLE_BREAKDOWN",
  severity: "CRITICAL",
  description: "Xe lạnh hư",
  driverPaidAmount: 0,
  requiresRescue: true,
  status: "RESCUE_PLANNING",
  reportedBy: "driver-1",
  reportedByUsername: "driver",
  evidences: [],
};

const plan: TIncidentRescuePlan = {
  incidentId: incident.incidentId,
  tripId: "trip-1",
  targetTemperature: 2,
  temperatureThresholdBreached: false,
  directDeliveryLocked: true,
  recommendedAction: "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE",
  recommendationReason: "Breakdown bắt buộc dùng xe ngoài",
  vehicles: [],
  internalColdStorages: [],
  routeDestinationWarehouse: {
    warehouseId: "warehouse-1",
    warehouseName: "Kho Hà Nội",
    address: "Hà Nội",
    availablePalletPositions: 100,
    isNearby: false,
    isRouteDestinationWarehouse: true,
  },
  requiresExternalVehicleRental: true,
  requiresManualEscalation: false,
};

const renderForm = () =>
  render(<ExternalReeferDispatchForm incident={incident} plan={plan} />);

const openAndConfirm = () => {
  fireEvent.click(
    screen.getByRole("button", { name: "Xác nhận đã có xe lạnh ngoài" })
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Xác nhận đã có xe lạnh ngoài" })
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Xác nhận và chuyển task cho kho" })
  );
};

describe("ExternalReeferDispatchForm", () => {
  beforeEach(() => {
    mocks.state.isPending = false;
    mocks.mutateAsync.mockReset();
    mocks.toastSuccess.mockReset();
    mocks.toastWarning.mockReset();
    mocks.toastError.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("chỉ hiển thị CTA xác nhận và không render các field quản lý xe ngoài", () => {
    renderForm();

    expect(
      screen.getByRole("button", { name: "Xác nhận đã có xe lạnh ngoài" })
    ).toBeTruthy();
    expect(screen.queryByText("Biển số xe")).toBeNull();
    expect(screen.queryByText("Tên tài xế")).toBeNull();
    expect(screen.queryByText("Đơn vị cho thuê")).toBeNull();
    expect(screen.queryByText("ETA đến kho")).toBeNull();
    expect(screen.queryByText("Seal xe thuê ngoài")).toBeNull();
  });

  it("mở dialog, gửi đúng payload tối giản và dùng warehouse action từ response", async () => {
    mocks.mutateAsync.mockResolvedValue({
      incidentId: "incident-1",
      tripId: "trip-1",
      incidentStatus: "EXTERNAL_REEFER_IN_TRANSIT",
      tripStatus: "DELAYED",
      destinationWarehouseId: "warehouse-1",
      destinationWarehouseName: "Kho Hà Nội",
      lpnCount: 12,
      warehouseInboundReady: true,
      requiredWarehouseAction: "INBOUND_RESCUE_BY_SEAL",
    });
    renderForm();

    openAndConfirm();

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        incidentId: "incident-1",
        data: { externalVehicleConfirmed: true },
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "Đã xác nhận xe lạnh ngoài. Warehouse Kho Hà Nội đã nhận yêu cầu inbound cứu hộ."
    );
    await waitFor(() => {
      expect(screen.queryByText("Xác nhận đã có xe lạnh ngoài?")).toBeNull();
    });
  });

  it("disable CTA khi mutation đang chạy để chống double submit", () => {
    mocks.state.isPending = true;
    renderForm();

    expect(
      screen.getByRole("button", { name: "Xác nhận đã có xe lạnh ngoài" })
    ).toHaveProperty("disabled", true);
  });

  it("giữ dialog và hiển thị message backend khi API từ chối", async () => {
    mocks.mutateAsync.mockRejectedValue({
      response: { data: { message: "Incident status đã thay đổi" } },
    });
    renderForm();

    openAndConfirm();

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Incident status đã thay đổi"
      );
    });
    expect(screen.getByText("Xác nhận đã có xe lạnh ngoài?")).toBeTruthy();
  });
});
