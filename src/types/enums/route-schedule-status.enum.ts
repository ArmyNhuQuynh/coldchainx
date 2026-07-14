export const ROUTE_SCHEDULE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type TRouteScheduleStatus =
  (typeof ROUTE_SCHEDULE_STATUS)[keyof typeof ROUTE_SCHEDULE_STATUS];

export const normalizeRouteScheduleStatus = (
  status?: string | null
): TRouteScheduleStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case ROUTE_SCHEDULE_STATUS.ACTIVE:
      return ROUTE_SCHEDULE_STATUS.ACTIVE;
    case ROUTE_SCHEDULE_STATUS.INACTIVE:
      return ROUTE_SCHEDULE_STATUS.INACTIVE;
    default:
      return null;
  }
};

export const getRouteScheduleStatusLabel = (status?: string | null) => {
  switch (normalizeRouteScheduleStatus(status)) {
    case ROUTE_SCHEDULE_STATUS.ACTIVE:
      return {
        label: "Hoạt động",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case ROUTE_SCHEDULE_STATUS.INACTIVE:
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

export const ROUTE_SCHEDULE_STATUS_OPTIONS = [
  {
    label: getRouteScheduleStatusLabel(ROUTE_SCHEDULE_STATUS.ACTIVE).label,
    value: ROUTE_SCHEDULE_STATUS.ACTIVE,
  },
  {
    label: getRouteScheduleStatusLabel(ROUTE_SCHEDULE_STATUS.INACTIVE).label,
    value: ROUTE_SCHEDULE_STATUS.INACTIVE,
  },
];
