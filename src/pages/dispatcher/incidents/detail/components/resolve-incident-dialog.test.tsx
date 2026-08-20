// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { TIncident } from "@/schemas/incident.schema";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/hooks/use-incident", () => ({
  useIncident: () => ({
    resolveIncident: {
      mutateAsync: mocks.mutateAsync,
      isPending: false,
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

import ResolveIncidentDialog from "./resolve-incident-dialog";

const incident: TIncident = {
  incidentId: "incident-1",
  tripId: "trip-new",
  incidentType: "VEHICLE_BREAKDOWN",
  severity: "CRITICAL",
  description: "Xe lạnh bị hư",
  driverPaidAmount: 100_000,
  reimbursedAmount: 100_000,
  expenseStatus: "REIMBURSED",
  requiresRescue: true,
  status: "REDISPATCHED_TO_CUSTOMER",
  reportedBy: "driver-1",
  reportedByUsername: "driver",
  evidences: [],
};

describe("ResolveIncidentDialog", () => {
  beforeEach(() => {
    mocks.mutateAsync.mockReset();
    mocks.toastSuccess.mockReset();
    mocks.toastError.mockReset();
  });

  afterEach(cleanup);

  it("bắt buộc resolutionNote và gửi payload đã trim", async () => {
    mocks.mutateAsync.mockResolvedValue(true);
    const onOpenChange = vi.fn();
    render(
      <ResolveIncidentDialog
        open
        incident={incident}
        onOpenChange={onOpenChange}
      />
    );

    const submit = screen.getByRole("button", { name: "Đóng Incident" });
    expect(submit).toHaveProperty("disabled", true);

    fireEvent.change(screen.getByLabelText("Ghi chú kết thúc *"), {
      target: {
        value:
          "  Hàng đã nhập kho Hà Nội, tạo chuyến mới và tiếp tục giao khách.  ",
      },
    });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mocks.mutateAsync).toHaveBeenCalledWith({
        incidentId: "incident-1",
        data: {
          resolutionNote:
            "Hàng đã nhập kho Hà Nội, tạo chuyến mới và tiếp tục giao khách.",
        },
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "Đã đóng Incident thành công."
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("giữ modal và dịch message backend khi chưa hoàn tiền Driver", async () => {
    mocks.mutateAsync.mockRejectedValue({
      response: {
        data: {
          message:
            "Driver expense must be approved and reimbursed before resolving the incident.",
        },
      },
    });
    const onOpenChange = vi.fn();
    render(
      <ResolveIncidentDialog
        open
        incident={incident}
        onOpenChange={onOpenChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Ghi chú kết thúc *"), {
      target: { value: "Đã hoàn tất cứu hộ và giao lại cho khách." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Đóng Incident" }));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Chưa thể đóng Incident vì khoản Driver ứng trước chưa được hoàn trả."
      );
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Đóng Incident" })
    ).toBeTruthy();
  });
});
