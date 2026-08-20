import { describe, expect, it } from "vitest";
import type { TIncident } from "@/schemas/incident.schema";
import {
  getIncidentStatusLabel,
  INCIDENT_STATUS,
} from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE } from "@/types/enums/incident-type.enum";
import { INCIDENT_EXPENSE_STATUS } from "@/types/enums/incident-expense-status.enum";
import {
  buildExternalReeferConfirmationRequest,
  getExternalReeferConfigurationBlocker,
  getIncidentPrimaryAction,
  getResolutionBlocker,
  hasExactLockedLpnSelection,
  isMandatoryExternalReeferIncident,
  sortIncidentsByDispatcherPriority,
} from "./incident-workflow";
import { extractIncidentIdFromRealtimePayload, INCIDENT_REALTIME_EVENTS } from "@/lib/incident-notification-events";
import {
  getIncidentErrorMessage,
  getResolveIncidentErrorMessage,
} from "@/components/incidents/incident-formatters";

const incident = (overrides: Partial<TIncident> = {}): TIncident => ({
  incidentId: "incident-1",
  tripId: "trip-old",
  incidentType: INCIDENT_TYPE.ACCIDENT,
  severity: "LOW",
  riskLevel: "LOW",
  description: "Test incident",
  driverPaidAmount: 0,
  requiresRescue: false,
  expenseStatus: INCIDENT_EXPENSE_STATUS.NOT_REQUIRED,
  status: INCIDENT_STATUS.REPORTED,
  reportedBy: "user-1",
  reportedByUsername: "dispatcher",
  reportedAt: "2026-08-20T10:00:00+07:00",
  evidences: [],
  ...overrides,
});

