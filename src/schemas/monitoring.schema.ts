export type TMonitoringTelemetry = {
  deviceId?: string | null;
  tempC?: number | null;
  doorOpen?: boolean | null;
  lat?: number | null;
  lon?: number | null;
  timestamp?: string | null;
};

export type TMonitoringVehicle = {
  vehicleId?: string | null;
  truckPlate?: string | null;
};

export type TMonitoringDevice = {
  deviceId?: string | null;
  deviceCode?: string | null;
  status?: string | null;
  isOnline?: boolean | null;
  lastPingTime?: string | null;
};

export type TMonitoringDriver = {
  driverId?: string | null;
  fullName?: string | null;
  driverRole?: string | null;
};

export type TMonitoringOrder = {
  orderId?: string | null;
  trackingCode?: string | null;
  itemName?: string | null;
  category?: string | null;
  tempCondition?: string | null;
};

export type TMonitoringEta = {
  remainingDistanceKm?: number | null;
  estimatedDurationMinutes?: number | null;
  estimatedArrival?: string | null;
};

export type TTrackingTrip = {
  tripId: string;
  status?: string | null;
  plannedStartTime?: string | null;
  plannedEndTime?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  sealNumber?: string | null;
  vehicle?: TMonitoringVehicle | null;
  driver?: string | null;
  drivers: TMonitoringDriver[];
  device?: TMonitoringDevice | null;
  orders: TMonitoringOrder[];
  orderCount: number;
  latestTelemetry?: TMonitoringTelemetry | null;
  eta?: TMonitoringEta | null;
};

export type TTrackingTripListQuery = {
  statuses?: string[];
  pageNumber?: number;
  pageSize?: number;
  search?: string;
};

export type TTrackingTripListResponse = {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: TTrackingTrip[];
};

export type TTrackingPoint = {
  timestamp: string;
  tempC: number;
  lat: number;
  lon: number;
};

export type TMonitoringAlert = {
  alertId?: string | null;
  alertType?: string | null;
  title?: string | null;
  message?: string | null;
  value?: number | null;
  actualTemperatureC?: number | null;
  forecastedSpikeTemp?: number | null;
  smartRiskScore?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null;
  createdAt?: string | null;
};

export type TTripChart = {
  tripId: string;
  rawPointCount: number;
  sampledPointCount: number;
  points: TTrackingPoint[];
  alerts: TMonitoringAlert[];
};

export type TTripRouteGoong = {
  tripId: string;
  rawPointCount: number;
  distanceText?: string | null;
  durationText?: string | null;
  encodedPolyline?: string | null;
};

export type TIoTDeviceStatus = {
  deviceId?: string | null;
  batteryLevel?: number | null;
  lastPingTime?: string | null;
  status?: string | null;
  isOnline?: boolean | null;
  latestTelemetry?: {
    temperature?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    timestamp?: string | null;
  } | null;
};

export type TVehicleIoTStatus = {
  vehicleId: string;
  truckPlate?: string | null;
  hasIoTDevices: boolean;
  overallStatus?: string | null;
  devices: TIoTDeviceStatus[];
};
