import { apiRequest } from "@/lib/http";
import type {
  TDispatchLookupEnvelope,
  TDispatchPackingRequest,
  TDispatchPackingResult,
  TManualDispatchRequest,
  TManualDispatchResult,
  TWarehouseRedispatchRequest,
} from "@/schemas/dispatch.schema";
import { read, toNumber, unwrapData } from "./dispatch-api.helpers";
import { API_SUFFIX } from "./util.api";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeDriverIds = (driverIds: string[]) => {
  const normalizedIds = driverIds
    .map((driverId) => driverId.trim())
    .filter(Boolean);
  const uniqueIds = Array.from(new Set(normalizedIds));
  const hasInvalidId =
    uniqueIds.length !== normalizedIds.length ||
    uniqueIds.some(
      (driverId) =>
        driverId.toUpperCase() === "N/A" || !UUID_PATTERN.test(driverId)
    );

  if (hasInvalidId || uniqueIds.length < 1 || uniqueIds.length > 2) {
    throw new Error("Vui lòng chọn 1 hoặc 2 tài xế khả dụng từ danh sách.");
  }

  return uniqueIds;
};

const normalizePackingResult = (
  item: TDispatchPackingResult | Record<string, any>
): TDispatchPackingResult => {
  const raw = item as Record<string, any>;
  const vehicleRaw = read<Record<string, any> | null>(raw, "vehicle", "Vehicle");

  return {
    selectedSetValid:
      read<boolean | undefined>(raw, "selectedSetValid", "SelectedSetValid") ?? false,
    canCreateTrip:
      read<boolean | undefined>(raw, "canCreateTrip", "CanCreateTrip") ?? false,
    blockingReasons:
      read<string[] | undefined>(raw, "blockingReasons", "BlockingReasons") ?? [],
    vehicle: vehicleRaw
      ? {
          vehicleId: read<string>(vehicleRaw, "vehicleId", "VehicleId"),
          truckPlate: read<string>(vehicleRaw, "truckPlate", "TruckPlate"),
          vehicleType: read<string | null>(vehicleRaw, "vehicleType", "VehicleType"),
          status: read<string | null>(vehicleRaw, "status", "Status"),
          maxWeight: toNumber(read(vehicleRaw, "maxWeight", "MaxWeight")),
          maxCbm: toNumber(read(vehicleRaw, "maxCbm", "MaxCbm")),
          minTemp: read<number | null>(vehicleRaw, "minTemp", "MinTemp"),
          maxTemp: read<number | null>(vehicleRaw, "maxTemp", "MaxTemp"),
        }
      : null,
    totalWeight: toNumber(read(raw, "totalWeight", "TotalWeight")),
    maxWeight: toNumber(read(raw, "maxWeight", "MaxWeight")),
    weightUtilization: toNumber(
      read(raw, "weightUtilization", "WeightUtilization")
    ),
    isOverweight:
      read<boolean | undefined>(raw, "isOverweight", "IsOverweight") ?? false,
    totalCbm: toNumber(read(raw, "totalCbm", "TotalCbm")),
    maxCbm: toNumber(read(raw, "maxCbm", "MaxCbm")),
    isOverCbm: read<boolean | undefined>(raw, "isOverCbm", "IsOverCbm") ?? false,
    placedItems: read<unknown[] | undefined>(raw, "placedItems", "PlacedItems") ?? [],
    unplacedLpnIds:
      read<string[] | undefined>(raw, "unplacedLpnIds", "UnplacedLpnIds") ?? [],
    utilisation: toNumber(read(raw, "utilisation", "Utilisation")),
    vehicleType: read<string | null>(raw, "vehicleType", "VehicleType"),
    containerLength: read<number | null>(raw, "containerLength", "ContainerLength"),
    containerWidth: read<number | null>(raw, "containerWidth", "ContainerWidth"),
    containerHeight: read<number | null>(raw, "containerHeight", "ContainerHeight"),
    shareableLink: read<string | null>(raw, "shareableLink", "ShareableLink"),
  };
};

const simulatePacking = async (data: TDispatchPackingRequest) => {
  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TDispatchPackingResult> | TDispatchPackingResult
  >(`${API_SUFFIX.DISPATCH_API}/simulate-packing`, data, {
    params: { for3d: true },
  });

  return normalizePackingResult(unwrapData<TDispatchPackingResult>(response.data));
};

const manualDispatch = async (data: TManualDispatchRequest) => {
  const driverIds = normalizeDriverIds(data.driverIds);
  const formData = new FormData();
  if (data.incidentId) {
    formData.append("IncidentId", data.incidentId);
  }
  if (data.scheduleId) {
    formData.append("ScheduleId", data.scheduleId);
  }
  formData.append("VehicleId", data.vehicleId);
  formData.append("PlannedStartTime", data.plannedStartTime);
  formData.append("PlannedEndTime", data.plannedEndTime);
  driverIds.forEach((driverId) => formData.append("DriverIds", driverId));
  if (data.screenshotBase64) {
    formData.append("ScreenshotBase64", data.screenshotBase64);
  }

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TManualDispatchResult> | TManualDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/manual-dispatch`, formData, {
    params: { lpnIds: data.lpnIds },
  });

  return unwrapData<TManualDispatchResult>(response.data);
};

const createTripFromWarehouse = async (data: TWarehouseRedispatchRequest) => {
  const formData = new FormData();
  formData.append("VehicleId", data.vehicleId);
  data.driverIds.forEach((driverId) => formData.append("DriverIds", driverId));
  formData.append("PlannedStartTime", data.plannedStartTime);
  formData.append("PlannedEndTime", data.plannedEndTime);
  if (data.screenshotBase64) {
    formData.append("ScreenshotBase64", data.screenshotBase64);
  }

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TManualDispatchResult> | TManualDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/create-trip-from-warehouse`, formData, {
    params: { lpnIds: data.lpnIds },
  });

  return unwrapData<TManualDispatchResult>(response.data);
};

export const dispatchApi = {
  simulatePacking,
  manualDispatch,
  createTripFromWarehouse,
};
