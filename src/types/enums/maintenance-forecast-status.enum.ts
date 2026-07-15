export const MAINTENANCE_FORECAST_STATUS = {
  SAFE: "SAFE",
  WARNING: "WARNING",
  OVERDUE: "OVERDUE",
} as const;

export type TMaintenanceForecastStatus =
  (typeof MAINTENANCE_FORECAST_STATUS)[keyof typeof MAINTENANCE_FORECAST_STATUS];

export function getMaintenanceForecastStatusLabel(
  status: string | null | undefined
): { label: string; className: string } {
  switch (status?.toUpperCase()) {
    case MAINTENANCE_FORECAST_STATUS.SAFE:
      return {
        label: "An toàn",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case MAINTENANCE_FORECAST_STATUS.WARNING:
      return {
        label: "Cần theo dõi",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case MAINTENANCE_FORECAST_STATUS.OVERDUE:
      return {
        label: "Quá hạn",
        className: "border-red-200 bg-red-50 text-red-700",
      };
    default:
      return {
        label: status ?? "Không xác định",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
  }
}
