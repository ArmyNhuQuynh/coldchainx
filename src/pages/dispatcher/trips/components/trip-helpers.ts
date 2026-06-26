import type { TDispatchTrip, TDispatchTripStatus } from "@/schemas/dispatch.schema";

export const ALL_TRIP_STATUS = "all";

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
  if (trip.status === "PLANNED") {
    return {
      done: trip.allocatedLpns ?? 0,
      total: trip.totalLpns,
      label: "Đã giữ chỗ",
    };
  }

  if (trip.status === "PICKING") {
    return {
      done: trip.loadingCompletedLpns ?? 0,
      total: trip.totalLpns,
      label: "Đã bốc",
    };
  }

  if (trip.status === "LOADING_COMPLETED") {
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
    case "PLANNED":
      return "Sẵn sàng bốc hàng";
    case "PICKING":
      return "Đang bốc hàng";
    case "LOADING_COMPLETED":
      return "Chờ kẹp chì";
    case "SEALED":
      return "Đã kẹp chì";
    case "DISPATCHED":
      return "Đã xuất phát";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status || "Không rõ";
  }
};

export const getTripStatusClassName = (status?: TDispatchTripStatus | null) => {
  switch (status) {
    case "PLANNED":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "PICKING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "LOADING_COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "SEALED":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "DISPATCHED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CANCELLED":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

export const canCancelTrip = (trip: TDispatchTrip) =>
  ["PLANNED", "PICKING", "LOADING_COMPLETED", "SEALED"].includes(trip.status);

export const canStartPickingTrip = (trip: TDispatchTrip) =>
  trip.status === "PLANNED";
