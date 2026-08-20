import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_EXPENSE_STATUS } from "@/types/enums/incident-expense-status.enum";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { INCIDENT_TYPE } from "@/types/enums/incident-type.enum";
import { normalizeUserRole, USER_ROLE } from "@/types/enums/user-role.enum";

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
  incidentOrType: Pick<TIncident, "incidentType"> | string,
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
  status?: string | null,
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
  >,
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

export type TIncidentResolveEligibility = {
  allowed: boolean;
  reason?: string;
};

export const getIncidentResolveEligibility = (
  incident: TIncident,
  currentRole?: string | null,
): TIncidentResolveEligibility => {
  const role = normalizeUserRole(currentRole);
  if (role !== USER_ROLE.DISPATCHER && role !== USER_ROLE.ADMIN) {
    return { allowed: false, reason: "Bạn không có quyền đóng Incident." };
  }

  if (incident.status === INCIDENT_STATUS.RESOLVED) {
    return { allowed: false, reason: "Incident đã được đóng." };
  }

  const expenseBlocker = getExpenseResolutionBlocker(incident);
  if (expenseBlocker) {
    return { allowed: false, reason: expenseBlocker };
  }

  if (!incident.requiresRescue) {
    return incident.status === INCIDENT_STATUS.CONTINUED
      ? { allowed: true }
      : {
          allowed: false,
          reason: "Chuyến phải được tiếp tục trước khi đóng Incident.",
        };
  }

  if (isMandatoryExternalReeferIncident(incident)) {
    const hasRedispatchVehicle =
      Boolean(incident.replacementVehicleId) &&
      (incident.status === INCIDENT_STATUS.REDISPATCH_PLANNED ||
        incident.status === INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER);

    return hasRedispatchVehicle
      ? { allowed: true }
      : {
          allowed: false,
          reason:
            "Cần tạo chuyến mới bằng xe ColdChainX trước khi đóng Incident.",
        };
  }

  const replacementDispatched =
    Boolean(incident.replacementVehicleId) &&
    Boolean(incident.rescueDispatchedAt);

  return replacementDispatched
    ? { allowed: true }
    : {
        allowed: false,
        reason: "Cần điều xe thay thế trước khi đóng Incident.",
      };
};

export const getResolutionBlocker = (
  incident: TIncident,
  currentRole: string | null = USER_ROLE.DISPATCHER,
) => getIncidentResolveEligibility(incident, currentRole).reason ?? null;

export const isSlaOverdue = (
  incident: Pick<TIncident, "slaDueAt" | "status">,
  now = new Date(),
) => {
  if (!incident.slaDueAt || incident.status === INCIDENT_STATUS.RESOLVED) {
    return false;
  }
  const dueAt = new Date(incident.slaDueAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt.getTime() < now.getTime();
};

export const hasExactLockedLpnSelection = (
  requiredLpnIds: string[],
  selectedLpnIds: string[],
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
  now = new Date(),
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
