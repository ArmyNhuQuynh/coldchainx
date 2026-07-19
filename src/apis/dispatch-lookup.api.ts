import { apiRequest } from "@/lib/http";
import type {
  TCompatibleLpnsSearchParams,
  TCompatibleLpnsSearchRequest,
  TCompatibleLpnsSearchResult,
  TDispatchCompatibilityConflict,
  TDispatchDriverLookup,
  TDispatchLookupEnvelope,
  TDispatchReadyLpn,
  TDispatchScheduleLookup,
  TDispatchVehicleLookup,
} from "@/schemas/dispatch.schema";
import {
  DRIVER_STATUS,
  normalizeDriverStatus,
} from "@/types/enums/driver-status.enum";
import { read, toNumber, unwrapData, unwrapLookup } from "./dispatch-api.helpers";
import { API_SUFFIX } from "./util.api";

const normalizeLpn = (
  item: TDispatchReadyLpn | Record<string, any>
): TDispatchReadyLpn => {
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
    customerName: read<string | null>(raw, "customerName", "CustomerName"),
    destinationAddress: read<string | null>(
      raw,
      "destinationAddress",
      "DestinationAddress"
    ),
    routeName: read<string | null>(raw, "routeName", "RouteName"),
    scheduleId: read<string | null>(raw, "scheduleId", "ScheduleId"),
    scheduleName: read<string | null>(raw, "scheduleName", "ScheduleName"),
    category: read<string | null>(raw, "category", "Category"),
    requiredTemperature: read<number | null>(
      raw,
      "requiredTemperature",
      "RequiredTemperature"
    ),
    hasStrongOdor: read<boolean | null>(raw, "hasStrongOdor", "HasStrongOdor"),
    isStackable: read<boolean | null>(raw, "isStackable", "IsStackable"),
    isCompatible: read<boolean | undefined>(raw, "isCompatible", "IsCompatible"),
  };
};

const normalizeSchedule = (
  item: TDispatchScheduleLookup | Record<string, any>
): TDispatchScheduleLookup => {
  const raw = item as Record<string, any>;

  return {
    scheduleId: read<string>(raw, "scheduleId", "ScheduleId"),
    routeId: read<string>(raw, "routeId", "RouteId"),
    routeCode: read<string | null>(raw, "routeCode", "RouteCode"),
    routeName: read<string | null>(raw, "routeName", "RouteName"),
    scheduleName: read<string | null>(raw, "scheduleName", "ScheduleName"),
    departureDate: read<string>(raw, "departureDate", "DepartureDate"),
    dayOfWeek: read<number | null>(raw, "dayOfWeek", "DayOfWeek"),
    departureTime: read<string>(raw, "departureTime", "DepartureTime"),
    cutOffTime: read<string | null>(raw, "cutOffTime", "CutOffTime"),
    status: read<string | null>(raw, "status", "Status"),
    label: read<string | null>(raw, "label", "Label"),
  };
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
    hasValidLicense: read<boolean | undefined>(
      raw,
      "hasValidLicense",
      "HasValidLicense"
    ),
    label: read<string | undefined>(raw, "label", "Label"),
  };
};

const normalizeConflict = (
  item: TDispatchCompatibilityConflict | Record<string, any>
): TDispatchCompatibilityConflict => {
  const raw = item as Record<string, any>;

  return {
    reasonCode: read<string | null>(raw, "reasonCode", "ReasonCode"),
    message: read<string>(raw, "message", "Message"),
    lpnId: read<string | null>(raw, "lpnId", "LpnId"),
    lpnCode: read<string | null>(raw, "lpnCode", "LpnCode"),
    otherLpnId: read<string | null>(raw, "otherLpnId", "OtherLpnId"),
    otherLpnCode: read<string | null>(raw, "otherLpnCode", "OtherLpnCode"),
  };
};

const normalizeCompatibleResult = (
  item: TCompatibleLpnsSearchResult | Record<string, any>
): TCompatibleLpnsSearchResult => {
  const raw = item as Record<string, any>;
  const conflicts =
    read<Array<TDispatchCompatibilityConflict | Record<string, any>>>(
      raw,
      "conflicts",
      "Conflicts"
    ) ?? [];
  const items =
    read<Array<TDispatchReadyLpn | Record<string, any>>>(raw, "items", "Items") ?? [];

  return {
    selectedSetValid:
      read<boolean | undefined>(raw, "selectedSetValid", "SelectedSetValid") ?? false,
    conflicts: conflicts.map(normalizeConflict),
    totalRecords: toNumber(read(raw, "totalRecords", "TotalRecords")),
    totalPages: toNumber(read(raw, "totalPages", "TotalPages")),
    currentPage: toNumber(read(raw, "currentPage", "CurrentPage")) || 1,
    pageSize: toNumber(read(raw, "pageSize", "PageSize")),
    items: items.map(normalizeLpn),
  };
};

const getSchedules = async () => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchScheduleLookup[]> | TDispatchScheduleLookup[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/Schedule`);

  return unwrapLookup<TDispatchScheduleLookup>(response.data).map(normalizeSchedule);
};

const searchCompatibleLpns = async (
  data: TCompatibleLpnsSearchRequest,
  params: TCompatibleLpnsSearchParams
) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TCompatibleLpnsSearchResult> | TCompatibleLpnsSearchResult
  >(`${API_SUFFIX.DISPATCH_API}/compatible-lpns/search`, data, { params });

  return normalizeCompatibleResult(
    unwrapData<TCompatibleLpnsSearchResult>(response.data)
  );
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

  return unwrapLookup<TDispatchDriverLookup>(response.data)
    .map(normalizeDriver)
    .filter(
      (driver) => normalizeDriverStatus(driver.status) === DRIVER_STATUS.ACTIVE
    );
};

export const dispatchLookupApi = {
  getSchedules,
  searchCompatibleLpns,
  getAvailableVehicles,
  getAvailableDrivers,
};
