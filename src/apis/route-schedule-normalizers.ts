import type {
  TRouteSchedule,
  TRouteScheduleListResponse,
} from "@/schemas/route-schedule.schema";
import type { BaseResponse } from "@/types/response.type";

export type ApiEnvelope<T> = BaseResponse<T> & {
  Data?: T;
};

type ApiPage<T> = {
  data?: T[];
  Data?: T[];
  totalRecords?: number;
  TotalRecords?: number;
  totalPages?: number;
  TotalPages?: number;
  currentPage?: number;
  CurrentPage?: number;
  pageSize?: number;
  PageSize?: number;
};

const read = <T>(
  item: Record<string, any>,
  camelKey: string,
  pascalKey: string
): T => (item[camelKey] ?? item[pascalKey]) as T;

export const getEnvelopeData = <T>(payload: ApiEnvelope<T>) =>
  payload.data ?? payload.Data;

export const normalizeRouteSchedule = (
  item: TRouteSchedule | Record<string, any>
): TRouteSchedule => {
  const raw = item as Record<string, any>;

  return {
    scheduleId: read<string>(raw, "scheduleId", "ScheduleId"),
    routeId: read<string>(raw, "routeId", "RouteId"),
    scheduleName: read<string>(raw, "scheduleName", "ScheduleName"),
    departureDate: read<string>(raw, "departureDate", "DepartureDate"),
    departureTime: read<string>(raw, "departureTime", "DepartureTime"),
    cutOffTime: read<string>(raw, "cutOffTime", "CutOffTime"),
    status: read<string>(raw, "status", "Status"),
    createdAt: read<string | null | undefined>(raw, "createdAt", "CreatedAt"),
  };
};

export const normalizeRouteSchedulePage = (
  page?: ApiPage<TRouteSchedule> | null
): TRouteScheduleListResponse | undefined => {
  if (!page) return undefined;

  const data = page.data ?? page.Data ?? [];

  return {
    data: data.map(normalizeRouteSchedule),
    totalRecords: page.totalRecords ?? page.TotalRecords ?? data.length,
    totalPages: page.totalPages ?? page.TotalPages ?? 1,
    currentPage: page.currentPage ?? page.CurrentPage ?? 1,
    pageSize: page.pageSize ?? page.PageSize ?? data.length,
  };
};
