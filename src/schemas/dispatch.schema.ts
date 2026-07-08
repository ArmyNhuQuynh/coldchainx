import type { TDispatchTripStatus } from "@/types/enums/dispatch.enum";

export type TDispatchLookupEnvelope<T> = {
  success?: boolean;
  count?: number;
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
  data?: T;
  Success?: boolean;
  Count?: number;
  PageNumber?: number;
  PageSize?: number;
  TotalRecords?: number;
  TotalPages?: number;
  Data?: T;
};

export type TDispatchVehicleLookup = {
  vehicleId: string;
  label?: string;
  truckPlate: string;
  vehicleType?: string;
  maxWeight: number;
  maxCbm: number;
  minTemp?: number | null;
  maxTemp?: number | null;
};

export type TDispatchDriverLookup = {
  driverId: string;
  fullName: string;
  phoneNumber?: string | null;
  status?: string | null;
  licenseClass?: string | null;
  licenseExpiry?: string | null;
  hasValidLicense?: boolean;
  label?: string;
};

export type TDispatchReadyLpn = {
  lpnId: string;
  label?: string;
  lpnCode: string;
  trackingCode?: string | null;
  itemName?: string | null;
  tempCondition?: string | null;
  quantity?: number | null;
  actualWeightKg: number;
  actualCbm: number;
  orderId: string;
  createdAt?: string | null;
  warehouseId?: string | null;
  warehouseName?: string | null;
  plannedDispatchDate?: string | null;
  customerName?: string | null;
  destinationAddress?: string | null;
  routeName?: string | null;
};

export type TDispatchReadyLpnQuery = {
  warehouseId?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type TManualDispatchRequest = {
  warehouseId: string;
  lpnIds: string[];
  vehicleId: string;
  driverIds: string[];
  plannedStartTime: string;
  plannedEndTime: string;
};

export type TManualDispatchResult = {
  tripId: string;
  lifoPdfUrl?: string | null;
  estimatedDurationHours?: number | null;
  lateLpnCount?: number;
  slaWarning?: string | null;
  suggestedMaxPayloadKg?: number | null;
};

export type TDispatchFilters = {
  search: string;
  warehouseId: string;
  temperatureGroup: string;
};

export type TDispatchTripLpn = {
  lpnId: string;
  lpnCode: string;
  orderId?: string | null;
  orderCode?: string | null;
  itemName?: string | null;
  storageLocation?: string | null;
  quantity?: number | null;
  state?: string | null;
  condition?: string | null;
  status?: string | null;
};

export type TDispatchTrip = {
  tripId: string;
  status: TDispatchTripStatus;
  vehicle?: string | null;
  driver?: string | null;
  plannedStartTime?: string | null;
  plannedEndTime?: string | null;
  estimatedDurationHours?: number | null;
  totalLpns: number;
  allocatedLpns?: number | null;
  loadingCompletedLpns?: number | null;
  releasedLpns?: number | null;
  readyToLoad?: boolean;
  sealNumber?: string | null;
  label?: string;
  source: "planned" | "picking" | "readyToSeal";
  lpns?: TDispatchTripLpn[];
};

export type TCancelTripResult = {
  tripId: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  resetLpnCount?: number;
  resetOrderCount?: number;
  cancelledSealCount?: number;
  voidedDocumentCount?: number;
  vehiclePlate?: string | null;
  driverName?: string | null;
  cancelledAt?: string | null;
  message?: string | null;
};

export type TStartPickingResult = {
  tripId: string;
  status: string;
  lpnCount: number;
};

export type TSealAndDispatchRequest = {
  tripId: string;
  sealCode: string;
};

export type TSealAndDispatchResult = {
  tripId: string;
  sealCode?: string | null;
  allOrdersLoaded?: boolean | null;
  totalOrders?: number | null;
  loadedOrders?: number | null;
  sealedAt?: string | null;
  sealedBy?: string | null;
  tripStatus?: string | null;
  waybillUrl?: string | null;
};

export type TDispatchTripDocuments = {
  lifoPdfUrl?: string | null;
  waybillPdfUrl?: string | null;
};

export type TDispatchTripRouteStep = {
  stepIndex?: number | null;
  instruction?: string | null;
  distanceKm?: number | null;
  durationSeconds?: number | null;
  maneuver?: string | null;
};

export type TDispatchTripRouteLeg = {
  legIndex?: number | null;
  fromAddress?: string | null;
  toAddress?: string | null;
  startAddress?: string | null;
  endAddress?: string | null;
  distanceKm?: number | null;
  durationMinutes?: number | null;
  durationSeconds?: number | null;
  steps?: TDispatchTripRouteStep[];
};

export type TDispatchTripRoutePoint = {
  locationId?: string | null;
  address?: string | null;
  lat?: number | null;
  lon?: number | null;
};

export type TDispatchOptimizedStop = TDispatchTripRoutePoint & {
  stopId?: string | null;
  originalStopSequence?: number | null;
  optimizedSequence?: number | null;
  stopType?: string | null;
  orders?: unknown[];
  lpns?: TDispatchTripLpn[];
};

export type TDispatchTripRoute = {
  tripId?: string | null;
  totalDistanceKm?: number | null;
  totalDistanceMeters?: number | null;
  totalDurationMinutes?: number | null;
  totalDurationSeconds?: number | null;
  totalStops?: number | null;
  overviewPolyline?: string | null;
  goongRouteOverview?: string | null;
  waypointOrder?: number[];
  origin?: TDispatchTripRoutePoint | null;
  destination?: TDispatchTripRoutePoint | null;
  optimizedStops?: TDispatchOptimizedStop[];
  legs?: TDispatchTripRouteLeg[];
};
