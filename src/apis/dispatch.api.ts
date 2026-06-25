import { apiRequest } from "@/lib/http";
import type { TOrder } from "@/schemas/order.schema";
import type {
  TDispatchDriverLookup,
  TDispatchLookupEnvelope,
  TDispatchReadyLpn,
  TDispatchTrip,
  TDispatchTripLpn,
  TDispatchVehicleLookup,
  TCancelTripResult,
  TManualDispatchRequest,
  TManualDispatchResult,
} from "@/schemas/dispatch.schema";
import { API_SUFFIX } from "./util.api";

const unwrapLookup = <T>(payload: TDispatchLookupEnvelope<T[]> | T[]): T[] => {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.Data ?? [];
};

const unwrapData = <T>(payload: TDispatchLookupEnvelope<T> | T): T => {
  if (payload && typeof payload === "object" && ("data" in payload || "Data" in payload)) {
    const envelope = payload as TDispatchLookupEnvelope<T>;
    return (envelope.data ?? envelope.Data) as T;
  }

  return payload as T;
};

const read = <T>(item: Record<string, any>, camelKey: string, pascalKey: string): T =>
  (item[camelKey] ?? item[pascalKey]) as T;

const toNumber = (value: unknown) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const normalizeLpn = (item: TDispatchReadyLpn | Record<string, any>): TDispatchReadyLpn => {
  const raw = item as Record<string, any>;
  return {
    lpnId: read<string>(raw, "lpnId", "LpnId"),
    label: read<string | undefined>(raw, "label", "Label"),
    lpnCode: read<string>(raw, "lpnCode", "LpnCode"),
    trackingCode: read<string | null>(raw, "trackingCode", "TrackingCode"),
    itemName: read<string | null>(raw, "itemName", "ItemName"),
    tempCondition: read<string | null>(raw, "tempCondition", "TempCondition"),
    quantity: read<number | null>(raw, "quantity", "Quantity"),
    actualWeightKg: toNumber(read(raw, "actualWeightKg", "ActualWeightKg")),
    actualCbm: toNumber(read(raw, "actualCbm", "ActualCbm")),
    orderId: read<string>(raw, "orderId", "OrderId"),
    createdAt: read<string | null>(raw, "createdAt", "CreatedAt"),
    warehouseId: read<string | null>(raw, "warehouseId", "WarehouseId"),
    warehouseName: read<string | null>(raw, "warehouseName", "WarehouseName"),
    plannedDispatchDate: read<string | null>(
      raw,
      "plannedDispatchDate",
      "PlannedDispatchDate"
    ),
    dispatchDate: read<string | null>(raw, "dispatchDate", "DispatchDate"),
    deliveryDate: read<string | null>(raw, "deliveryDate", "DeliveryDate"),
    slaDeadline: read<string | null>(raw, "slaDeadline", "SlaDeadline"),
    customerName: read<string | null>(raw, "customerName", "CustomerName"),
    destinationLocationId: read<string | null>(
      raw,
      "destinationLocationId",
      "DestinationLocationId"
    ),
    destinationAddress: read<string | null>(
      raw,
      "destinationAddress",
      "DestinationAddress"
    ),
    destinationLatitude: read<number | null>(
      raw,
      "destinationLatitude",
      "DestinationLatitude"
    ),
    destinationLongitude: read<number | null>(
      raw,
      "destinationLongitude",
      "DestinationLongitude"
    ),
    routeId: read<string | null>(raw, "routeId", "RouteId"),
    routeCode: read<string | null>(raw, "routeCode", "RouteCode"),
    routeOriginCity: read<string | null>(raw, "routeOriginCity", "RouteOriginCity"),
    routeDestCity: read<string | null>(raw, "routeDestCity", "RouteDestCity"),
  };
};

const enrichLpnsWithOrders = async (lpns: TDispatchReadyLpn[]) => {
  const missingOrderIds = Array.from(
    new Set(
      lpns
        .filter((lpn) => lpn.orderId && (!lpn.destinationAddress || !lpn.routeCode))
        .map((lpn) => lpn.orderId)
    )
  );

  if (missingOrderIds.length === 0) return lpns;

  const orderEntries = await Promise.all(
    missingOrderIds.map(async (orderId) => {
      try {
        const response = await apiRequest.baseApi.get<{ data?: TOrder; Data?: TOrder }>(
          `${API_SUFFIX.ORDERS_API}/${orderId}`
        );
        return [orderId, response.data.data ?? response.data.Data ?? null] as const;
      } catch {
        return [orderId, null] as const;
      }
    })
  );

  const orderMap = new Map(orderEntries);

  return lpns.map((lpn) => {
    const order = orderMap.get(lpn.orderId);
    if (!order) return lpn;

    return {
      ...lpn,
      trackingCode: lpn.trackingCode ?? order.trackingCode,
      itemName: lpn.itemName ?? order.itemName,
      tempCondition: lpn.tempCondition ?? order.tempCondition,
      customerName: lpn.customerName ?? order.customerName,
      destinationLocationId:
        lpn.destinationLocationId ?? order.destination?.locationId ?? null,
      destinationAddress:
        lpn.destinationAddress ?? order.destination?.address ?? null,
      destinationLatitude:
        lpn.destinationLatitude ?? order.destination?.latitude ?? null,
      destinationLongitude:
        lpn.destinationLongitude ?? order.destination?.longitude ?? null,
      routeId: lpn.routeId ?? order.route?.routeId ?? null,
      routeCode: lpn.routeCode ?? order.route?.routeCode ?? null,
      routeOriginCity: lpn.routeOriginCity ?? order.route?.originCity ?? null,
      routeDestCity: lpn.routeDestCity ?? order.route?.destCity ?? null,
    };
  });
};

