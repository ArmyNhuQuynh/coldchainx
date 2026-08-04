import { cn } from "@/lib/utils";
import type { TTrackingPoint, TTrackingTrip } from "@/schemas/monitoring.schema";

export const TRACKING_ALL_STATUS = "all";

export const TRACKING_STATUS_OPTIONS = [
  TRACKING_ALL_STATUS,
  "IN_TRANSIT",
  "DELAYED",
  "SEALED",
  "DISPATCHED",
] as const;

export const formatShortTripId = (tripId?: string | null) =>
  tripId ? tripId.slice(0, 8).toUpperCase() : "-";

export const formatTrackingDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTemperature = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}°C`;
};

export const formatCoordinate = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return value.toFixed(6);
};

export const getTrackingStatusLabel = (status?: string | null) => {
  switch (status) {
    case "IN_TRANSIT":
      return "Đang chạy";
    case "DELAYED":
      return "Đang trễ";
    case "SEALED":
      return "Đã kẹp chì";
    case "DISPATCHED":
      return "Đã xuất phát";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

export const getTrackingStatusClassName = (status?: string | null) => {
  switch (status) {
    case "IN_TRANSIT":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "DELAYED":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "SEALED":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "DISPATCHED":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "border-slate-200 bg-slate-50 text-slate-700";
    default:
      return "border-border bg-secondary text-secondary-foreground";
  }
};

export const getDeviceStatusLabel = (trip: TTrackingTrip) => {
  if (!trip.device) return "Chưa gắn IoT";
  if (trip.device.isOnline) return "Online";
  return trip.device.status || "Offline";
};

export const getDeviceStatusClassName = (trip: TTrackingTrip) =>
  cn(
    "rounded-md border",
    !trip.device
      ? "border-slate-200 bg-slate-50 text-slate-600"
      : trip.device.isOnline
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-rose-200 bg-rose-50 text-rose-700"
  );

export const getLatestPoint = (trip: TTrackingTrip): TTrackingPoint | null => {
  const latest = trip.latestTelemetry;
  if (
    typeof latest?.lat !== "number" ||
    typeof latest.lon !== "number" ||
    typeof latest.tempC !== "number" ||
    !latest.timestamp
  ) {
    return null;
  }

  return {
    lat: latest.lat,
    lon: latest.lon,
    tempC: latest.tempC,
    timestamp: latest.timestamp,
  };
};
