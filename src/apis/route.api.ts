import { apiRequest } from "@/lib/http";
import type {
  TRouteListParams,
  TRouteOriginWarehouse,
  TRouteRequest,
  TRouteStop,
  TRouteStopListParams,
  TRouteStopListResponse,
  TRouteStopRequest,
  TUpdateRouteRequest,
} from "@/schemas/route.schema";
import type { BaseResponse } from "@/types/response.type";
import {
  getEnvelopeData,
  normalizeOriginWarehouse,
  normalizeRoute,
  normalizeRouteStop,
  normalizeRouteStopsPage,
  type ApiEnvelope,
} from "./route-normalizers";
import { API_SUFFIX } from "./util.api";

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getRouteOptions = async (params: TRouteListParams) => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TRoute[]>>(
    `${API_SUFFIX.ROUTES_API}/options`,
    {
      params: cleanParams({
        originCity: params.originCity?.trim(),
        destCity: params.destCity?.trim(),
        status: params.status,
      }),
    }
  );

  const items = getEnvelopeData(response.data) ?? [];

  return {
    ...response.data,
    data: items.map(normalizeRoute),
  };
};

const getRouteById = async (id: string) => {
  const response = await apiRequest.baseApi.get<ApiEnvelope<TRoute>>(
    `${API_SUFFIX.ROUTES_API}/${id}/detail`
  );

  const route = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: route ? normalizeRoute(route) : route,
  };
};

const createRoute = async (data: TRouteRequest) => {
  const response = await apiRequest.baseApi.post<ApiEnvelope<TRoute>>(
    API_SUFFIX.ROUTES_API,
    data
  );

  const route = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: route ? normalizeRoute(route) : route,
  };
};

const updateRoute = async (id: string, data: TUpdateRouteRequest) => {
  const response = await apiRequest.baseApi.put<ApiEnvelope<TRoute>>(
    `${API_SUFFIX.ROUTES_API}/${id}`,
    data
  );

  const route = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: route ? normalizeRoute(route) : route,
  };
};

const deleteRoute = async (id: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.ROUTES_API}/${id}`
  );
  return response.data;
};

const getRouteStops = async (routeId: string, params: TRouteStopListParams) => {
  const response = await apiRequest.baseApi.get<
    ApiEnvelope<TRouteStopListResponse>
  >(`${API_SUFFIX.ROUTES_API}/${routeId}/stops`, {
    params: cleanParams(params),
  });

  const result = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: normalizeRouteStopsPage(result),
  };
};

const createRouteStop = async (routeId: string, data: TRouteStopRequest) => {
  const response = await apiRequest.baseApi.post<ApiEnvelope<TRouteStop>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/stops`,
    data
  );

  const stop = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: stop ? normalizeRouteStop(stop) : stop,
  };
};

const updateRouteStop = async (
  routeId: string,
  stopId: string,
  data: TRouteStopRequest
) => {
  const response = await apiRequest.baseApi.put<ApiEnvelope<TRouteStop>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/stops/${stopId}`,
    data
  );

  const stop = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: stop ? normalizeRouteStop(stop) : stop,
  };
};

const deleteRouteStop = async (routeId: string, stopId: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/stops/${stopId}`
  );
  return response.data;
};

const getRouteOriginWarehouses = async (routeId: string) => {
  const response = await apiRequest.baseApi.get<
    ApiEnvelope<TRouteOriginWarehouse[]>
  >(`${API_SUFFIX.ROUTES_API}/${routeId}/origin-warehouses`);

  const items = getEnvelopeData(response.data) ?? [];

  return {
    ...response.data,
    data: items.map(normalizeOriginWarehouse),
  };
};

export const routeApi = {
  getRouteOptions,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteStops,
  createRouteStop,
  updateRouteStop,
  deleteRouteStop,
  getRouteOriginWarehouses,
};
