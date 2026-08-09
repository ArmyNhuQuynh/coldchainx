import { apiRequest } from "@/lib/http";
import type {
  TCancelTripResult,
  TDispatchLookupEnvelope,
  TDispatchTripDetails,
  TDispatchTripListQuery,
  TDispatchTripDocuments,
  TDispatchTripRoute,
  TStartPickingResult,
} from "@/schemas/dispatch.schema";
import { read, unwrapData } from "./dispatch-api.helpers";
import {
  mergeTrips,
  normalizeCreatedTripDetails,
  normalizeTripDocuments,
  normalizeTripRoute,
} from "./dispatch-trip-normalizers";
import { normalizeTripDetails } from "./dispatch-trip-details-normalizer";
import { API_SUFFIX } from "./util.api";
import type { PaginationResponse } from "@/types/response.type";

const CREATED_TRIP_STATUSES = new Set([
  "PLANNED",
  "PICKING",
  "LOADING_COMPLETED",
  "SEALED",
]);

const getCreatedTripPage = async (pageNumber: number) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `${API_SUFFIX.DISPATCH_API}/trips`,
    {
      params: { pageNumber, pageSize: 100 },
    }
  );
  const page = unwrapData<Record<string, any>>(response.data);

  return {
    data: read<unknown[]>(page, "data", "Data") ?? [],
    totalPages: Number(read(page, "totalPages", "TotalPages") ?? 1),
  };
};

const getCreatedTrips = async () => {
  const firstPage = await getCreatedTripPage(1);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) =>
      getCreatedTripPage(index + 2)
    )
  );
  const trips = [firstPage, ...remainingPages]
    .flatMap((page) => page.data)
    .map((trip) => normalizeCreatedTripDetails(trip as Record<string, any>))
    .filter((trip) => CREATED_TRIP_STATUSES.has(trip.status));

  return mergeTrips(trips);
};

const cancelTrip = async (tripId: string) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TCancelTripResult> | TCancelTripResult
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/cancel`);

  return unwrapData<TCancelTripResult>(response.data);
};

const startPicking = async (tripId: string) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TStartPickingResult> | TStartPickingResult
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/start-picking`);

  return unwrapData<TStartPickingResult>(response.data);
};

const getTripDocuments = async (
  tripId: string
): Promise<TDispatchTripDocuments> => {
  const [lifoResult, waybillResult] = await Promise.allSettled([
    apiRequest.baseApi.get<Record<string, any>>(
      `${API_SUFFIX.DISPATCH_API}/trip/${tripId}/lifo-url`
    ),
    apiRequest.baseApi.get<Record<string, any>>(
      `${API_SUFFIX.DISPATCH_API}/trip/${tripId}/waybill-url`
    ),
  ]);

  return normalizeTripDocuments(
    lifoResult.status === "fulfilled" ? lifoResult.value.data : undefined,
    waybillResult.status === "fulfilled" ? waybillResult.value.data : undefined
  );
};

const getTripRoute = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTripRoute> | TDispatchTripRoute
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/route`);

  return normalizeTripRoute(unwrapData<TDispatchTripRoute>(response.data));
};

const getTripDetails = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTripDetails> | TDispatchTripDetails
  >(`${API_SUFFIX.DISPATCH_API}/trips/${tripId}`);

  return normalizeTripDetails(
    unwrapData<TDispatchTripDetails>(response.data)
  );
};

const getTrips = async (
  params: TDispatchTripListQuery
): Promise<PaginationResponse<TDispatchTripDetails>> => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `${API_SUFFIX.DISPATCH_API}/trips`,
    { params }
  );
  const page = unwrapData<Record<string, any>>(response.data);
  const rawTrips = read<unknown[]>(page, "data", "Data") ?? [];

  return {
    currentPage: Number(read(page, "currentPage", "CurrentPage") ?? 1),
    pageSize: Number(read(page, "pageSize", "PageSize") ?? params.pageSize),
    totalRecords: Number(read(page, "totalRecords", "TotalRecords") ?? 0),
    totalPages: Number(read(page, "totalPages", "TotalPages") ?? 0),
    data: rawTrips.map((trip) =>
      normalizeTripDetails(trip as Record<string, any>)
    ),
  };
};

export const dispatchTripApi = {
  getCreatedTrips,
  cancelTrip,
  startPicking,
  getTripDocuments,
  getTripRoute,
  getTripDetails,
  getTrips,
};