describe("Dispatcher Incident acceptance state machine", () => {
  it("1. REPORTED hiển thị CTA đánh giá risk", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.REPORTED)).toBe("ASSESS_RISK");
  });

  it("2. LOW sửa tại chỗ: TRIAGED cho phép continue trip", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.TRIAGED)).toBe("CONTINUE_TRIP");
  });

  it("3. WARNING có reading tin cậy: MONITORING cho phép continue/reassess", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.MONITORING)).toBe("CONTINUE_TRIP");
  });

  it("4. UI theo response CRITICAL thay vì WARNING người dùng đã chọn", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.CONTAINMENT_REQUIRED)).toBe("CONFIRM_CONTAINMENT");
  });

  it("5. CRITICAL chưa containment không mở rescue form", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.CONTAINMENT_REQUIRED)).not.toBe("PLAN_RESCUE");
  });

  it("6. CRITICAL đã containment mở rescue planning", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.RESCUE_PLANNING)).toBe("PLAN_RESCUE");
  });

  it("7. VEHICLE_BREAKDOWN luôn được nhận diện là nhánh external bắt buộc", () => {
    expect(isMandatoryExternalReeferIncident(INCIDENT_TYPE.VEHICLE_BREAKDOWN)).toBe(true);
    expect(isMandatoryExternalReeferIncident(INCIDENT_TYPE.REEFER_BREAKDOWN)).toBe(true);
  });

  it("8. Breakdown ẩn toàn bộ legacy Quality/LPN/kho lạnh ngoài bằng một nhánh bắt buộc", () => {
    expect(isMandatoryExternalReeferIncident(incident({ incidentType: INCIDENT_TYPE.VEHICLE_BREAKDOWN }))).toBe(true);
    expect(isMandatoryExternalReeferIncident(INCIDENT_TYPE.TEMP_EXCURSION)).toBe(false);
  });

  it("9. Xe ngoài gửi payload tối giản và để backend tự xác định kho đích", () => {
    expect(getExternalReeferConfigurationBlocker({
      recommendedAction: "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE",
      requiresExternalVehicleRental: true,
    })).toBeNull();
    expect(getExternalReeferConfigurationBlocker({
      recommendedAction: "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE",
      requiresExternalVehicleRental: true,
    })).toBeNull();
    expect(buildExternalReeferConfirmationRequest()).toEqual({
      externalVehicleConfirmed: true,
    });
    expect(Object.keys(buildExternalReeferConfirmationRequest())).toEqual([
      "externalVehicleConfirmed",
    ]);
  });

  it("10. EXTERNAL_REEFER_IN_TRANSIT chỉ theo dõi Warehouse inbound", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.EXTERNAL_REEFER_IN_TRANSIT)).toBe("TRACK_EXTERNAL_REEFER");
  });

  it("11. READY_FOR_REDISPATCH mở manual dispatch Incident", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.READY_FOR_REDISPATCH)).toBe("CREATE_REDISPATCH_TRIP");
  });

  it("12. Thiếu hoặc bớt LPN bị chặn", () => {
    expect(hasExactLockedLpnSelection(["a", "b"], ["a"])).toBe(false);
    expect(hasExactLockedLpnSelection(["a", "b"], ["a", "b", "c"])).toBe(false);
    expect(hasExactLockedLpnSelection(["a", "b"], ["b", "a"])).toBe(true);
  });

  it("13. Manual dispatch thành công chuyển UI sang CTA mở trip mới", () => {
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.REDISPATCH_PLANNED)).toBe("OPEN_REDISPATCH_TRIP");
  });

  it("14. REDISPATCH_PLANNED chưa cho resolve", () => {
    expect(getResolutionBlocker(incident({
      incidentType: INCIDENT_TYPE.VEHICLE_BREAKDOWN,
      status: INCIDENT_STATUS.REDISPATCH_PLANNED,
    }))).toBe(
      "Chỉ được đóng Incident sau khi chuyến mới đã kẹp seal và xuất phát giao khách."
    );
  });

  it("15. REDISPATCHED_TO_CUSTOMER và expense hợp lệ mới cho resolve", () => {
    expect(getResolutionBlocker(incident({
      incidentType: INCIDENT_TYPE.REEFER_BREAKDOWN,
      status: INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER,
      driverPaidAmount: 100_000,
      expenseStatus: INCIDENT_EXPENSE_STATUS.REIMBURSED,
      reimbursedAmount: 100_000,
    }))).toBeNull();
    expect(getResolutionBlocker(incident({
      incidentType: INCIDENT_TYPE.REEFER_BREAKDOWN,
      status: INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER,
      driverPaidAmount: 100_000,
      expenseStatus: INCIDENT_EXPENSE_STATUS.APPROVED,
    }))).toBe(
      "Chưa thể đóng Incident vì khoản Driver ứng trước chưa được hoàn trả."
    );
  });

  it("không cho breakdown đóng tại external transit, ready hoặc redispatch planned", () => {
    for (const status of [
      INCIDENT_STATUS.EXTERNAL_REEFER_IN_TRANSIT,
      INCIDENT_STATUS.READY_FOR_REDISPATCH,
      INCIDENT_STATUS.REDISPATCH_PLANNED,
    ]) {
      expect(getResolutionBlocker(incident({
        incidentType: INCIDENT_TYPE.VEHICLE_BREAKDOWN,
        status,
      }))).toBe(
        "Chỉ được đóng Incident sau khi chuyến mới đã kẹp seal và xuất phát giao khách."
      );
    }
  });

  it("dịch lỗi resolve backend và quyền sang message Dispatcher", () => {
    expect(getResolveIncidentErrorMessage({
      response: {
        data: {
          message:
            "Vehicle/reefer breakdown can only be resolved after the new warehouse trip is sealed and dispatched to customers.",
        },
      },
    })).toBe(
      "Chỉ được đóng Incident sau khi chuyến mới đã kẹp seal và xuất phát giao khách."
    );
    expect(getResolveIncidentErrorMessage({
      response: { status: 403 },
    })).toBe("Bạn không có quyền đóng Incident.");
  });

  it("RESOLVED đổi badge thành Đã đóng và không còn action xử lý", () => {
    expect(getIncidentStatusLabel(INCIDENT_STATUS.RESOLVED).label).toBe(
      "Đã đóng"
    );
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.RESOLVED)).toBe(
      "READ_ONLY"
    );
  });

  it("16. SignalR inbound urgent lấy đúng Incident để refetch và hiện CTA", () => {
    expect(extractIncidentIdFromRealtimePayload({
      requiredAction: "CREATE_REDISPATCH_TRIP",
      priority: "URGENT",
      data: { incidentId: "incident-urgent" },
    })).toBe("incident-urgent");
    expect(getIncidentPrimaryAction(INCIDENT_STATUS.READY_FOR_REDISPATCH)).toBe("CREATE_REDISPATCH_TRIP");
  });

  it("17. API lỗi giữ form và hiển thị message/errors backend", () => {
    expect(getIncidentErrorMessage({
      response: { data: { message: "Location ACTIVE không trùng địa chỉ kho" } },
    }, "fallback")).toBe("Location ACTIVE không trùng địa chỉ kho");
    expect(getIncidentErrorMessage({
      response: { data: { errors: { lpnIds: ["Phải chọn đủ LPN"] } } },
    }, "fallback")).toBe("Phải chọn đủ LPN");
  });

  it("ưu tiên containment, rescue planning, redispatch và SLA overdue", () => {
    const sorted = sortIncidentsByDispatcherPriority([
      incident({ incidentId: "normal", status: INCIDENT_STATUS.MONITORING }),
      incident({ incidentId: "redispatch", status: INCIDENT_STATUS.READY_FOR_REDISPATCH }),
      incident({ incidentId: "rescue", status: INCIDENT_STATUS.RESCUE_PLANNING }),
      incident({ incidentId: "containment", status: INCIDENT_STATUS.CONTAINMENT_REQUIRED }),
    ]);
    expect(sorted.map((item) => item.incidentId)).toEqual([
      "containment", "rescue", "redispatch", "normal",
    ]);
  });

  it("đăng ký đầy đủ 15 SignalR event Incident của Dispatcher", () => {
    expect(INCIDENT_REALTIME_EVENTS).toEqual(expect.arrayContaining([
      "IncidentReported",
      "IncidentEvidenceAdded",
      "IncidentRiskAssessed",
      "ExternalReeferDispatched",
      "IncidentCargoInboundedAtRouteWarehouse",
      "IncidentRedispatchPlanned",
      "IncidentRedispatchPickingStarted",
      "IncidentRedispatchLpnPicked",
      "IncidentRedispatchLoadingCompleted",
      "IncidentRedispatchSealed",
      "IncidentRedispatchedToCustomer",
      "IncidentExpenseApproved",
      "IncidentExpenseReimbursed",
      "IncidentResolved",
      "IncidentSlaEscalated",
    ]));
  });
});
