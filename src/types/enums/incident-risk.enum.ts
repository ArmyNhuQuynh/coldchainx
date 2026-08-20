export const INCIDENT_RISK = {
  LOW: "LOW",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

export type TIncidentRisk =
  (typeof INCIDENT_RISK)[keyof typeof INCIDENT_RISK];

export const TEMPERATURE_SOURCE = {
  NONE: "NONE",
  IOT: "IOT",
  CARGO_GAUGE: "CARGO_GAUGE",
  BACKUP_THERMOMETER: "BACKUP_THERMOMETER",
  TIMESTAMPED_PHOTO: "TIMESTAMPED_PHOTO",
} as const;

export type TTemperatureSource =
  (typeof TEMPERATURE_SOURCE)[keyof typeof TEMPERATURE_SOURCE];

export const INCIDENT_RISK_OPTIONS = [
  { value: INCIDENT_RISK.LOW, label: "LOW · Thấp" },
  { value: INCIDENT_RISK.WARNING, label: "WARNING · Cảnh báo" },
  { value: INCIDENT_RISK.CRITICAL, label: "CRITICAL · Nghiêm trọng" },
] as const;

export const TEMPERATURE_SOURCE_OPTIONS = [
  { value: TEMPERATURE_SOURCE.IOT, label: "IoT trên chuyến" },
  { value: TEMPERATURE_SOURCE.CARGO_GAUGE, label: "Đồng hồ thùng hàng" },
  { value: TEMPERATURE_SOURCE.BACKUP_THERMOMETER, label: "Nhiệt kế dự phòng" },
  { value: TEMPERATURE_SOURCE.TIMESTAMPED_PHOTO, label: "Ảnh có thời gian" },
] as const;

export const getIncidentRiskLabel = (risk?: string | null) => {
  switch (risk?.trim().toUpperCase()) {
    case INCIDENT_RISK.LOW:
      return {
        label: "LOW",
        className: "border-emerald-600 bg-emerald-50 text-emerald-700",
      };
    case INCIDENT_RISK.WARNING:
      return {
        label: "WARNING",
        className: "border-amber-500 bg-amber-50 text-amber-800",
      };
    case INCIDENT_RISK.CRITICAL:
      return {
        label: "CRITICAL",
        className: "border-rose-600 bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: risk || "Chưa đánh giá",
        className: "border-muted-foreground/40 text-muted-foreground",
      };
  }
};