const normalizeVehicle = (
  item: TDispatchVehicleLookup | Record<string, any>
): TDispatchVehicleLookup => {
  const raw = item as Record<string, any>;
  return {
    vehicleId: read<string>(raw, "vehicleId", "VehicleId"),
    label: read<string | undefined>(raw, "label", "Label"),
    truckPlate: read<string>(raw, "truckPlate", "TruckPlate"),
    vehicleType: read<string | undefined>(raw, "vehicleType", "VehicleType"),
    maxWeight: toNumber(read(raw, "maxWeight", "MaxWeight")),
    maxCbm: toNumber(read(raw, "maxCbm", "MaxCbm")),
    minTemp: read<number | null>(raw, "minTemp", "MinTemp"),
    maxTemp: read<number | null>(raw, "maxTemp", "MaxTemp"),
    warehouseId: read<string | null>(raw, "warehouseId", "WarehouseId"),
    warehouseName: read<string | null>(raw, "warehouseName", "WarehouseName"),
    currentLocation: read<string | null>(raw, "currentLocation", "CurrentLocation"),
  };
};

const normalizeDriver = (
  item: TDispatchDriverLookup | Record<string, any>
): TDispatchDriverLookup => {
  const raw = item as Record<string, any>;
  return {
    driverId: read<string>(raw, "driverId", "DriverId"),
    fullName: read<string>(raw, "fullName", "FullName"),
    phoneNumber: read<string | null>(raw, "phoneNumber", "PhoneNumber"),
    status: read<string | null>(raw, "status", "Status"),
    licenseClass: read<string | null>(raw, "licenseClass", "LicenseClass"),
    licenseExpiry: read<string | null>(raw, "licenseExpiry", "LicenseExpiry"),
    hasValidLicense: read<boolean | undefined>(raw, "hasValidLicense", "HasValidLicense"),
    label: read<string | undefined>(raw, "label", "Label"),
    warehouseId: read<string | null>(raw, "warehouseId", "WarehouseId"),
    warehouseName: read<string | null>(raw, "warehouseName", "WarehouseName"),
    currentLocation: read<string | null>(raw, "currentLocation", "CurrentLocation"),
  };
};

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
    storageLocation: read<string | null>(raw, "storageLocation", "StorageLocation"),
    quantity: read<number | null>(raw, "quantity", "Quantity"),
    state: read<string | null>(raw, "state", "State"),
    condition: read<string | null>(raw, "condition", "Condition"),
    status: read<string | null>(raw, "status", "Status"),
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

const getReadyLpns = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchReadyLpn[]> | TDispatchReadyLpn[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/lpns-ready`);

  const lpns = unwrapLookup<TDispatchReadyLpn>(response.data).map(normalizeLpn);
  return enrichLpnsWithOrders(lpns);
};

const getAvailableVehicles = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchVehicleLookup[]> | TDispatchVehicleLookup[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/vehicles`);

  return unwrapLookup<TDispatchVehicleLookup>(response.data).map(normalizeVehicle);
};

const getAvailableDrivers = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchDriverLookup[]> | TDispatchDriverLookup[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/drivers`);

  return unwrapLookup<TDispatchDriverLookup>(response.data).map(normalizeDriver);
};

const manualDispatch = async (data: TManualDispatchRequest) => {
  const formData = new FormData();
  formData.append("VehicleId", data.vehicleId);
  formData.append("PlannedStartTime", data.plannedStartTime);
  formData.append("PlannedEndTime", data.plannedEndTime);
  data.driverIds.forEach((driverId) => formData.append("DriverIds", driverId));

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TManualDispatchResult> | TManualDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/manual-dispatch`, formData, {
    params: {
      lpnIds: data.lpnIds,
    },
  });

  return unwrapData<TManualDispatchResult>(response.data);
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

export const dispatchApi = {
  getReadyLpns,
  getAvailableVehicles,
  getAvailableDrivers,
  manualDispatch,
  getCreatedTrips,
  getPickingTrips,
  getTripPickList,
  cancelTrip,
};
