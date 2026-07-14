export const ROUTE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type TRouteStatus = (typeof ROUTE_STATUS)[keyof typeof ROUTE_STATUS];

export const normalizeRouteStatus = (
  status?: string | null
): TRouteStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case ROUTE_STATUS.ACTIVE:
      return ROUTE_STATUS.ACTIVE;
    case ROUTE_STATUS.INACTIVE:
      return ROUTE_STATUS.INACTIVE;
    default:
      return null;
  }
};

export const getRouteStatusLabel = (status?: string | null) => {
  switch (normalizeRouteStatus(status)) {
    case ROUTE_STATUS.ACTIVE:
      return {
        label: "Hoạt động",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case ROUTE_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    default:
      return {
        label: status || "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
};

export const ROUTE_STATUS_OPTIONS = [
  {
    label: getRouteStatusLabel(ROUTE_STATUS.ACTIVE).label,
    value: ROUTE_STATUS.ACTIVE,
  },
  {
    label: getRouteStatusLabel(ROUTE_STATUS.INACTIVE).label,
    value: ROUTE_STATUS.INACTIVE,
  },
];
