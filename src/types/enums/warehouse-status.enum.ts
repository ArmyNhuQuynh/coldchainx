export const WAREHOUSE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  MAINTENANCE: "MAINTENANCE",
} as const;

export type TWarehouseStatus =
  (typeof WAREHOUSE_STATUS)[keyof typeof WAREHOUSE_STATUS];

export const normalizeWarehouseStatus = (
  status?: string | null
): TWarehouseStatus | null => {
  if (!status) return null;

  const normalized = status.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case WAREHOUSE_STATUS.ACTIVE:
      return WAREHOUSE_STATUS.ACTIVE;
    case WAREHOUSE_STATUS.INACTIVE:
      return WAREHOUSE_STATUS.INACTIVE;
    case WAREHOUSE_STATUS.MAINTENANCE:
      return WAREHOUSE_STATUS.MAINTENANCE;
    default:
      return null;
  }
};

export const getWarehouseStatusLabel = (status?: string | null) => {
  switch (normalizeWarehouseStatus(status)) {
    case WAREHOUSE_STATUS.ACTIVE:
      return {
        label: "Hoạt động",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case WAREHOUSE_STATUS.INACTIVE:
      return {
        label: "Ngừng hoạt động",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    case WAREHOUSE_STATUS.MAINTENANCE:
      return {
        label: "Bảo trì",
        className: "border-amber-200 bg-amber-50 text-amber-700",
      };
    default:
      return {
        label: status || "Không xác định",
        className: "border-red-200 bg-red-50 text-red-700",
      };
  }
};

export const WAREHOUSE_STATUS_OPTIONS = [
  {
    label: getWarehouseStatusLabel(WAREHOUSE_STATUS.ACTIVE).label,
    value: WAREHOUSE_STATUS.ACTIVE,
  },
  {
    label: getWarehouseStatusLabel(WAREHOUSE_STATUS.INACTIVE).label,
    value: WAREHOUSE_STATUS.INACTIVE,
  },
  {
    label: getWarehouseStatusLabel(WAREHOUSE_STATUS.MAINTENANCE).label,
    value: WAREHOUSE_STATUS.MAINTENANCE,
  },
];
