import type {
  TIoTDeviceStatus,
  TMonitoringAlert,
  TMonitoringDevice,
  TMonitoringDriver,
  TMonitoringEta,
  TMonitoringOrder,
  TMonitoringTelemetry,
  TMonitoringVehicle,
  TTrackingPoint,
  TTrackingTrip,
  TTrackingTripListResponse,
  TTripChart,
  TTripRouteGoong,
  TVehicleIoTStatus,
} from "@/schemas/monitoring.schema";
import { read, toNumber } from "./dispatch-api.helpers";

const toStringValue = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  return String(value);
};

const normalizeTelemetry = (item: unknown): TMonitoringTelemetry | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    deviceId: read<string | null>(raw, "deviceId", "DeviceId"),
    tempC: read<number | null>(raw, "tempC", "TempC"),
    doorOpen: read<boolean | null>(raw, "doorOpen", "DoorOpen"),
    lat: read<number | null>(raw, "lat", "Lat"),
    lon: read<number | null>(raw, "lon", "Lon"),
    timestamp: toStringValue(read(raw, "timestamp", "Timestamp")),
  };
};

const normalizeVehicle = (item: unknown): TMonitoringVehicle | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    vehicleId: read<string | null>(raw, "vehicleId", "VehicleId"),
    truckPlate: read<string | null>(raw, "truckPlate", "TruckPlate"),
  };
};

const normalizeDevice = (item: unknown): TMonitoringDevice | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    deviceId: read<string | null>(raw, "deviceId", "DeviceId"),
    deviceCode: read<string | null>(raw, "deviceCode", "DeviceCode"),
    status: read<string | null>(raw, "status", "Status"),
    isOnline: read<boolean | null>(raw, "isOnline", "IsOnline"),
    lastPingTime: toStringValue(read(raw, "lastPingTime", "LastPingTime")),
  };
};

const normalizeEta = (item: unknown): TMonitoringEta | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    remainingDistanceKm: read<number | null>(
      raw,
      "remainingDistanceKm",
      "RemainingDistanceKm"
    ),
    estimatedDurationMinutes: read<number | null>(
      raw,
      "estimatedDurationMinutes",
      "EstimatedDurationMinutes"
    ),
    estimatedArrival: toStringValue(
      read(raw, "estimatedArrival", "EstimatedArrival")
    ),
  };
};

const normalizeDriver = (item: unknown): TMonitoringDriver => {
  if (!item || typeof item !== "object") return {};
  const raw = item as Record<string, any>;

  return {
    driverId: read<string | null>(raw, "driverId", "DriverId"),
    fullName: read<string | null>(raw, "fullName", "FullName"),
    driverRole: read<string | null>(raw, "driverRole", "DriverRole"),
  };
};

const normalizeOrder = (item: unknown): TMonitoringOrder => {
  if (!item || typeof item !== "object") return {};
  const raw = item as Record<string, any>;

  return {
    orderId: read<string | null>(raw, "orderId", "OrderId"),
    trackingCode: read<string | null>(raw, "trackingCode", "TrackingCode"),
    itemName: read<string | null>(raw, "itemName", "ItemName"),
    category: read<string | null>(raw, "category", "Category"),
    tempCondition: read<string | null>(raw, "tempCondition", "TempCondition"),
  };
};

const normalizePoint = (item: unknown): TTrackingPoint | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;
  const lat = Number(read(raw, "lat", "Lat"));
  const lon = Number(read(raw, "lon", "Lon"));
  const tempC = Number(read(raw, "tempC", "TempC"));
  const timestamp = toStringValue(read(raw, "timestamp", "Timestamp"));

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    !Number.isFinite(tempC) ||
    !timestamp
  ) {
    return null;
  }

  return { lat, lon, tempC, timestamp };
};

const normalizeIoTDeviceStatus = (item: unknown): TIoTDeviceStatus => {
  if (!item || typeof item !== "object") return {};
  const raw = item as Record<string, any>;
  const latestTelemetry = read<Record<string, any> | null>(
    raw,
    "latestTelemetry",
    "LatestTelemetry"
  );

  return {
    deviceId: read<string | null>(raw, "deviceId", "DeviceId"),
    batteryLevel: read<number | null>(raw, "batteryLevel", "BatteryLevel"),
    lastPingTime: toStringValue(read(raw, "lastPingTime", "LastPingTime")),
    status: read<string | null>(raw, "status", "Status"),
    isOnline: read<boolean | null>(raw, "isOnline", "IsOnline"),
    latestTelemetry: latestTelemetry
      ? {
          temperature: read<number | null>(
            latestTelemetry,
            "temperature",
            "Temperature"
          ),
          latitude: read<number | null>(latestTelemetry, "latitude", "Latitude"),
          longitude: read<number | null>(
            latestTelemetry,
            "longitude",
            "Longitude"
          ),
          timestamp: toStringValue(
            read(latestTelemetry, "timestamp", "Timestamp")
          ),
        }
      : null,
  };
};

