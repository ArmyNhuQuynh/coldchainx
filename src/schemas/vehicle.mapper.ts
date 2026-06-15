import type {
  TVehicle,
  TVehicleCreateRequest,
  TVehicleFormValues,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import { VEHICLE_STATUS } from "@/types/enums/vehicle-status.enum";

const appendFormValue = (
  formData: FormData,
  key: string,
  value: File | string | number | null | undefined
) => {
  if (value === null || value === undefined) {
    return;
  }

  formData.append(key, value instanceof File ? value : String(value));
};

export const getVehicleFormDefaultValues = (
  vehicle?: TVehicle
): TVehicleFormValues => ({
  truckPlate: vehicle?.truckPlate ?? null,
  brand: vehicle?.brand ?? null,
  manufactureYear: vehicle?.manufactureYear ?? null,
  chassisNumber: vehicle?.chassisNumber ?? null,
  engineNumber: vehicle?.engineNumber ?? null,
  standardFuelLiters: vehicle?.standardFuelLiters ?? null,
  vehicleType: vehicle?.vehicleType ?? null,
  maxWeight: vehicle?.maxWeight ?? null,
  maxCbm: vehicle?.maxCbm ?? null,
  minTemp: vehicle?.minTemp ?? null,
  maxTemp: vehicle?.maxTemp ?? null,
  status: vehicle?.status ?? VEHICLE_STATUS.ACTIVE,
  vehicleImage: null,
});

export const toVehicleCreateRequest = (
  values: TVehicleFormValues
): TVehicleCreateRequest => ({
  truckPlate: values.truckPlate,
  brand: values.brand,
  manufactureYear: values.manufactureYear,
  chassisNumber: values.chassisNumber,
  engineNumber: values.engineNumber,
  standardFuelLiters: values.standardFuelLiters,
  vehicleType: values.vehicleType,
  maxWeight: values.maxWeight!,
  maxCbm: values.maxCbm!,
  minTemp: values.minTemp!,
  maxTemp: values.maxTemp!,
  status: values.status,
  ...(values.vehicleImage ? { vehicleImage: values.vehicleImage } : {}),
});

export const toVehicleUpdateRequest = (
  values: TVehicleFormValues
): TVehicleUpdateRequest => ({
  truckPlate: values.truckPlate,
  brand: values.brand,
  manufactureYear: values.manufactureYear,
  chassisNumber: values.chassisNumber,
  engineNumber: values.engineNumber,
  standardFuelLiters: values.standardFuelLiters,
  vehicleType: values.vehicleType,
  maxWeight: values.maxWeight,
  maxCbm: values.maxCbm,
  minTemp: values.minTemp,
  maxTemp: values.maxTemp,
  status: values.status,
});

export const toVehicleCreateFormData = (data: TVehicleCreateRequest) => {
  const formData = new FormData();

  appendFormValue(formData, "TruckPlate", data.truckPlate);
  appendFormValue(formData, "Brand", data.brand);
  appendFormValue(formData, "ManufactureYear", data.manufactureYear);
  appendFormValue(formData, "ChassisNumber", data.chassisNumber);
  appendFormValue(formData, "EngineNumber", data.engineNumber);
  appendFormValue(formData, "StandardFuelLiters", data.standardFuelLiters);
  appendFormValue(formData, "VehicleType", data.vehicleType);
  appendFormValue(formData, "MaxWeight", data.maxWeight);
  appendFormValue(formData, "MaxCbm", data.maxCbm);
  appendFormValue(formData, "MinTemp", data.minTemp);
  appendFormValue(formData, "MaxTemp", data.maxTemp);
  appendFormValue(formData, "Status", data.status);
  appendFormValue(formData, "VehicleImage", data.vehicleImage);

  return formData;
};
