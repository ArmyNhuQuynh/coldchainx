import { apiRequest } from "@/lib/http";
import type {
  TCancelTripResult,
  TDispatchLookupEnvelope,
  TDispatchTrip,
  TDispatchTripDocuments,
  TDispatchTripLpn,
  TDispatchTripRoute,
  TSealAndDispatchRequest,
  TSealAndDispatchResult,
  TStartPickingResult,
} from "@/schemas/dispatch.schema";
import { unwrapData, unwrapLookup } from "./dispatch-api.helpers";
import {
  mergeTrips,
  normalizeSealAndDispatchResult,
  normalizeTrip,
  normalizeTripDocuments,
  normalizeTripLpn,
  normalizeTripRoute,
} from "./dispatch-trip-normalizers";
import { API_SUFFIX } from "./util.api";

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

const sealAndDispatch = async ({
  tripId,
  sealCode,
}: TSealAndDispatchRequest) => {
  const formData = new FormData();
  formData.append("SealCode", sealCode);

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TSealAndDispatchResult> | TSealAndDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/seal-and-dispatch/${tripId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return normalizeSealAndDispatchResult(
    unwrapData<TSealAndDispatchResult>(response.data)
  );
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

export const dispatchTripApi = {
  getCreatedTrips,
  getPickingTrips,
  getTripPickList,
  cancelTrip,
  startPicking,
  sealAndDispatch,
  getTripDocuments,
  getTripRoute,
};
