import { z } from "zod";

const nullableString = (message: string) =>
  z.string({ message }).nullable().optional();

const nullableNumber = (message: string) =>
  z.number({ message }).nullable().optional();

const nullableInteger = (message: string) =>
  z.number({ message }).int().nullable().optional();

export const VehicleSchema = z.object({
  vehicleId: z.string().uuid({ message: "ID xe tải không hợp lệ" }),
  truckPlate: z.string({ message: "Biển số xe không hợp lệ" }).nullable(),
  brand: z.string({ message: "Thương hiệu xe không hợp lệ" }).nullable(),
  manufactureYear: z
    .number({ message: "Năm sản xuất không hợp lệ" })
    .int()
    .nullable(),
  chassisNumber: z.string({ message: "Số khung không hợp lệ" }).nullable(),
  engineNumber: z.string({ message: "Số máy không hợp lệ" }).nullable(),
  standardFuelLiters: z
    .number({ message: "Định mức nhiên liệu không hợp lệ" })
    .nullable(),
  vehicleType: z.string({ message: "Loại xe không hợp lệ" }).nullable(),
  maxWeight: z.number({ message: "Tải trọng tối đa không hợp lệ" }),
  maxCbm: z.number({ message: "Thể tích tối đa không hợp lệ" }),
  minTemp: z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
  maxTemp: z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
  status: z.string({ message: "Trạng thái xe không hợp lệ" }).nullable(),
  createdAt: z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
});

export const VehicleCreateRequestSchema = z
  .object({
    truckPlate: nullableString("Biển số xe không hợp lệ"),
    brand: nullableString("Thương hiệu xe không hợp lệ"),
    manufactureYear: nullableInteger("Năm sản xuất không hợp lệ"),
    chassisNumber: nullableString("Số khung không hợp lệ"),
    engineNumber: nullableString("Số máy không hợp lệ"),
    standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
    vehicleType: nullableString("Loại xe không hợp lệ"),
    maxWeight: z.number({ message: "Tải trọng tối đa không hợp lệ" }),
    maxCbm: z.number({ message: "Thể tích tối đa không hợp lệ" }),
    minTemp: z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
    maxTemp: z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
    status: nullableString("Trạng thái xe không hợp lệ"),
  })
  .strict();

export const VehicleUpdateRequestSchema = z
  .object({
    truckPlate: nullableString("Biển số xe không hợp lệ"),
    brand: nullableString("Thương hiệu xe không hợp lệ"),
    manufactureYear: nullableInteger("Năm sản xuất không hợp lệ"),
    chassisNumber: nullableString("Số khung không hợp lệ"),
    engineNumber: nullableString("Số máy không hợp lệ"),
    standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
    vehicleType: nullableString("Loại xe không hợp lệ"),
    maxWeight: nullableNumber("Tải trọng tối đa không hợp lệ"),
    maxCbm: nullableNumber("Thể tích tối đa không hợp lệ"),
    minTemp: nullableNumber("Nhiệt độ tối thiểu không hợp lệ"),
    maxTemp: nullableNumber("Nhiệt độ tối đa không hợp lệ"),
    status: nullableString("Trạng thái xe không hợp lệ"),
  })
  .strict();

export type TVehicle = z.infer<typeof VehicleSchema>;
export type TVehicleCreateRequest = z.infer<typeof VehicleCreateRequestSchema>;
export type TVehicleUpdateRequest = z.infer<typeof VehicleUpdateRequestSchema>;
