import type {
  TWarehouse,
  TWarehouseFormValues,
  TWarehouseRequest,
} from "@/schemas/warehouse.schema";
import { WAREHOUSE_FORM_DEFAULTS } from "@/schemas/warehouse.schema";
import { WAREHOUSE_TYPE } from "@/types/enums/warehouse-type.enum";

const trimOrNull = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const getWarehouseFormDefaultValues = (
  warehouse?: TWarehouse
): TWarehouseFormValues => ({
  warehouseCode:
    warehouse?.warehouseCode ?? WAREHOUSE_FORM_DEFAULTS.warehouseCode,
  warehouseName:
    warehouse?.warehouseName ?? WAREHOUSE_FORM_DEFAULTS.warehouseName,
  warehouseType:
    warehouse?.warehouseType ?? WAREHOUSE_FORM_DEFAULTS.warehouseType,
  address: warehouse?.address ?? WAREHOUSE_FORM_DEFAULTS.address,
  maxPallets: warehouse?.maxPallets ?? WAREHOUSE_FORM_DEFAULTS.maxPallets,
  defaultMinTemp:
    warehouse?.defaultMinTemp ?? WAREHOUSE_FORM_DEFAULTS.defaultMinTemp,
  defaultMaxTemp:
    warehouse?.defaultMaxTemp ?? WAREHOUSE_FORM_DEFAULTS.defaultMaxTemp,
  status: warehouse?.status ?? WAREHOUSE_FORM_DEFAULTS.status,
});

export const toWarehouseRequest = (
  values: TWarehouseFormValues
): TWarehouseRequest => {
  const warehouseType = values.warehouseType;
  const isCold = warehouseType === WAREHOUSE_TYPE.COLD;

  return {
    warehouseCode: values.warehouseCode.trim().toUpperCase(),
    warehouseName: values.warehouseName.trim(),
    warehouseType,
    address: trimOrNull(values.address),
    maxPallets: values.maxPallets,
    defaultMinTemp: isCold ? values.defaultMinTemp : null,
    defaultMaxTemp: isCold ? values.defaultMaxTemp : null,
    status: values.status,
  };
};
