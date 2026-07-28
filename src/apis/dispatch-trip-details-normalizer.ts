import type {
  TDispatchTripDeliveryEpod,
  TDispatchTripDetails,
  TDispatchTripDetailsLocation,
  TDispatchTripDetailsLpn,
  TDispatchTripDetailsOrder,
  TDispatchTripDetailsStop,
} from "@/schemas/dispatch.schema";
import { read, toNumber } from "./dispatch-api.helpers";

const toArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const normalizeLocation = (
  item: unknown
): TDispatchTripDetailsLocation | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    locationId: read<string>(raw, "locationId", "LocationId"),
    address: read<string>(raw, "address", "Address") || "",
    latitude: read<number | null>(raw, "latitude", "Latitude"),
    longitude: read<number | null>(raw, "longitude", "Longitude"),
  };
};

const normalizeDeliveryEpod = (
  item: unknown
): TDispatchTripDeliveryEpod => {
  const raw = (item ?? {}) as Record<string, any>;

  return {
    epodId: read<string>(raw, "epodId", "EpodId"),
    status: read<string | null>(raw, "status", "Status"),
    receiverName: read<string | null>(raw, "receiverName", "ReceiverName"),
    signedAt: read<string | null>(raw, "signedAt", "SignedAt"),
    handoverConfirmedAt: read<string | null>(
      raw,
      "handoverConfirmedAt",
      "HandoverConfirmedAt"
    ),
  };
};

const normalizeOrder = (item: unknown): TDispatchTripDetailsOrder => {
  const raw = (item ?? {}) as Record<string, any>;
  const customer = read<Record<string, any> | null>(
    raw,
    "customer",
    "Customer"
  );

  return {
    orderId: read<string>(raw, "orderId", "OrderId"),
    trackingCode: read<string>(raw, "trackingCode", "TrackingCode") || "",
    itemName: read<string>(raw, "itemName", "ItemName") || "",
    category: read<string | null>(raw, "category", "Category"),
    quantity: read<number | null>(raw, "quantity", "Quantity"),
    tempCondition: read<string | null>(
      raw,
      "tempCondition",
      "TempCondition"
    ),
    destinationAddress: read<string | null>(
      raw,
      "destinationAddress",
      "DestinationAddress"
    ),
    deliveryStopSequence: read<number | null>(
      raw,
      "deliveryStopSequence",
      "DeliveryStopSequence"
    ),
    status: read<string>(raw, "status", "Status") || "UNKNOWN",
    customerName: customer
      ? read<string | null>(customer, "companyName", "CompanyName")
      : null,
    lpnIds: toArray(read(raw, "lpnIds", "LpnIds")).map(String),
    lpnCodes: toArray(read(raw, "lpnCodes", "LpnCodes")).map(String),
    deliveryEpods: toArray(
      read(raw, "deliveryEpods", "DeliveryEpods")
    ).map(normalizeDeliveryEpod),
  };
};

const normalizeLpn = (item: unknown): TDispatchTripDetailsLpn => {
  const raw = (item ?? {}) as Record<string, any>;

  return {
    lpnId: read<string>(raw, "lpnId", "LpnId"),
    lpnCode: read<string>(raw, "lpnCode", "LpnCode") || "",
    orderId: read<string>(raw, "orderId", "OrderId"),
    state: read<string>(raw, "state", "State") || "UNKNOWN",
    deliveryStopSequence: read<number | null>(
      raw,
      "deliveryStopSequence",
      "DeliveryStopSequence"
    ),
  };
};

const normalizeStop = (item: unknown): TDispatchTripDetailsStop => {
  const raw = (item ?? {}) as Record<string, any>;

  return {
    stopId: read<string>(raw, "stopId", "StopId"),
    locationId: read<string | null>(raw, "locationId", "LocationId"),
    stopSequence: toNumber(read(raw, "stopSequence", "StopSequence")),
    stopType: read<string>(raw, "stopType", "StopType") || "",
    plannedArrivalTime: read<string | null>(
      raw,
      "plannedArrivalTime",
      "PlannedArrivalTime"
    ),
    actualArrivalTime: read<string | null>(
      raw,
      "actualArrivalTime",
      "ActualArrivalTime"
    ),
    status: read<string | null>(raw, "status", "Status"),
    location: normalizeLocation(read(raw, "location", "Location")),
    orderIds: toArray(read(raw, "orderIds", "OrderIds")).map(String),
    orderTrackingCodes: toArray(
      read(raw, "orderTrackingCodes", "OrderTrackingCodes")
    ).map(String),
    lpnIds: toArray(read(raw, "lpnIds", "LpnIds")).map(String),
    lpnCodes: toArray(read(raw, "lpnCodes", "LpnCodes")).map(String),
  };
};

export const normalizeTripDetails = (
  item: TDispatchTripDetails | Record<string, any>
): TDispatchTripDetails => {
  const raw = item as Record<string, any>;
  const route = read<Record<string, any> | null>(raw, "route", "Route");
  const schedule = read<Record<string, any> | null>(
    raw,
    "schedule",
    "Schedule"
  );
  const summary =
    read<Record<string, any> | null>(raw, "summary", "Summary") ?? {};

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    status: read<string | null>(raw, "status", "Status"),
    departureDate: read<string | null>(
      raw,
      "departureDate",
      "DepartureDate"
    ),
    plannedStartTime: read<string | null>(
      raw,
      "plannedStartTime",
      "PlannedStartTime"
    ),
    plannedEndTime: read<string | null>(
      raw,
      "plannedEndTime",
      "PlannedEndTime"
    ),
    startedAt: read<string | null>(raw, "startedAt", "StartedAt"),
    completedAt: read<string | null>(raw, "completedAt", "CompletedAt"),
    route: route
      ? {
          routeId: read<string>(route, "routeId", "RouteId"),
          routeCode: read<string>(route, "routeCode", "RouteCode") || "",
          originCity: read<string>(route, "originCity", "OriginCity") || "",
          destinationCity:
            read<string>(route, "destinationCity", "DestinationCity") || "",
          transitTime: read<string | null>(
            route,
            "transitTime",
            "TransitTime"
          ),
          status: read<string | null>(route, "status", "Status"),
        }
      : null,
    schedule: schedule
      ? {
          scheduleId: read<string>(schedule, "scheduleId", "ScheduleId"),
          routeId: read<string>(schedule, "routeId", "RouteId"),
          scheduleName:
            read<string>(schedule, "scheduleName", "ScheduleName") || "",
          departureDate:
            read<string>(schedule, "departureDate", "DepartureDate") || "",
          departureTime:
            read<string>(schedule, "departureTime", "DepartureTime") || "",
          cutOffTime: read<string | null>(
            schedule,
            "cutOffTime",
            "CutOffTime"
          ),
          status: read<string | null>(schedule, "status", "Status"),
        }
      : null,
    origin: normalizeLocation(read(raw, "origin", "Origin")),
    destination: normalizeLocation(read(raw, "destination", "Destination")),
    stops: toArray(read(raw, "stops", "Stops")).map(normalizeStop),
    orders: toArray(read(raw, "orders", "Orders")).map(normalizeOrder),
    lpns: toArray(read(raw, "lpns", "Lpns")).map(normalizeLpn),
    summary: {
      totalOrders: toNumber(read(summary, "totalOrders", "TotalOrders")),
      totalLpns: toNumber(read(summary, "totalLpns", "TotalLpns")),
      deliveredLpns: toNumber(
        read(summary, "deliveredLpns", "DeliveredLpns")
      ),
      returnedLpns: toNumber(
        read(summary, "returnedLpns", "ReturnedLpns")
      ),
    },
  };
};
