import type {
  TRoute,
  TRouteOriginWarehouse,
  TRouteStop,
  TRouteStopListResponse,
} from "@/schemas/route.schema";
import type { BaseResponse } from "@/types/response.type";

export type ApiEnvelope<T> = BaseResponse<T> & {
  Data?: T;
};

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

export const getEnvelopeData = <T>(payload: ApiEnvelope<T>) =>
  payload.data ?? payload.Data;

export const normalizeRoute = (item: TRoute | Record<string, any>): TRoute => {
  const raw = item as Record<string, any>;

  return {
    routeId: read<string>(raw, "routeId", "RouteId"),
    routeCode: read<string>(raw, "routeCode", "RouteCode"),
    originCity: read<string>(raw, "originCity", "OriginCity"),
    destCity: read<string>(raw, "destCity", "DestCity"),
    transitTime: read<string>(raw, "transitTime", "TransitTime"),
    status: read<string>(raw, "status", "Status"),
    createdAt: read<string | null | undefined>(raw, "createdAt", "CreatedAt"),
  };
};

export const normalizeRouteStop = (
  item: TRouteStop | Record<string, any>
): TRouteStop => {
  const raw = item as Record<string, any>;

  return {
    stopId: read<string>(raw, "stopId", "StopId"),
    routeId: read<string>(raw, "routeId", "RouteId"),
    stopName: read<string>(raw, "stopName", "StopName"),
    createdAt: read<string | null | undefined>(raw, "createdAt", "CreatedAt"),
  };
};

export const normalizeRouteStopsPage = (
  page?: TRouteStopListResponse
): TRouteStopListResponse | undefined =>
  page
    ? {
        ...page,
        data: page.data.map(normalizeRouteStop),
      }
    : page;

export const normalizeOriginWarehouse = (
  item: TRouteOriginWarehouse | Record<string, any>
): TRouteOriginWarehouse => {
  const raw = item as Record<string, any>;

  return {
    warehouseId: read<string>(raw, "warehouseId", "WarehouseId"),
    warehouseName: read<string>(raw, "warehouseName", "WarehouseName"),
    address: read<string | null | undefined>(raw, "address", "Address"),
  };
};
