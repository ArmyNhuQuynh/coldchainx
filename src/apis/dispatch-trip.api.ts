import { apiRequest } from "@/lib/http";
import type {
  TCancelTripResult,
  TDispatchLookupEnvelope,
  TDispatchTrip,
  TDispatchTripDetails,
  TDispatchTripListQuery,
  TDispatchTripDocuments,
  TDispatchTripLpn,
  TDispatchTripRoute,
  TStartPickingResult,
} from "@/schemas/dispatch.schema";
import { read, unwrapData, unwrapLookup } from "./dispatch-api.helpers";
import {
  mergeTrips,
  normalizeTrip,
  normalizeTripDocuments,
  normalizeTripLpn,
  normalizeTripRoute,
} from "./dispatch-trip-normalizers";
import { normalizeTripDetails } from "./dispatch-trip-details-normalizer";
import { API_SUFFIX } from "./util.api";
import type { PaginationResponse } from "@/types/response.type";

const getTripsCanStartPicking = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTrip[]> | TDispatchTrip[]
  >(`${API_SUFFIX.DISPATCH_API}/trips/can-start-picking`);

  return unwrapLookup<TDispatchTrip>(response.data).map((item) =>
    normalizeTrip(item, "planned")
  );
};

const getPickingTrips = async (tripId?: string) => {
  const response = await apiRequest.baseApi.get<TDispatchTrip[]>(
    `${API_SUFFIX.OUTBOUND_API}/available-trips`,
    {
      params: tripId ? { tripId } : undefined,
    }
  );

  return response.data.map((item) => normalizeTrip(item, "picking"));
};

const getTripsReadyToSeal = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTrip[]> | TDispatchTrip[]
  >(`${API_SUFFIX.DISPATCH_API}/trips/ready-to-seal`);

  return unwrapLookup<TDispatchTrip>(response.data).map((item) =>
    normalizeTrip(item, "readyToSeal")
  );
};

const getCreatedTrips = async () => {
  const [plannedTrips, pickingTrips, readyToSealTrips] = await Promise.all([
    getTripsCanStartPicking(),
    getPickingTrips(),
    getTripsReadyToSeal(),
  ]);

  return mergeTrips([...plannedTrips, ...pickingTrips, ...readyToSealTrips]);
};

const getTripPickList = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<TDispatchTripLpn[]>(
    `${API_SUFFIX.OUTBOUND_API}/pick-list/${tripId}`
  );

  return response.data.map(normalizeTripLpn);
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
  getPickingTrips,
  getTripPickList,
  cancelTrip,
  startPicking,
  getTripDocuments,
  getTripRoute,
  getTripDetails,
  getTrips,
};
