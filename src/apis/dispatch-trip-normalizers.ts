import type {
  TDispatchOptimizedStop,
  TDispatchTrip,
  TDispatchTripDocuments,
  TDispatchTripLpn,
  TDispatchTripRoute,
  TDispatchTripRouteLeg,
  TDispatchTripRoutePoint,
  TDispatchTripRouteStep,
  TSealAndDispatchResult,
} from "@/schemas/dispatch.schema";
import { read, toNumber } from "./dispatch-api.helpers";

export const normalizeTripLpn = (
  item: TDispatchTripLpn | Record<string, any>
): TDispatchTripLpn => {
  const raw = item as Record<string, any>;

  return {
    lpnId: read<string>(raw, "lpnId", "LpnId"),
    lpnCode: read<string>(raw, "lpnCode", "LpnCode"),
    orderId: read<string | null>(raw, "orderId", "OrderId"),
    orderCode: read<string | null>(raw, "orderCode", "OrderCode"),
    itemName: read<string | null>(raw, "itemName", "ItemName"),
    storageLocation: read<string | null>(
      raw,
      "storageLocation",
      "StorageLocation"
    ),
    quantity: read<number | null>(raw, "quantity", "Quantity"),
    state: read<string | null>(raw, "state", "State"),
    condition: read<string | null>(raw, "condition", "Condition"),
    status: read<string | null>(raw, "status", "Status"),
  };
};

const normalizeRouteStep = (
  item: TDispatchTripRouteStep | Record<string, any>,
  index: number
): TDispatchTripRouteStep => {
  const raw = item as Record<string, any>;

  return {
    stepIndex: read<number | null>(raw, "stepIndex", "StepIndex") ?? index + 1,
    instruction: read<string | null>(raw, "instruction", "Instruction"),
    distanceKm: read<number | null>(raw, "distanceKm", "DistanceKm"),
    durationSeconds: read<number | null>(
      raw,
      "durationSeconds",
      "DurationSeconds"
    ),
    maneuver: read<string | null>(raw, "maneuver", "Maneuver"),
  };
};

const normalizeRouteLeg = (
  item: TDispatchTripRouteLeg | Record<string, any>,
  index: number
): TDispatchTripRouteLeg => {
  const raw = item as Record<string, any>;
  const steps = read<unknown>(raw, "steps", "Steps");

  return {
    legIndex: read<number | null>(raw, "legIndex", "LegIndex") ?? index + 1,
    fromAddress: read<string | null>(raw, "fromAddress", "FromAddress"),
    toAddress: read<string | null>(raw, "toAddress", "ToAddress"),
    startAddress: read<string | null>(raw, "startAddress", "StartAddress"),
    endAddress: read<string | null>(raw, "endAddress", "EndAddress"),
    distanceKm: read<number | null>(raw, "distanceKm", "DistanceKm"),
    durationMinutes: read<number | null>(
      raw,
      "durationMinutes",
      "DurationMinutes"
    ),
    durationSeconds: read<number | null>(
      raw,
      "durationSeconds",
      "DurationSeconds"
    ),
    steps: Array.isArray(steps)
      ? steps.map((step, stepIndex) =>
          normalizeRouteStep(step as Record<string, any>, stepIndex)
        )
      : [],
  };
};

const normalizeRoutePoint = (
  item: unknown
): TDispatchTripRoutePoint | null => {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, any>;

  return {
    locationId: read<string | null>(raw, "locationId", "LocationId"),
    address: read<string | null>(raw, "address", "Address"),
    lat: read<number | null>(raw, "lat", "Lat"),
    lon: read<number | null>(raw, "lon", "Lon"),
  };
};

