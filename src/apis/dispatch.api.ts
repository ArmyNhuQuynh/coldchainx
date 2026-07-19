import { apiRequest } from "@/lib/http";
import type {
  TDispatchLookupEnvelope,
  TDispatchPackingRequest,
  TDispatchPackingResult,
  TManualDispatchRequest,
  TManualDispatchResult,
} from "@/schemas/dispatch.schema";
import { read, toNumber, unwrapData } from "./dispatch-api.helpers";
import { API_SUFFIX } from "./util.api";

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
  const formData = new FormData();
  formData.append("ScheduleId", data.scheduleId);
  formData.append("VehicleId", data.vehicleId);
  formData.append("PlannedStartTime", data.plannedStartTime);
  formData.append("PlannedEndTime", data.plannedEndTime);
  data.driverIds.forEach((driverId) => formData.append("DriverIds", driverId));

  const response = await apiRequest.baseApi.post<
    TDispatchLookupEnvelope<TManualDispatchResult> | TManualDispatchResult
  >(`${API_SUFFIX.DISPATCH_API}/manual-dispatch`, formData, {
    params: new URLSearchParams(data.lpnIds.map((lpnId) => ["lpnIds", lpnId])),
  });

  return unwrapData<TManualDispatchResult>(response.data);
};

export const dispatchApi = {
  simulatePacking,
  manualDispatch,
};
