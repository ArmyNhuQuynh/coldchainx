export const IOT_DEVICE_STATUS = {
  AVAILABLE: "AVAILABLE",
  ASSIGNED: "ASSIGNED",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type TIotDeviceStatus =
  (typeof IOT_DEVICE_STATUS)[keyof typeof IOT_DEVICE_STATUS];

type TIotDeviceStatusSource = {
  vehicleId?: string | null;
  status?: string | number | null;
};

type TIotDeviceConnectionSource = {
  isOnline?: boolean | null;
  lastPingTime?: string | null;
  status?: string | number | null;
};

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
        label: "Hoạt động (dữ liệu cũ)",
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

export const getIotDeviceDisplayStatus = ({
  vehicleId,
  status,
}: TIotDeviceStatusSource): TIotDeviceStatus => {
  const normalized = normalizeIotDeviceStatus(status);

  if (normalized === IOT_DEVICE_STATUS.INACTIVE) {
    return IOT_DEVICE_STATUS.INACTIVE;
  }

  if (
    normalized === IOT_DEVICE_STATUS.ONLINE ||
    normalized === IOT_DEVICE_STATUS.OFFLINE
  ) {
    return normalized;
  }

  return vehicleId
    ? IOT_DEVICE_STATUS.ASSIGNED
    : IOT_DEVICE_STATUS.AVAILABLE;
};

export const getIotDeviceAssignmentLabel = (vehicleId?: string | null) =>
  vehicleId
    ? {
        label: "Đã gắn xe",
        className: "border-indigo-200 bg-indigo-50 text-indigo-700",
      }
    : {
        label: "Chưa gắn xe",
        className: "border-sky-200 bg-sky-50 text-sky-700",
      };

export const getIotDeviceConnectionLabel = ({
  isOnline,
  lastPingTime,
  status,
}: TIotDeviceConnectionSource) => {
  const normalizedStatus = normalizeIotDeviceStatus(status);
  const isConnected =
    isOnline === true || normalizedStatus === IOT_DEVICE_STATUS.ONLINE;
  const isDisconnected =
    normalizedStatus === IOT_DEVICE_STATUS.OFFLINE ||
    (isOnline === false && Boolean(lastPingTime));

  if (isConnected) {
    return {
      label: "Đang online",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (isDisconnected) {
    return {
      label: "Mất kết nối",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    label: "Chưa có dữ liệu",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  };
};

export const IOT_DEVICE_STATUS_OPTIONS = [
  IOT_DEVICE_STATUS.AVAILABLE,
  IOT_DEVICE_STATUS.ASSIGNED,
  IOT_DEVICE_STATUS.INACTIVE,
].map((value) => ({
    value,
    label: getIotDeviceStatusLabel(value).label,
  }));

export const getIotDeviceEditableStatusOptions = (
  currentStatus?: string | number | null,
  isAssigned = false
) => {
  const normalizedCurrent = normalizeIotDeviceStatus(currentStatus);
  const canonicalStatus = isAssigned
    ? IOT_DEVICE_STATUS.ASSIGNED
    : IOT_DEVICE_STATUS.AVAILABLE;
  const statuses = [
    normalizedCurrent,
    canonicalStatus,
    IOT_DEVICE_STATUS.INACTIVE,
  ].filter(
    (status, index, values): status is TIotDeviceStatus =>
      Boolean(status) && values.indexOf(status) === index
  );

  return statuses.map((value) => ({
    value,
    label: getIotDeviceStatusLabel(value).label,
  }));
};