const normalizeOptimizedStop = (item: unknown): TDispatchOptimizedStop => {
  if (!item || typeof item !== "object") {
    return {
      stopId: null,
      locationId: null,
      address: null,
      lat: null,
      lon: null,
      originalStopSequence: null,
      optimizedSequence: null,
      stopType: null,
      orders: [],
      lpns: [],
    };
  }

  const raw = item as Record<string, any>;
  const lpns = read<unknown>(raw, "lpns", "Lpns");

  return {
    stopId: read<string | null>(raw, "stopId", "StopId"),
    locationId: read<string | null>(raw, "locationId", "LocationId"),
    address: read<string | null>(raw, "address", "Address"),
    lat: read<number | null>(raw, "lat", "Lat"),
    lon: read<number | null>(raw, "lon", "Lon"),
    originalStopSequence: read<number | null>(
      raw,
      "originalStopSequence",
      "OriginalStopSequence"
    ),
    optimizedSequence: read<number | null>(
      raw,
      "optimizedSequence",
      "OptimizedSequence"
    ),
    stopType: read<string | null>(raw, "stopType", "StopType"),
    orders: (read<unknown>(raw, "orders", "Orders") as unknown[]) ?? [],
    lpns: Array.isArray(lpns) ? lpns.map(normalizeTripLpn) : [],
  };
};

const buildRouteLegsFromStops = (
  origin: TDispatchTripRoutePoint | null,
  destination: TDispatchTripRoutePoint | null,
  stops: TDispatchOptimizedStop[]
): TDispatchTripRouteLeg[] => {
  const points = [origin, ...stops, destination].filter(Boolean) as {
    address?: string | null;
  }[];

  if (points.length < 2) return [];

  return points.slice(0, -1).map((point, index) => ({
    legIndex: index + 1,
    fromAddress: point.address ?? null,
    toAddress: points[index + 1]?.address ?? null,
    startAddress: point.address ?? null,
    endAddress: points[index + 1]?.address ?? null,
  }));
};

export const normalizeTripRoute = (
  item: TDispatchTripRoute | Record<string, any>
): TDispatchTripRoute => {
  const raw = item as Record<string, any>;
  const legs = read<unknown>(raw, "legs", "Legs");
  const optimizedStopsRaw = read<unknown>(raw, "optimizedStops", "OptimizedStops");
  const optimizedStops = Array.isArray(optimizedStopsRaw)
    ? optimizedStopsRaw.map(normalizeOptimizedStop)
    : [];
  const origin = normalizeRoutePoint(read<unknown>(raw, "origin", "Origin"));
  const destination = normalizeRoutePoint(
    read<unknown>(raw, "destination", "Destination")
  );
  const totalDistanceMeters = read<number | null>(
    raw,
    "totalDistanceMeters",
    "TotalDistanceMeters"
  );
  const totalDurationSeconds = read<number | null>(
    raw,
    "totalDurationSeconds",
    "TotalDurationSeconds"
  );
  const normalizedLegs = Array.isArray(legs)
    ? legs.map((leg, legIndex) =>
        normalizeRouteLeg(leg as Record<string, any>, legIndex)
      )
    : buildRouteLegsFromStops(origin, destination, optimizedStops);

  return {
    tripId: read<string | null>(raw, "tripId", "TripId"),
    totalDistanceMeters,
    totalDistanceKm:
      read<number | null>(raw, "totalDistanceKm", "TotalDistanceKm") ??
      (typeof totalDistanceMeters === "number"
        ? Math.round((totalDistanceMeters / 1000) * 10) / 10
        : null),
    totalDurationMinutes:
      read<number | null>(raw, "totalDurationMinutes", "TotalDurationMinutes") ??
      (typeof totalDurationSeconds === "number"
        ? Math.round(totalDurationSeconds / 60)
        : null),
    totalDurationSeconds,
    totalStops:
      read<number | null>(raw, "totalStops", "TotalStops") ??
      optimizedStops.length,
    overviewPolyline: read<string | null>(
      raw,
      "overviewPolyline",
      "OverviewPolyline"
    ),
    goongRouteOverview: read<string | null>(
      raw,
      "goongRouteOverview",
      "GoongRouteOverview"
    ),
    waypointOrder:
      (read<number[] | undefined>(raw, "waypointOrder", "WaypointOrder") as
        | number[]
        | undefined) ?? [],
    origin,
    destination,
    optimizedStops,
    legs: normalizedLegs,
  };
};

