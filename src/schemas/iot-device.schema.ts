import { z } from "zod";
import { IOT_DEVICE_STATUS } from "@/types/enums/iot-device-status.enum";

export const IotDeviceSchema = z.object({
  deviceId: z.string().uuid({ message: "ID thiết bị không hợp lệ" }),
  deviceCode: z.string({ message: "Mã thiết bị không hợp lệ" }).nullable(),
  vehicleId: z.string().uuid({ message: "ID xe không hợp lệ" }).nullable(),
  truckPlate: z.string({ message: "Biển số xe không hợp lệ" }).nullable(),
  batteryLevel: z.number({ message: "Pin thiết bị không hợp lệ" }).nullable(),
  status: z.string({ message: "Trạng thái thiết bị không hợp lệ" }).nullable(),
  lastPingTime: z.string({ message: "Thời gian ping không hợp lệ" }).nullable(),
  createdAt: z.string({ message: "Ngày tạo không hợp lệ" }).nullable(),
  isOnline: z.boolean().nullable().optional(),
});

export const IotDeviceCreateRequestSchema = z.object({
  deviceCode: z.string().trim().min(1, "Mã thiết bị không được để trống"),
});

export const IotDeviceUpdateRequestSchema = z
  .object({
    deviceCode: z.string().trim().min(1, "Mã thiết bị không được để trống").optional(),
    removeVehicle: z.boolean().optional(),
    status: z.string().trim().min(1, "Trạng thái không được để trống").optional(),
  })
  .strict();

export const IotDeviceAssignRequestSchema = z.object({
  vehicleId: z.string().uuid("ID xe không hợp lệ"),
  deviceCode: z.string().trim().min(1, "Mã thiết bị không được để trống"),
});

export const IotDeviceFormSchema = z.object({
  deviceCode: z.string().trim().min(1, "Mã thiết bị không được để trống"),
  status: z.string().trim().min(1, "Trạng thái không được để trống"),
});

export type TIotDevice = z.infer<typeof IotDeviceSchema>;
export type TIotDeviceCreateRequest = z.infer<
  typeof IotDeviceCreateRequestSchema
>;
export type TIotDeviceUpdateRequest = z.infer<
  typeof IotDeviceUpdateRequestSchema
>;
export type TIotDeviceAssignRequest = z.infer<
  typeof IotDeviceAssignRequestSchema
>;
export type TIotDeviceFormValues = z.infer<typeof IotDeviceFormSchema>;

export const IOT_DEVICE_FORM_DEFAULTS: TIotDeviceFormValues = {
  deviceCode: "",
  status: IOT_DEVICE_STATUS.AVAILABLE,
};
