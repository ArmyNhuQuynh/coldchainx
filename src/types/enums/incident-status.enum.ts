export const INCIDENT_STATUS = {
  REPORTED: "REPORTED",
  TRIAGED: "TRIAGED",
  MONITORING: "MONITORING",
  CONTAINMENT_REQUIRED: "CONTAINMENT_REQUIRED",
  RESCUE_PLANNING: "RESCUE_PLANNING",
  CONTINUED: "CONTINUED",
  RESCUE_DISPATCHED: "RESCUE_DISPATCHED",
  TRANSLOAD_COMPLETED: "TRANSLOAD_COMPLETED",
  EXTERNAL_REEFER_IN_TRANSIT: "EXTERNAL_REEFER_IN_TRANSIT",
  READY_FOR_REDISPATCH: "READY_FOR_REDISPATCH",
  REDISPATCH_PLANNED: "REDISPATCH_PLANNED",
  REDISPATCHED_TO_CUSTOMER: "REDISPATCHED_TO_CUSTOMER",
  AT_INTERNAL_COLD_STORAGE: "AT_INTERNAL_COLD_STORAGE",
  AWAITING_EMERGENCY_PLAN: "AWAITING_EMERGENCY_PLAN",
  RESOLVED: "RESOLVED",
} as const;

export type TIncidentStatus =
  (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

export const normalizeIncidentStatus = (
  status?: string | null
): TIncidentStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  return Object.values(INCIDENT_STATUS).includes(normalized as TIncidentStatus)
    ? (normalized as TIncidentStatus)
    : null;
};

export const getIncidentStatusLabel = (status?: string | null) => {
  switch (normalizeIncidentStatus(status)) {
    case INCIDENT_STATUS.REPORTED:
      return {
        label: "Chờ xử lý",
        className: "border-amber-500 bg-transparent text-amber-700",
      };
    case INCIDENT_STATUS.TRIAGED:
      return {
        label: "Đã phân loại",
        className: "border-emerald-500 bg-emerald-50 text-emerald-700",
      };
    case INCIDENT_STATUS.MONITORING:
      return {
        label: "Đang theo dõi",
        className: "border-amber-500 bg-amber-50 text-amber-800",
      };
    case INCIDENT_STATUS.CONTAINMENT_REQUIRED:
      return {
        label: "Cần bảo toàn hàng",
        className: "border-rose-600 bg-rose-50 text-rose-700",
      };
    case INCIDENT_STATUS.RESCUE_PLANNING:
      return {
        label: "Lập phương án cứu hộ",
        className: "border-orange-600 bg-orange-50 text-orange-800",
      };
    case INCIDENT_STATUS.CONTINUED:
      return {
        label: "Đã tiếp tục chuyến",
        className: "border-blue-500 bg-transparent text-blue-700",
      };
    case INCIDENT_STATUS.RESCUE_DISPATCHED:
      return {
        label: "Đã điều xe cứu hộ",
        className: "border-blue-500 bg-transparent text-blue-700",
      };
    case INCIDENT_STATUS.TRANSLOAD_COMPLETED:
      return {
        label: "Đã sang hàng",
        className: "border-emerald-500 bg-transparent text-emerald-700",
      };
    case INCIDENT_STATUS.EXTERNAL_REEFER_IN_TRANSIT:
      return {
        label: "Đang chờ kho inbound cứu hộ",
        className: "border-sky-600 bg-sky-50 text-sky-800",
      };
    case INCIDENT_STATUS.READY_FOR_REDISPATCH:
      return {
        label: "Sẵn sàng tạo lại chuyến · URGENT",
        className: "border-violet-600 bg-violet-50 text-violet-800",
      };
    case INCIDENT_STATUS.REDISPATCH_PLANNED:
      return {
        label: "Đã tạo trip mới",
        className: "border-violet-500 bg-violet-50 text-violet-700",
      };
    case INCIDENT_STATUS.REDISPATCHED_TO_CUSTOMER:
      return {
        label: "Đang giao lại cho khách",
        className: "border-blue-600 bg-blue-50 text-blue-700",
      };
    case INCIDENT_STATUS.AT_INTERNAL_COLD_STORAGE:
      return {
        label: "Tại kho lạnh nội bộ",
        className: "border-cyan-600 bg-cyan-50 text-cyan-800",
      };
    case INCIDENT_STATUS.AWAITING_EMERGENCY_PLAN:
      return {
        label: "Chờ phương án khẩn cấp",
        className: "border-rose-600 bg-rose-50 text-rose-700",
      };
    case INCIDENT_STATUS.RESOLVED:
      return {
        label: "Đã đóng",
        className: "border-emerald-500 bg-transparent text-emerald-700",
      };
    default:
      return {
        label: status || "Không xác định",
        className: "border-muted-foreground/40 bg-transparent text-muted-foreground",
      };
  }
};

export const INCIDENT_STATUS_FILTER_OPTIONS = Object.values(INCIDENT_STATUS).map(
  (value) => ({
    value,
    label: getIncidentStatusLabel(value).label,
  })
);
