export const IOT_DEVICE_STATUS = {
  AVAILABLE: "Available",
  ASSIGNED: "ASSIGNED",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type TIotDeviceStatus =
  (typeof IOT_DEVICE_STATUS)[keyof typeof IOT_DEVICE_STATUS];

export const normalizeIotDeviceStatus = (
  status?: string | number | null
): TIotDeviceStatus | null => {
  if (status === null || status === undefined || status === "") return null;

  const normalized = String(status).trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case "AVAILABLE":
    case "READY":
      return IOT_DEVICE_STATUS.AVAILABLE;
    case "ASSIGNED":
    case "IN_USE":
      return IOT_DEVICE_STATUS.ASSIGNED;
    case "ONLINE":
      return IOT_DEVICE_STATUS.ONLINE;
    case "OFFLINE":
      return IOT_DEVICE_STATUS.OFFLINE;
    case "ACTIVE":
      return IOT_DEVICE_STATUS.ACTIVE;
    case "INACTIVE":
    case "DISABLED":
      return IOT_DEVICE_STATUS.INACTIVE;
    default:
      return null;
  }
};

export const getIotDeviceStatusLabel = (status?: string | number | null) => {
  const normalized = normalizeIotDeviceStatus(status);

  switch (normalized) {
    case IOT_DEVICE_STATUS.AVAILABLE:
      return {
        label: "Khả dụng",
        className: "border-sky-200 bg-sky-50 text-sky-700",
      };
    case IOT_DEVICE_STATUS.ASSIGNED:
      return {
        label: "Đã gắn xe",
        className: "border-indigo-200 bg-indigo-50 text-indigo-700",
      };
    case IOT_DEVICE_STATUS.ONLINE:
      return {
        label: "Đang online",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case IOT_DEVICE_STATUS.OFFLINE:
      return {
        label: "Mất kết nối",
        className: "border-red-200 bg-red-50 text-red-700",
      };
    case IOT_DEVICE_STATUS.ACTIVE:
      return {
        label: "Hoạt động",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case IOT_DEVICE_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    default:
      return {
        label: status ? String(status) : "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
};

export const IOT_DEVICE_STATUS_OPTIONS = Object.values(IOT_DEVICE_STATUS).map(
  (value) => ({
    value,
    label: getIotDeviceStatusLabel(value).label,
  })
);
