import { apiRequest } from "@/lib/http";
import type { TTrackingTripListQuery } from "@/schemas/monitoring.schema";
import { unwrapData } from "./dispatch-api.helpers";
import {
  normalizeAlert,
  normalizeRouteGoong,
  normalizeTrackingTrip,
  normalizeTrackingTripList,
  normalizeTripChart,
  normalizeVehicleIoTStatus,
} from "./monitoring-normalizers";
import { API_SUFFIX } from "./util.api";

const getTrackingTrips = async (query: TTrackingTripListQuery = {}) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    "/tracking/trips",
    { params: query }
  );

  return normalizeTrackingTripList(response.data);
};

const getTrackingDetail = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `/tracking/${tripId}`
  );

  return normalizeTrackingTrip(unwrapData(response.data));
};

const getTripChart = async (tripId: string, maxPoints = 500) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `/trip/${tripId}/chart`,
    { params: { maxPoints } }
  );

  return normalizeTripChart(unwrapData(response.data));
};

const getTripRouteGoong = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `/trip/${tripId}/chart/route-goong`
  );

  return normalizeRouteGoong(unwrapData(response.data));
};

const getTripAlerts = async (
  tripId: string,
  type: "risk" | "ssa" | "smart"
) => {
  const response = await apiRequest.baseApi.get<Record<string, any>>(
    `/trip/${tripId}/alerts/${type}`
  );
  const data = unwrapData<unknown>(response.data);

  return Array.isArray(data) ? data.map(normalizeAlert) : [];
};

const checkVehicleIoT = async (tripId: string, vehicleId: string) => {
  const response = await apiRequest.baseApi.post<Record<string, any>>(
    `${API_SUFFIX.DISPATCH_API}/vehicle-iot-check/${tripId}/${vehicleId}`
  );

  return normalizeVehicleIoTStatus(unwrapData(response.data));
};

export const monitoringApi = {
  getTrackingTrips,
  getTrackingDetail,
  getTripChart,
  getTripRouteGoong,
  getTripAlerts,
  checkVehicleIoT,
};
