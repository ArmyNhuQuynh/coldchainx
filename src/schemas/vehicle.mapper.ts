import type {
  TVehicle,
  TVehicleCreateRequest,
  TVehicleFormValues,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import { VEHICLE_FORM_DEFAULTS } from "@/schemas/vehicle.schema";

export const getVehicleFormDefaultValues = (
  vehicle?: TVehicle
): TVehicleFormValues => ({
  truckPlate: vehicle?.truckPlate ?? "",
  brand: vehicle?.brand ?? null,
  standardFuelLiters: vehicle?.standardFuelLiters ?? null,
  vehicleType: vehicle?.vehicleType ?? VEHICLE_FORM_DEFAULTS.vehicleType,
  maxWeight: vehicle?.maxWeight ?? null,
  maxCbm: vehicle?.maxCbm ?? null,
  minTemp: vehicle?.minTemp ?? null,
  maxTemp: vehicle?.maxTemp ?? null,
  currentLocation: vehicle?.currentLocation ?? null,
  currentOdometer: vehicle?.currentOdometer ?? 0,
  nextMaintenanceOdometer: vehicle?.nextMaintenanceOdometer ?? null,
  status: vehicle?.status ?? VEHICLE_FORM_DEFAULTS.status,
});

export const toVehicleCreateRequest = (
  values: TVehicleFormValues
): TVehicleCreateRequest => ({
  truckPlate: values.truckPlate,
  brand: values.brand,
  standardFuelLiters: values.standardFuelLiters,
  vehicleType: values.vehicleType,
  maxWeight: values.maxWeight!,
  maxCbm: values.maxCbm!,
  minTemp: values.minTemp!,
  maxTemp: values.maxTemp!,
  currentLocation: values.currentLocation,
  currentOdometer: values.currentOdometer ?? 0,
  nextMaintenanceOdometer: values.nextMaintenanceOdometer ?? 0,
});

export const toVehicleUpdateRequest = (
  values: TVehicleFormValues
): TVehicleUpdateRequest => ({
  truckPlate: values.truckPlate,
  brand: values.brand,
  standardFuelLiters: values.standardFuelLiters,
  vehicleType: values.vehicleType,
  maxWeight: values.maxWeight,
  maxCbm: values.maxCbm,
  minTemp: values.minTemp,
  maxTemp: values.maxTemp,
  status: values.status,
});
