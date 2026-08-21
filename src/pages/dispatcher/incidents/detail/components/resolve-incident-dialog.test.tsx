// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { TIncident } from "@/schemas/incident.schema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  replacementVehicleId: "vehicle-coldchainx",
  status: "REDISPATCHED_TO_CUSTOMER",
  reportedBy: "driver-1",
  reportedByUsername: "driver",
  evidences: [],
};

const renderDialog = (onOpenChange = vi.fn()) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <ResolveIncidentDialog
        open
        incident={incident}
        currentRole="Dispatcher"
        onOpenChange={onOpenChange}
      />
    </QueryClientProvider>,
  );
  return onOpenChange;
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
    renderDialog(onOpenChange);

    const submit = screen.getByRole("button", { name: "Xác nhận đóng" });
    expect(submit).toHaveProperty("disabled", true);

    fireEvent.change(screen.getByLabelText("Ghi chú xử lý *"), {
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
      "Đã đóng Incident thành công.",
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
    renderDialog(onOpenChange);

    fireEvent.change(screen.getByLabelText("Ghi chú xử lý *"), {
      target: { value: "Đã hoàn tất cứu hộ và giao lại cho khách." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Xác nhận đóng" }));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Chưa thể đóng Incident vì khoản Driver ứng trước chưa được hoàn trả.",
      );
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Xử lý Incident thủ công?" }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Ghi chú xử lý *")).toHaveProperty(
      "value",
      "Đã hoàn tất cứu hộ và giao lại cho khách.",
    );
  });

  it("chống double submit khi người dùng bấm liên tục", async () => {
    let finishRequest: ((value: boolean) => void) | undefined;
    mocks.mutateAsync.mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          finishRequest = resolve;
        }),
    );
    renderDialog();

    fireEvent.change(screen.getByLabelText("Ghi chú xử lý *"), {
      target: { value: "Sự cố đã xử lý và chuyến đã tiếp tục." },
    });
    const submit = screen.getByRole("button", { name: "Xác nhận đóng" });
    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(mocks.mutateAsync).toHaveBeenCalledTimes(1);
    finishRequest?.(true);
    await waitFor(() => expect(mocks.toastSuccess).toHaveBeenCalled());
  });
});
