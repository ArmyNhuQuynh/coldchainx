import { apiRequest } from "@/lib/http";
import type {
  TWarehouse,
  TWarehouseListParams,
  TWarehouseListResponse,
  TWarehouseLookup,
  TWarehouseRequest,
} from "@/schemas/warehouse.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

type LookupEnvelope<T> = {
  data?: T;
  Data?: T;
};

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

const unwrapLookup = <T>(payload: LookupEnvelope<T[]> | T[]): T[] => {
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

const cleanParams = (params: TWarehouseListParams) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getWarehouses = async () => {
  const response = await apiRequest.baseApi.get<
    LookupEnvelope<TWarehouseLookup[]> | TWarehouseLookup[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/warehouses`);

  return unwrapLookup<TWarehouseLookup>(response.data).map(normalizeWarehouse);
};

const getWarehouseList = async (params: TWarehouseListParams) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<TWarehouseListResponse>
  >(API_SUFFIX.WAREHOUSES_API, { params: cleanParams(params) });
  return response.data;
};

const getWarehouseById = async (id: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TWarehouse>>(
    `${API_SUFFIX.WAREHOUSES_API}/${id}`
  );
  return response.data;
};

const createWarehouse = async (data: TWarehouseRequest) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TWarehouse>>(
    API_SUFFIX.WAREHOUSES_API,
    data
  );
  return response.data;
};

const updateWarehouse = async (id: string, data: TWarehouseRequest) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TWarehouse>>(
    `${API_SUFFIX.WAREHOUSES_API}/${id}`,
    data
  );
  return response.data;
};

const deleteWarehouse = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.WAREHOUSES_API}/${id}`
  );
  return response.data;
};

export const warehouseApi = {
  getWarehouses,
  getWarehouseList,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
