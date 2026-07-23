import type {
  TIotDevice,
  TIotDeviceCreateRequest,
  TIotDeviceFormValues,
  TIotDeviceUpdateRequest,
} from "@/schemas/iot-device.schema";
import { IOT_DEVICE_FORM_DEFAULTS } from "@/schemas/iot-device.schema";
import { normalizeIotDeviceStatus } from "@/types/enums/iot-device-status.enum";

export const getIotDeviceFormDefaultValues = (
  device?: TIotDevice
): TIotDeviceFormValues => ({
  deviceCode: device?.deviceCode ?? IOT_DEVICE_FORM_DEFAULTS.deviceCode,
  status:
    normalizeIotDeviceStatus(device?.status) ??
    IOT_DEVICE_FORM_DEFAULTS.status,
});

export const toIotDeviceCreateRequest = (
  values: TIotDeviceFormValues
): TIotDeviceCreateRequest => ({
  deviceCode: values.deviceCode,
});

export const toIotDeviceUpdateRequest = (
  values: TIotDeviceFormValues
): TIotDeviceUpdateRequest => ({
  deviceCode: values.deviceCode,
  status: values.status,
});
