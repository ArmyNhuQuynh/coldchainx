import type {
  TIotDevice,
  TIotDeviceCreateRequest,
  TIotDeviceFormValues,
  TIotDeviceUpdateRequest,
} from "@/schemas/iot-device.schema";
import { IOT_DEVICE_FORM_DEFAULTS } from "@/schemas/iot-device.schema";

export const getIotDeviceFormDefaultValues = (
  device?: TIotDevice
): TIotDeviceFormValues => ({
  deviceCode: device?.deviceCode ?? IOT_DEVICE_FORM_DEFAULTS.deviceCode,
  vehicleId: device?.vehicleId ?? IOT_DEVICE_FORM_DEFAULTS.vehicleId,
  status: device?.status ?? IOT_DEVICE_FORM_DEFAULTS.status,
});

export const toIotDeviceCreateRequest = (
  values: TIotDeviceFormValues
): TIotDeviceCreateRequest => ({
  deviceCode: values.deviceCode,
  vehicleId: values.vehicleId || undefined,
});

export const toIotDeviceUpdateRequest = (
  values: TIotDeviceFormValues
): TIotDeviceUpdateRequest => ({
  deviceCode: values.deviceCode,
  vehicleId: values.vehicleId || undefined,
  removeVehicle: !values.vehicleId,
  status: values.status,
});
