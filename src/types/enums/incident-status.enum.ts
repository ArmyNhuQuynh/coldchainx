export const INCIDENT_STATUS = {
  REPORTED: "REPORTED",
  CONTINUED: "CONTINUED",
  RESCUE_DISPATCHED: "RESCUE_DISPATCHED",
  TRANSLOAD_COMPLETED: "TRANSLOAD_COMPLETED",
  RESOLVED: "RESOLVED",
} as const;

export type TIncidentStatus =
  (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

export const normalizeIncidentStatus = (
  status?: string | null
): TIncidentStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case INCIDENT_STATUS.REPORTED:
      return INCIDENT_STATUS.REPORTED;
    case INCIDENT_STATUS.CONTINUED:
      return INCIDENT_STATUS.CONTINUED;
    case INCIDENT_STATUS.RESCUE_DISPATCHED:
      return INCIDENT_STATUS.RESCUE_DISPATCHED;
    case INCIDENT_STATUS.TRANSLOAD_COMPLETED:
      return INCIDENT_STATUS.TRANSLOAD_COMPLETED;
    case INCIDENT_STATUS.RESOLVED:
      return INCIDENT_STATUS.RESOLVED;
    default:
      return null;
  }
};

export const getIncidentStatusLabel = (status?: string | null) => {
  switch (normalizeIncidentStatus(status)) {
    case INCIDENT_STATUS.REPORTED:
      return {
        label: "Chờ xử lý",
        className: "border-amber-500 bg-transparent text-amber-700",
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
    case INCIDENT_STATUS.RESOLVED:
      return {
        label: "Đã giải quyết",
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
