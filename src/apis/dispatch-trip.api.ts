import { apiRequest } from "@/lib/http";
import type {
  TCancelTripResult,
  TDispatchLookupEnvelope,
  TDispatchOptimizedStop,
  TDispatchTrip,
  TDispatchTripDocuments,
  TDispatchTripLpn,
  TDispatchTripRoute,
  TDispatchTripRouteLeg,
  TDispatchTripRoutePoint,
  TDispatchTripRouteStep,
  TStartPickingResult,
} from "@/schemas/dispatch.schema";
import { read, toNumber, unwrapData, unwrapLookup } from "./dispatch-api.helpers";
import { API_SUFFIX } from "./util.api";

const normalizeTripLpn = (
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

const normalizeTripRoute = (
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

const normalizeTrip = (
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

const mergeTrips = (trips: TDispatchTrip[]) => {
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

const getTripsCanStartPicking = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTrip[]> | TDispatchTrip[]
  >(`${API_SUFFIX.DISPATCH_API}/trips/can-start-picking`);

  return unwrapLookup<TDispatchTrip>(response.data).map((item) =>
    normalizeTrip(item, "planned")
  );
};

const getPickingTrips = async (tripId?: string) => {
  const response = await apiRequest.baseApi.get<TDispatchTrip[]>(
    `${API_SUFFIX.OUTBOUND_API}/available-trips`,
    {
      params: tripId ? { tripId } : undefined,
    }
  );

  return response.data.map((item) => normalizeTrip(item, "picking"));
};

const getTripsReadyToSeal = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTrip[]> | TDispatchTrip[]
  >(`${API_SUFFIX.DISPATCH_API}/trips/ready-to-seal`);

  return unwrapLookup<TDispatchTrip>(response.data).map((item) =>
    normalizeTrip(item, "readyToSeal")
  );
};

const getCreatedTrips = async () => {
  const [plannedTrips, pickingTrips, readyToSealTrips] = await Promise.all([
    getTripsCanStartPicking(),
    getPickingTrips(),
    getTripsReadyToSeal(),
  ]);

  return mergeTrips([...plannedTrips, ...pickingTrips, ...readyToSealTrips]);
};

const getTripPickList = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<TDispatchTripLpn[]>(
    `${API_SUFFIX.OUTBOUND_API}/pick-list/${tripId}`
  );

  return response.data.map(normalizeTripLpn);
};

const cancelTrip = async (tripId: string) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TCancelTripResult> | TCancelTripResult
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/cancel`);

  return unwrapData<TCancelTripResult>(response.data);
};

const startPicking = async (tripId: string) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TStartPickingResult> | TStartPickingResult
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/start-picking`);

  return unwrapData<TStartPickingResult>(response.data);
};

const getTripDocuments = async (
  tripId: string
): Promise<TDispatchTripDocuments> => {
  const [lifoResult, waybillResult] = await Promise.allSettled([
    apiRequest.baseApi.get<Record<string, any>>(
      `${API_SUFFIX.DISPATCH_API}/trip/${tripId}/lifo-url`
    ),
    apiRequest.baseApi.get<Record<string, any>>(
      `${API_SUFFIX.DISPATCH_API}/trip/${tripId}/waybill-url`
    ),
  ]);

  const lifoData =
    lifoResult.status === "fulfilled" ? lifoResult.value.data : undefined;
  const waybillData =
    waybillResult.status === "fulfilled" ? waybillResult.value.data : undefined;

  return {
    lifoPdfUrl: lifoData
      ? read<string | null>(lifoData, "lifoPdfUrl", "LifoPdfUrl")
      : null,
    waybillPdfUrl: waybillData
      ? read<string | null>(waybillData, "waybillPdfUrl", "WaybillPdfUrl")
      : null,
  };
};

const getTripRoute = async (tripId: string) => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchTripRoute> | TDispatchTripRoute
  >(`${API_SUFFIX.DISPATCH_API}/trip/${tripId}/route`);

  return normalizeTripRoute(unwrapData<TDispatchTripRoute>(response.data));
};

export const dispatchTripApi = {
  getCreatedTrips,
  getPickingTrips,
  getTripPickList,
  cancelTrip,
  startPicking,
  getTripDocuments,
  getTripRoute,
};