export const normalizeTrip = (
  item: TDispatchTrip | Record<string, any>,
  source: TDispatchTrip["source"]
): TDispatchTrip => {
  const raw = item as Record<string, any>;
  const lpns = read<unknown>(raw, "lpns", "Lpns");

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    status: read<string>(raw, "status", "Status") || "UNKNOWN",
    vehicle: read<string | null>(raw, "vehicle", "Vehicle"),
    driver: read<string | null>(raw, "driver", "Driver"),
    plannedStartTime: read<string | null>(
      raw,
      "plannedStartTime",
      "PlannedStartTime"
    ),
    plannedEndTime: read<string | null>(raw, "plannedEndTime", "PlannedEndTime"),
    estimatedDurationHours: read<number | null>(
      raw,
      "estimatedDurationHours",
      "EstimatedDurationHours"
    ),
    totalLpns: toNumber(read(raw, "totalLpns", "TotalLpns")),
    allocatedLpns: read<number | null>(raw, "allocatedLpns", "AllocatedLpns"),
    loadingCompletedLpns: read<number | null>(
      raw,
      "loadingCompletedLpns",
      "LoadingCompletedLpns"
    ),
    releasedLpns: read<number | null>(raw, "releasedLpns", "ReleasedLpns"),
    readyToLoad: read<boolean | undefined>(raw, "readyToLoad", "ReadyToLoad"),
    sealNumber: read<string | null>(raw, "sealNumber", "SealNumber"),
    label: read<string | undefined>(raw, "label", "Label"),
    source,
    lpns: Array.isArray(lpns) ? lpns.map(normalizeTripLpn) : undefined,
  };
};

export const normalizeSealAndDispatchResult = (
  item: TSealAndDispatchResult | Record<string, any>
): TSealAndDispatchResult => {
  const raw = item as Record<string, any>;

  return {
    tripId: read<string>(raw, "tripId", "TripId"),
    sealCode: read<string | null>(raw, "sealCode", "SealCode"),
    allOrdersLoaded: read<boolean | null>(
      raw,
      "allOrdersLoaded",
      "AllOrdersLoaded"
    ),
    totalOrders: read<number | null>(raw, "totalOrders", "TotalOrders"),
    loadedOrders: read<number | null>(raw, "loadedOrders", "LoadedOrders"),
    sealedAt: read<string | null>(raw, "sealedAt", "SealedAt"),
    sealedBy: read<string | null>(raw, "sealedBy", "SealedBy"),
    tripStatus: read<string | null>(raw, "tripStatus", "TripStatus"),
    waybillUrl: read<string | null>(raw, "waybillUrl", "WaybillUrl"),
  };
};

export const normalizeTripDocuments = (
  lifoData?: Record<string, any>,
  waybillData?: Record<string, any>
): TDispatchTripDocuments => ({
  lifoPdfUrl: lifoData
    ? read<string | null>(lifoData, "lifoPdfUrl", "LifoPdfUrl")
    : null,
  waybillPdfUrl: waybillData
    ? read<string | null>(waybillData, "waybillPdfUrl", "WaybillPdfUrl")
    : null,
});

export const mergeTrips = (trips: TDispatchTrip[]) => {
  const map = new Map<string, TDispatchTrip>();

  trips.forEach((trip) => {
    const existing = map.get(trip.tripId);
    if (!existing) {
      map.set(trip.tripId, trip);
      return;
    }

    map.set(trip.tripId, {
      ...existing,
      ...trip,
      lpns: trip.lpns?.length ? trip.lpns : existing.lpns,
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    const aTime = a.plannedStartTime ? new Date(a.plannedStartTime).getTime() : 0;
    const bTime = b.plannedStartTime ? new Date(b.plannedStartTime).getTime() : 0;
    return bTime - aTime;
  });
};
