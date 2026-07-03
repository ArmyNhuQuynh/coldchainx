import { apiRequest } from "@/lib/http";
import type {
  TDispatchDriverLookup,
  TDispatchLookupEnvelope,
  TDispatchReadyLpn,
  TDispatchReadyLpnQuery,
  TDispatchVehicleLookup,
} from "@/schemas/dispatch.schema";
import {
  DRIVER_STATUS,
  normalizeDriverStatus,
} from "@/types/enums/driver-status.enum";
import { read, toNumber, unwrapLookup } from "./dispatch-api.helpers";
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

const getReadyLpns = async (params?: TDispatchReadyLpnQuery) => {
  const response = await apiRequest.baseApi.get<
    TDispatchLookupEnvelope<TDispatchReadyLpn[]> | TDispatchReadyLpn[]
  >(`${API_SUFFIX.DISPATCH_API}/lookup/lpns-ready`, {
    params,
  });

  return unwrapLookup<TDispatchReadyLpn>(response.data).map(normalizeLpn);
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
  getReadyLpns,
  getAvailableVehicles,
  getAvailableDrivers,
};
