import { apiRequest } from "@/lib/http";
import type { TDispatchLookupEnvelope } from "@/schemas/dispatch.schema";
import type { TWarehouseLookup } from "@/schemas/warehouse.schema";
import { API_SUFFIX } from "./util.api";

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

const unwrapLookup = <T>(payload: TDispatchLookupEnvelope<T[]> | T[]): T[] => {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.Data ?? [];
};

const normalizeWarehouse = (
  item: TWarehouseLookup | Record<string, any>
): TWarehouseLookup => {
  const raw = item as Record<string, any>;
  const warehouseName = read<string>(raw, "warehouseName", "WarehouseName");
  const warehouseCode = read<string | null>(raw, "warehouseCode", "WarehouseCode");

  return {
    warehouseId: read<string>(raw, "warehouseId", "WarehouseId"),
    warehouseCode,
    warehouseName,
    address: read<string | null>(raw, "address", "Address"),
    label:
      read<string | undefined>(raw, "label", "Label") ||
      (warehouseCode ? `${warehouseName} (${warehouseCode})` : warehouseName),
  };
};

const getWarehouses = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TWarehouseLookup[]> | TWarehouseLookup[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/warehouses`);

  return unwrapLookup<TWarehouseLookup>(response.data).map(normalizeWarehouse);
};

export const warehouseApi = {
  getWarehouses,
};

