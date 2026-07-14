import { apiRequest } from "@/lib/http";
import type {
  TRouteSchedule,
  TRouteScheduleCreateRequest,
  TRouteScheduleListParams,
  TRouteScheduleListResponse,
  TRouteScheduleUpdateRequest,
} from "@/schemas/route-schedule.schema";
import type { BaseResponse } from "@/types/response.type";
import {
  getEnvelopeData,
  normalizeRouteSchedule,
  normalizeRouteSchedulePage,
  type ApiEnvelope,
} from "./route-schedule-normalizers";
import { API_SUFFIX } from "./util.api";

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const getRouteSchedules = async (
  routeId: string,
  params: TRouteScheduleListParams
) => {
  const response = await apiRequest.baseApi.get<
    ApiEnvelope<TRouteScheduleListResponse>
  >(`${API_SUFFIX.ROUTES_API}/${routeId}/schedules`, {
    params: cleanParams(params),
  });

  return {
    ...response.data,
    data: normalizeRouteSchedulePage(getEnvelopeData(response.data)),
  };
};

const createRouteSchedule = async (
  routeId: string,
  data: TRouteScheduleCreateRequest
) => {
  const response = await apiRequest.baseApi.post<ApiEnvelope<TRouteSchedule>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/schedules`,
    data
  );
  const schedule = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: schedule ? normalizeRouteSchedule(schedule) : schedule,
  };
};

const updateRouteSchedule = async (
  routeId: string,
  scheduleId: string,
  data: TRouteScheduleUpdateRequest
) => {
  const response = await apiRequest.baseApi.put<ApiEnvelope<TRouteSchedule>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/schedules/${scheduleId}`,
    data
  );
  const schedule = getEnvelopeData(response.data);

  return {
    ...response.data,
    data: schedule ? normalizeRouteSchedule(schedule) : schedule,
  };
};

const deleteRouteSchedule = async (routeId: string, scheduleId: string) => {
  const response = await apiRequest.baseApi.delete<BaseResponse<boolean>>(
    `${API_SUFFIX.ROUTES_API}/${routeId}/schedules/${scheduleId}`
  );
  return response.data;
};

export const routeScheduleApi = {
  getRouteSchedules,
  createRouteSchedule,
  updateRouteSchedule,
  deleteRouteSchedule,
};