export const normalizeTrackingTrip = (item: unknown): TTrackingTrip => {
  const raw = (item ?? {}) as Record<string, any>;
  const orders = read<unknown>(raw, "orders", "Orders");
  const drivers = read<unknown>(raw, "drivers", "Drivers");

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    status: read<string | null>(raw, "status", "Status"),
    plannedStartTime: toStringValue(
      read(raw, "plannedStartTime", "PlannedStartTime")
    ),
    plannedEndTime: toStringValue(read(raw, "plannedEndTime", "PlannedEndTime")),
    startedAt: toStringValue(read(raw, "startedAt", "StartedAt")),
    completedAt: toStringValue(read(raw, "completedAt", "CompletedAt")),
    sealNumber: read<string | null>(raw, "sealNumber", "SealNumber"),
    vehicle: normalizeVehicle(read(raw, "vehicle", "Vehicle")),
    driver: read<string | null>(raw, "driver", "Driver"),
    drivers: Array.isArray(drivers) ? drivers.map(normalizeDriver) : [],
    device: normalizeDevice(read(raw, "device", "Device")),
    orders: Array.isArray(orders) ? orders.map(normalizeOrder) : [],
    orderCount: toNumber(read(raw, "orderCount", "OrderCount")),
    latestTelemetry: normalizeTelemetry(
      read(raw, "latestTelemetry", "LatestTelemetry")
    ),
    eta: normalizeEta(read(raw, "eta", "Eta")),
  };
};

export const normalizeTrackingTripList = (
  payload: Record<string, any>
): TTrackingTripListResponse => {
  const data = read<unknown>(payload, "data", "Data");

  return {
    pageNumber: toNumber(read(payload, "pageNumber", "PageNumber")) || 1,
    pageSize: toNumber(read(payload, "pageSize", "PageSize")) || 50,
    totalRecords: toNumber(read(payload, "totalRecords", "TotalRecords")),
    totalPages: toNumber(read(payload, "totalPages", "TotalPages")),
    data: Array.isArray(data) ? data.map(normalizeTrackingTrip) : [],
  };
};

export const normalizeAlert = (item: unknown): TMonitoringAlert => {
  if (!item || typeof item !== "object") return {};
  const raw = item as Record<string, any>;

  return {
    alertId: read<string | null>(raw, "alertId", "AlertId"),
    alertType: read<string | null>(raw, "alertType", "AlertType"),
    title: read<string | null>(raw, "title", "Title"),
    message: read<string | null>(raw, "message", "Message"),
    value: read<number | null>(raw, "value", "Value"),
    actualTemperatureC: read<number | null>(
      raw,
      "actualTemperatureC",
      "ActualTemperatureC"
    ),
    forecastedSpikeTemp: read<number | null>(
      raw,
      "forecastedSpikeTemp",
      "ForecastedSpikeTemp"
    ),
    smartRiskScore: read<number | null>(raw, "smartRiskScore", "SmartRiskScore"),
    latitude: read<number | null>(raw, "latitude", "Latitude"),
    longitude: read<number | null>(raw, "longitude", "Longitude"),
    status: read<string | null>(raw, "status", "Status"),
    createdAt: toStringValue(read(raw, "createdAt", "CreatedAt")),
  };
};

export const normalizeTripChart = (item: unknown): TTripChart => {
  const raw = (item ?? {}) as Record<string, any>;
  const points = read<unknown>(raw, "points", "Points");
  const alerts = read<unknown>(raw, "alerts", "Alerts");

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    rawPointCount: toNumber(read(raw, "rawPointCount", "RawPointCount")),
    sampledPointCount: toNumber(
      read(raw, "sampledPointCount", "SampledPointCount")
    ),
    points: Array.isArray(points)
      ? (points.map(normalizePoint).filter(Boolean) as TTrackingPoint[])
      : [],
    alerts: Array.isArray(alerts) ? alerts.map(normalizeAlert) : [],
  };
};

export const normalizeRouteGoong = (item: unknown): TTripRouteGoong => {
  const raw = (item ?? {}) as Record<string, any>;

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    rawPointCount: toNumber(read(raw, "rawPointCount", "RawPointCount")),
    distanceText: read<string | null>(raw, "distanceText", "DistanceText"),
    durationText: read<string | null>(raw, "durationText", "DurationText"),
    encodedPolyline: read<string | null>(
      raw,
      "encodedPolyline",
      "EncodedPolyline"
    ),
  };
};

export const normalizeVehicleIoTStatus = (item: unknown): TVehicleIoTStatus => {
  const raw = (item ?? {}) as Record<string, any>;
  const devices = read<unknown>(raw, "devices", "Devices");

  return {
    vehicleId: read<string>(raw, "vehicleId", "VehicleId"),
    truckPlate: read<string | null>(raw, "truckPlate", "TruckPlate"),
    hasIoTDevices: Boolean(read(raw, "hasIoTDevices", "HasIoTDevices")),
    overallStatus: read<string | null>(raw, "overallStatus", "OverallStatus"),
    devices: Array.isArray(devices) ? devices.map(normalizeIoTDeviceStatus) : [],
  };
};
