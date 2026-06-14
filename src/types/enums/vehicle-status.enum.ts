export const VEHICLE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  UNDER_MAINTENANCE: "UnderMaintenance",
  ON_TRIP: "OnTrip",
} as const;

export type TVehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export function normalizeVehicleStatus(
  status: string | number | null | undefined
): TVehicleStatus | null {
  if (status == null || status === "") {
    return null;
  }

  const normalizedStatus = String(status).trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalizedStatus) {
    case "ACTIVE":
    case "AVAILABLE":
    case "READY":
    case "0":
      return VEHICLE_STATUS.ACTIVE;
    case "ONTRIP":
    case "ON_TRIP":
    case "INUSE":
    case "IN_USE":
    case "BUSY":
    case "1":
      return VEHICLE_STATUS.ON_TRIP;
    case "UNDERMAINTENANCE":
    case "UNDER_MAINTENANCE":
    case "MAINTENANCE":
    case "2":
      return VEHICLE_STATUS.UNDER_MAINTENANCE;
    case "INACTIVE":
    case "DISABLED":
    case "3":
      return VEHICLE_STATUS.INACTIVE;
    default:
      return null;
  }
}

export function getVehicleStatusLabel(status: string | number | null | undefined): {
  label: string;
  className: string;
} {
  switch (normalizeVehicleStatus(status)) {
    case VEHICLE_STATUS.ACTIVE:
      return {
        label: "Sẵn sàng",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case VEHICLE_STATUS.ON_TRIP:
      return {
        label: "Đang vận chuyển",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case VEHICLE_STATUS.UNDER_MAINTENANCE:
      return {
        label: "Bảo trì",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case VEHICLE_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    default:
      return {
        label: "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
}
