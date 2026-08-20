import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_EXPENSE_STATUS } from "@/types/enums/incident-expense-status.enum";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE } from "@/types/enums/incident-type.enum";

export type TIncidentPrimaryAction =
  | "ASSESS_RISK"
  | "CONTINUE_TRIP"
  | "CONFIRM_CONTAINMENT"
  | "PLAN_RESCUE"
  | "TRACK_RESCUE"
  | "TRACK_EXTERNAL_REEFER"
  | "CREATE_REDISPATCH_TRIP"
  | "OPEN_REDISPATCH_TRIP"
  | "TRACK_TRIP"
  | "EMERGENCY_PLAN"
  | "RESOLVE"
  | "READ_ONLY";

export const isMandatoryExternalReeferIncident = (
  incidentOrType: Pick<TIncident, "incidentType"> | string
) => {
  const type =
    typeof incidentOrType === "string"
      ? incidentOrType
      : incidentOrType.incidentType;
  return (
    type === INCIDENT_TYPE.VEHICLE_BREAKDOWN ||
    type === INCIDENT_TYPE.REEFER_BREAKDOWN
  );
};

export const getIncidentPrimaryAction = (
  status?: string | null
): TIncidentPrimaryAction => {
  switch (status) {
    case INCIDENT_STATUS.REPORTED:
      return "ASSESS_RISK";
    case INCIDENT_STATUS.TRIAGED:
    case INCIDENT_STATUS.MONITORING:
      return "CONTINUE_TRIP";
    case INCIDENT_STATUS.CONTAINMENT_REQUIRED:
      return "CONFIRM_CONTAINMENT";
    case INCIDENT_STATUS.RESCUE_PLANNING:
      return "PLAN_RESCUE";
    case INCIDENT_STATUS.RESCUE_DISPATCHED:
      return "TRACK_RESCUE";
    case INCIDENT_STATUS.EXTERNAL_REEFER_IN_TRANSIT:
      return "TRACK_EXTERNAL_REEFER";
    case INCIDENT_STATUS.READY_FOR_REDISPATCH:
      return "CREATE_REDISPATCH_TRIP";
    case INCIDENT_STATUS.REDISPATCH_PLANNED:
      return "OPEN_REDISPATCH_TRIP";
    case INCIDENT_STATUS.TRANSLOAD_COMPLETED:
    case INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER:
    case INCIDENT_STATUS.CONTINUED:
      return "RESOLVE";
    case INCIDENT_STATUS.AT_INTERNAL_COLD_STORAGE:
      return "TRACK_TRIP";
    case INCIDENT_STATUS.AWAITING_EMERGENCY_PLAN:
      return "EMERGENCY_PLAN";
    case INCIDENT_STATUS.RESOLVED:
    default:
      return "READ_ONLY";
  }
};

export const getExpenseResolutionBlocker = (
  incident: Pick<
    TIncident,
    "driverPaidAmount" | "expenseStatus" | "reimbursedAmount"
  >
) => {
  if (Number(incident.driverPaidAmount ?? 0) <= 0) return null;
  if (
    incident.expenseStatus !== INCIDENT_EXPENSE_STATUS.REIMBURSED ||
    incident.reimbursedAmount == null
  ) {
    return "Chưa thể đóng Incident vì khoản Driver ứng trước chưa được hoàn trả.";
  }
  return null;
};

export const getResolutionBlocker = (
  incident: Pick<
    TIncident,
    | "incidentType"
    | "status"
    | "driverPaidAmount"
    | "expenseStatus"
    | "reimbursedAmount"
  >
) => {
  if (isMandatoryExternalReeferIncident(incident)) {
    if (incident.status !== INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER) {
      return "Chỉ được đóng Incident sau khi chuyến mới đã kẹp seal và xuất phát giao khách.";
    }
  }

  const expenseBlocker = getExpenseResolutionBlocker(incident);
  if (expenseBlocker) return expenseBlocker;

  if (isMandatoryExternalReeferIncident(incident)) return null;

  const allowedStatuses = new Set<string>([
    INCIDENT_STATUS.CONTINUED,
    INCIDENT_STATUS.TRANSLOAD_COMPLETED,
    INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER,
  ]);
  return allowedStatuses.has(incident.status)
    ? null
    : "Trạng thái hiện tại chưa đủ điều kiện đóng Incident.";
};

export const isSlaOverdue = (
  incident: Pick<TIncident, "slaDueAt" | "status">,
  now = new Date()
) => {
  if (!incident.slaDueAt || incident.status === INCIDENT_STATUS.RESOLVED) {
    return false;
  }
  const dueAt = new Date(incident.slaDueAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt.getTime() < now.getTime();
};

export const hasExactLockedLpnSelection = (
  requiredLpnIds: string[],
  selectedLpnIds: string[]
) => {
  const required = new Set(requiredLpnIds);
  const selected = new Set(selectedLpnIds);
  return (
    required.size > 0 &&
    required.size === selected.size &&
    [...required].every((lpnId) => selected.has(lpnId))
  );
};

export const getExternalReeferConfigurationBlocker = (plan: {
  recommendedAction?: string | null;
  requiresExternalVehicleRental?: boolean;
}) => {
  if (plan.recommendedAction !== "EXTERNAL_REEFER_TO_ROUTE_WAREHOUSE") {
    return "Breakdown phải dùng phương án xe lạnh ngoài về kho đích tuyến.";
  }
  if (!plan.requiresExternalVehicleRental) {
    return "Backend chưa xác nhận yêu cầu thuê xe lạnh ngoài.";
  }
  return null;
};

export const buildExternalReeferConfirmationRequest = () => ({
  externalVehicleConfirmed: true as const,
});

const STATUS_PRIORITY: Record<string, number> = {
  [INCIDENT_STATUS.CONTAINMENT_REQUIRED]: 0,
  [INCIDENT_STATUS.RESCUE_PLANNING]: 1,
  [INCIDENT_STATUS.READY_FOR_REDISPATCH]: 2,
};

export const sortIncidentsByDispatcherPriority = (
  incidents: TIncident[],
  now = new Date()
) =>
  [...incidents].sort((left, right) => {
    const leftPriority =
      STATUS_PRIORITY[left.status] ?? (isSlaOverdue(left, now) ? 3 : 4);
    const rightPriority =
      STATUS_PRIORITY[right.status] ?? (isSlaOverdue(right, now) ? 3 : 4);
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    return (
      new Date(right.reportedAt ?? 0).getTime() -
      new Date(left.reportedAt ?? 0).getTime()
    );
  });
