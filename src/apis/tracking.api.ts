import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";

export type TTelemetryData = {
  lat: number;
  lon: number;
  temperature?: number;
  tempC?: number;
  humidity?: number;
  humidityPercent?: number;
  timestamp?: string;
  batteryLevel?: number;
  doorOpen?: boolean;
};

export type TEta = {
  remainingDistanceKm: number;
  estimatedDurationMinutes: number;
  estimatedArrival: string;
};

export type TTrackingData = {
  tripId: string;
  status: string;
  vehicle?: {
    vehicleId: string;
    truckPlate: string;
  } | null;
  device?: {
    deviceId: string;
    deviceCode: string;
    status: string;
    lastPingTime?: string | null;
  } | null;
  latestTelemetry?: TTelemetryData | null;
  eta?: TEta | null;
};

const getTrackingByTripId = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TTrackingData>>(`/api/tracking/${tripId}`);
  return response.data;
};

export const trackingApi = {
  getTrackingByTripId,
};
