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
    screen.getByRole("button", { name: "Xem lại và điều xe lạnh ngoài" })
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Xác nhận đã có xe lạnh ngoài" })
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Xác nhận điều xe" })
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

  it("hiển thị đầy đủ field dispatch xe lạnh ngoài theo DTO backend", () => {
    renderForm();

    expect(
      screen.getByRole("button", { name: "Xem lại và điều xe lạnh ngoài" })
    ).toBeTruthy();
    expect(screen.getByLabelText("Nhà cung cấp thuê xe")).toBeTruthy();
    expect(screen.getByLabelText("Biển số xe ngoài")).toBeTruthy();
    expect(screen.getByLabelText("Tài xế đối tác")).toBeTruthy();
    expect(screen.getByLabelText("Nhiệt độ thỏa thuận (°C) *")).toBeTruthy();
    expect(screen.getByLabelText("Seal bàn giao")).toBeTruthy();
  });

  it("mở dialog và gửi đúng payload đầy đủ về kho đích tuyến", async () => {
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

    fireEvent.change(screen.getByLabelText("Nhà cung cấp thuê xe"), {
      target: { value: "Đối tác A" },
    });
    fireEvent.change(screen.getByLabelText("Biển số xe ngoài"), {
      target: { value: "29C-12345" },
    });
    fireEvent.change(screen.getByLabelText("Tài xế đối tác"), {
      target: { value: "Nguyễn Văn A" },
    });
    fireEvent.change(screen.getByLabelText("Điện thoại tài xế"), {
      target: { value: "0900000000" },
    });
    fireEvent.change(screen.getByLabelText("Seal bàn giao"), {
      target: { value: "SEAL-01" },
    });
    fireEvent.change(screen.getByLabelText("Evidence URLs (mỗi dòng một URL)"), {
      target: { value: "https://example.com/evidence.jpg" },
    });
    fireEvent.change(screen.getByLabelText("Ghi chú điều phối"), {
      target: { value: "Đưa hàng về kho tuyến" },
    });

    openAndConfirm();

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        incidentId: "incident-1",
        data: {
          externalVehicleConfirmed: true,
          rentalProvider: "Đối tác A",
          vehiclePlate: "29C-12345",
          driverName: "Nguyễn Văn A",
          driverPhone: "0900000000",
          destinationWarehouseId: "warehouse-1",
          agreedTemperature: 2,
          expectedWarehouseArrivalAt: null,
          sealNumber: "SEAL-01",
          lpnIds: [],
          evidenceUrls: ["https://example.com/evidence.jpg"],
          note: "Đưa hàng về kho tuyến",
        },
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "Đã điều xe lạnh ngoài về Kho Hà Nội."
    );
    await waitFor(() => {
      expect(screen.queryByText("Xác nhận điều xe lạnh ngoài")).toBeNull();
    });
  });

  it("disable CTA khi mutation đang chạy để chống double submit", () => {
    mocks.state.isPending = true;
    renderForm();

    expect(
      screen.getByRole("button", { name: "Xem lại và điều xe lạnh ngoài" })
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
    expect(screen.getByText("Xác nhận điều xe lạnh ngoài")).toBeTruthy();
  });
});
