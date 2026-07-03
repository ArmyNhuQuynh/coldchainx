export const DISPATCH_FILTER_VALUE = {
  ALL: "all",
} as const;

export const DISPATCH_TEMPERATURE_GROUP = {
  FROZEN: "FROZEN",
  CHILLED: "CHILLED",
  AMBIENT: "AMBIENT",
} as const;

export const DISPATCH_TRIP_STATUS = {
  PLANNED: "PLANNED",
  PICKING: "PICKING",
  LOADING_COMPLETED: "LOADING_COMPLETED",
  SEALED: "SEALED",
  DISPATCHED: "DISPATCHED",
  CANCELLED: "CANCELLED",
} as const;

export type TDispatchTemperatureGroup =
  (typeof DISPATCH_TEMPERATURE_GROUP)[keyof typeof DISPATCH_TEMPERATURE_GROUP];

export type TDispatchTripStatus =
  (typeof DISPATCH_TRIP_STATUS)[keyof typeof DISPATCH_TRIP_STATUS] | string;

