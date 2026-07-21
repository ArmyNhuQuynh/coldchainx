export const VEHICLE_STATUS = {
  ACTIVE: "ACTIVE",
  PLANNING: "PLANNING",
  ON_TRIP: "ON_TRIP",
  MAINTENANCE: "MAINTENANCE",
  MAINTENANCE_PENDING: "MAINTENANCE_PENDING",
  SUSPENDED_DOCS: "SUSPENDED_DOCS",
  INACTIVE: "INACTIVE",
  DELETED: "DELETED",
} as const;

export type TVehicleStatus =
  (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export function normalizeVehicleStatus(
  status: string | number | null | undefined
): TVehicleStatus | null {
  if (status == null || status === "") return null;

  const normalized = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "_");

  switch (normalized) {
    case "ACTIVE":
    case "AVAILABLE":
    case "READY":
    case "0":
      return VEHICLE_STATUS.ACTIVE;
    case "PLANNING":
    case "PLANNED":
    case "3":
      return VEHICLE_STATUS.PLANNING;
    case "ONTRIP":
    case "ON_TRIP":
    case "INUSE":
    case "IN_USE":
    case "BUSY":
    case "4":
      return VEHICLE_STATUS.ON_TRIP;
    case "UNDERMAINTENANCE":
    case "UNDER_MAINTENANCE":
    case "MAINTENANCE":
    case "2":
      return VEHICLE_STATUS.MAINTENANCE;
    case "MAINTENANCEPENDING":
    case "MAINTENANCE_PENDING":
    case "PENDING_MAINTENANCE":
    case "WAITING_MAINTENANCE":
      return VEHICLE_STATUS.MAINTENANCE_PENDING;
    case "SUSPENDED_DOCS":
      return VEHICLE_STATUS.SUSPENDED_DOCS;
    case "INACTIVE":
    case "DISABLED":
    case "1":
      return VEHICLE_STATUS.INACTIVE;
    case "DELETED":
      return VEHICLE_STATUS.DELETED;
    default:
      return null;
  }
}

export function getVehicleStatusLabel(
  status: string | number | null | undefined
): { label: string; className: string } {
  switch (normalizeVehicleStatus(status)) {
    case VEHICLE_STATUS.ACTIVE:
      return {
        label: "Sẵn sàng",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case VEHICLE_STATUS.PLANNING:
      return {
        label: "Đã xếp lịch",
        className: "border-cyan-200 bg-cyan-50 text-cyan-700",
      };
    case VEHICLE_STATUS.ON_TRIP:
      return {
        label: "Đang vận chuyển",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case VEHICLE_STATUS.MAINTENANCE:
      return {
        label: "Bảo trì",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case VEHICLE_STATUS.MAINTENANCE_PENDING:
      return {
        label: "Chờ bảo dưỡng",
        className: "border-yellow-200 bg-yellow-50 text-yellow-800",
      };
    case VEHICLE_STATUS.SUSPENDED_DOCS:
      return {
        label: "Thiếu hoặc hết hạn giấy tờ",
        className: "border-orange-200 bg-orange-50 text-orange-700",
      };
    case VEHICLE_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    case VEHICLE_STATUS.DELETED:
      return {
        label: "Đã xóa",
        className: "border-slate-200 bg-slate-100 text-slate-500",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
}
