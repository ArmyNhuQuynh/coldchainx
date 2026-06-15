export const DRIVER_STATUS = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  OFFLINE: "OFFLINE",
  INACTIVE: "INACTIVE",
} as const;

export type TDriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export function normalizeDriverStatus(
  status: string | number | null | undefined
): TDriverStatus | null {
  if (status == null || status === "") {
    return null;
  }

  const normalizedStatus = String(status).trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalizedStatus) {
    case "AVAILABLE":
    case "0":
      return DRIVER_STATUS.AVAILABLE;
    case "ON_TRIP":
    case "ONTRIP":
    case "1":
      return DRIVER_STATUS.ON_TRIP;
    case "OFFLINE":
    case "2":
      return DRIVER_STATUS.OFFLINE;
    case "INACTIVE":
    case "3":
      return DRIVER_STATUS.INACTIVE;
    default:
      return null;
  }
}

export function getDriverStatusLabel(status: string | number | null | undefined): {
  label: string;
  className: string;
} {
  switch (normalizeDriverStatus(status)) {
    case DRIVER_STATUS.AVAILABLE:
      return {
        label: "Sẵn sàng",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case DRIVER_STATUS.ON_TRIP:
      return {
        label: "Đang vận chuyển",
        className: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case DRIVER_STATUS.OFFLINE:
      return {
        label: "Ngoại tuyến",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    case DRIVER_STATUS.INACTIVE:
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
