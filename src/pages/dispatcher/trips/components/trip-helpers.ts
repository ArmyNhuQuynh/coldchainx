import type { TDispatchTrip } from "@/schemas/dispatch.schema";
import {
  DISPATCH_FILTER_VALUE,
  DISPATCH_TRIP_STATUS,
  type TDispatchTripStatus,
} from "@/types/enums/dispatch.enum";

export const ALL_TRIP_STATUS = DISPATCH_FILTER_VALUE.ALL;

export const formatTripDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatShortTripId = (tripId?: string | null) =>
  tripId ? tripId.slice(0, 8).toUpperCase() : "—";

export const getTripProgress = (trip: TDispatchTrip) => {
  if (trip.status === DISPATCH_TRIP_STATUS.PLANNED) {
    return {
      done: trip.allocatedLpns ?? 0,
      total: trip.totalLpns,
      label: "Đã giữ chỗ",
    };
  }

  if (trip.status === DISPATCH_TRIP_STATUS.PICKING) {
    return {
      done: trip.loadingCompletedLpns ?? 0,
      total: trip.totalLpns,
      label: "Đã bốc",
    };
  }

  if (trip.status === DISPATCH_TRIP_STATUS.LOADING_COMPLETED) {
    return {
      done: trip.releasedLpns ?? trip.totalLpns,
      total: trip.totalLpns,
      label: "Đã xuất kho",
    };
  }

  return {
    done: trip.totalLpns,
    total: trip.totalLpns,
    label: "LPN",
  };
};

export const getTripStatusLabel = (status?: TDispatchTripStatus | null) => {
  switch (status) {
    case DISPATCH_TRIP_STATUS.PLANNED:
      return "Sẵn sàng bốc hàng";
    case DISPATCH_TRIP_STATUS.PICKING:
      return "Đang bốc hàng";
    case DISPATCH_TRIP_STATUS.LOADING_COMPLETED:
      return "Chờ kẹp chì";
    case DISPATCH_TRIP_STATUS.SEALED:
      return "Đã kẹp chì";
    case DISPATCH_TRIP_STATUS.DISPATCHED:
      return "Đã xuất phát";
    case DISPATCH_TRIP_STATUS.CANCELLED:
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

export const getTripStatusClassName = (status?: TDispatchTripStatus | null) => {
  switch (status) {
    case DISPATCH_TRIP_STATUS.PLANNED:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case DISPATCH_TRIP_STATUS.PICKING:
      return "bg-amber-50 text-amber-700 border-amber-200";
    case DISPATCH_TRIP_STATUS.LOADING_COMPLETED:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case DISPATCH_TRIP_STATUS.SEALED:
      return "bg-violet-50 text-violet-700 border-violet-200";
    case DISPATCH_TRIP_STATUS.DISPATCHED:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case DISPATCH_TRIP_STATUS.CANCELLED:
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

export const canCancelTrip = (trip: TDispatchTrip) =>
  [
    DISPATCH_TRIP_STATUS.PLANNED,
    DISPATCH_TRIP_STATUS.PICKING,
    DISPATCH_TRIP_STATUS.LOADING_COMPLETED,
    DISPATCH_TRIP_STATUS.SEALED,
  ].includes(trip.status);

export const canStartPickingTrip = (trip: TDispatchTrip) =>
  trip.status === DISPATCH_TRIP_STATUS.PLANNED;

export const canDepartTrip = (trip: TDispatchTrip) =>
  trip.status === DISPATCH_TRIP_STATUS.LOADING_COMPLETED;
