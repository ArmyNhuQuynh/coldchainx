export const WAREHOUSE_TYPE = {
  DRY: "DRY",
  COLD: "COLD",
  BONDED: "BONDED",
  CHEMICAL: "CHEMICAL",
} as const;

export type TWarehouseType =
  (typeof WAREHOUSE_TYPE)[keyof typeof WAREHOUSE_TYPE];

export const WAREHOUSE_TYPE_OPTIONS = [
  { label: "Kho thường", value: WAREHOUSE_TYPE.DRY },
  { label: "Kho lạnh", value: WAREHOUSE_TYPE.COLD },
  { label: "Kho ngoại quan", value: WAREHOUSE_TYPE.BONDED },
  { label: "Kho hóa chất", value: WAREHOUSE_TYPE.CHEMICAL },
];

export const normalizeWarehouseType = (
  type?: string | null
): TWarehouseType | null => {
  if (!type) return null;

  const normalized = type.trim().toUpperCase().replace(/[\s-]/g, "_");

  switch (normalized) {
    case WAREHOUSE_TYPE.DRY:
      return WAREHOUSE_TYPE.DRY;
    case "COLD_STORAGE":
    case WAREHOUSE_TYPE.COLD:
      return WAREHOUSE_TYPE.COLD;
    case WAREHOUSE_TYPE.BONDED:
      return WAREHOUSE_TYPE.BONDED;
    case WAREHOUSE_TYPE.CHEMICAL:
      return WAREHOUSE_TYPE.CHEMICAL;
    default:
      return null;
  }
};

export const getWarehouseTypeLabel = (type?: string | null) => {
  const normalized = normalizeWarehouseType(type);
  return (
    WAREHOUSE_TYPE_OPTIONS.find((option) => option.value === normalized)
      ?.label ||
    type ||
    "Không xác định"
  );
};
