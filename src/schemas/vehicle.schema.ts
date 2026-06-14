import { z } from "zod";
import { VEHICLE_STATUS } from "../types/enums/vehicle-status.enum";
import { VEHICLE_TYPE } from "../types/enums/vehicle-type.enum";

// ===== HELPERS =====
const nullableString = (message: string) =>
  z.string({ message }).nullable().optional();

const nullableNumber = (message: string) =>
  z.number({ message }).nullable().optional();

const nullableInteger = (message: string) =>
  z.number({ message }).int().nullable().optional();

// ===== ENUM =====
export const VehicleStatusEnum = z.union([
  z.literal(VEHICLE_STATUS.ACTIVE,            { message: "Trạng thái xe không hợp lệ" }),
  z.literal(VEHICLE_STATUS.INACTIVE,          { message: "Trạng thái xe không hợp lệ" }),
  z.literal(VEHICLE_STATUS.UNDER_MAINTENANCE, { message: "Trạng thái xe không hợp lệ" }),
  z.literal(VEHICLE_STATUS.ON_TRIP,           { message: "Trạng thái xe không hợp lệ" }),
]);

export const VehicleTypeEnum = z.union([
  z.literal(VEHICLE_TYPE.TRUCK,        { message: "Loại xe không hợp lệ" }),
  z.literal(VEHICLE_TYPE.VAN,          { message: "Loại xe không hợp lệ" }),
  z.literal(VEHICLE_TYPE.REFRIGERATED, { message: "Loại xe không hợp lệ" }),
  z.literal(VEHICLE_TYPE.FLATBED,      { message: "Loại xe không hợp lệ" }),
  z.literal(VEHICLE_TYPE.CONTAINER,    { message: "Loại xe không hợp lệ" }),
  z.literal(VEHICLE_TYPE.TANKER,       { message: "Loại xe không hợp lệ" }),
]);

// ===== VEHICLE SCHEMA =====
export const VehicleSchema = z.object({
  vehicleId:          z.string().uuid({ message: "ID xe tải không hợp lệ" }),
  truckPlate:         z.string({ message: "Biển số xe không hợp lệ" }).nullable(),
  brand:              z.string({ message: "Thương hiệu xe không hợp lệ" }).nullable(),
  manufactureYear:    z.number({ message: "Năm sản xuất không hợp lệ" }).int().nullable(),
  chassisNumber:      z.string({ message: "Số khung không hợp lệ" }).nullable(),
  engineNumber:       z.string({ message: "Số máy không hợp lệ" }).nullable(),
  standardFuelLiters: z.number({ message: "Định mức nhiên liệu không hợp lệ" }).nullable(),
  vehicleType:        VehicleTypeEnum.nullable(),
  maxWeight:          z.number({ message: "Tải trọng tối đa không hợp lệ" }),
  maxCbm:             z.number({ message: "Thể tích tối đa không hợp lệ" }),
  minTemp:            z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
  maxTemp:            z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
  status:             VehicleStatusEnum.nullable(),
  createdAt:          z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
});

// ===== CREATE REQUEST =====
export const VehicleCreateRequestSchema = z.object({
  truckPlate:         nullableString("Biển số xe không hợp lệ"),
  brand:              nullableString("Thương hiệu xe không hợp lệ"),
  manufactureYear:    nullableInteger("Năm sản xuất không hợp lệ"),
  chassisNumber:      nullableString("Số khung không hợp lệ"),
  engineNumber:       nullableString("Số máy không hợp lệ"),
  standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
  vehicleType:        VehicleTypeEnum.nullable().optional(),
  maxWeight:          z.number({ message: "Tải trọng tối đa không hợp lệ" }),
  maxCbm:             z.number({ message: "Thể tích tối đa không hợp lệ" }),
  minTemp:            z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
  maxTemp:            z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
  status:             VehicleStatusEnum.nullable().optional(),
}).strict();

// ===== UPDATE REQUEST =====
export const VehicleUpdateRequestSchema = z.object({
  truckPlate:         nullableString("Biển số xe không hợp lệ"),
  brand:              nullableString("Thương hiệu xe không hợp lệ"),
  manufactureYear:    nullableInteger("Năm sản xuất không hợp lệ"),
  chassisNumber:      nullableString("Số khung không hợp lệ"),
  engineNumber:       nullableString("Số máy không hợp lệ"),
  standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
  vehicleType:        VehicleTypeEnum.nullable().optional(),
  maxWeight:          nullableNumber("Tải trọng tối đa không hợp lệ"),
  maxCbm:             nullableNumber("Thể tích tối đa không hợp lệ"),
  minTemp:            nullableNumber("Nhiệt độ tối thiểu không hợp lệ"),
  maxTemp:            nullableNumber("Nhiệt độ tối đa không hợp lệ"),
  status:             VehicleStatusEnum.nullable().optional(),
}).strict();

// ===== FORM =====
const nullableFormText = (message: string) =>
  z
    .string({ message })
    .trim()
    .transform((value) => (value.length ? value : null))
    .nullable();

const optionalFormNumber = (message: string) =>
  z.number({ message }).finite({ message }).nullable();

const requiredFormNumber = (message: string) =>
  z
    .number({ message })
    .finite({ message })
    .nullable()
    .refine((value) => value !== null, { message });

const positiveFormNumber = (message: string) =>
  requiredFormNumber(message).refine(
    (value) => value === null || value > 0,
    { message }
  );

const currentYear = new Date().getFullYear();

export const VehicleFormSchema = z
  .object({
    truckPlate: nullableFormText("Biển số xe không hợp lệ"),
    brand: nullableFormText("Thương hiệu xe không hợp lệ"),
    manufactureYear: optionalFormNumber("Năm sản xuất không hợp lệ").refine(
      (value) =>
        value === null ||
        (Number.isInteger(value) && value >= 1900 && value <= currentYear + 1),
      { message: "Năm sản xuất không hợp lệ" }
    ),
    chassisNumber: nullableFormText("Số khung không hợp lệ"),
    engineNumber: nullableFormText("Số máy không hợp lệ"),
    standardFuelLiters: optionalFormNumber(
      "Định mức nhiên liệu không hợp lệ"
    ).refine((value) => value === null || value >= 0, {
      message: "Định mức nhiên liệu không hợp lệ",
    }),
    vehicleType: VehicleTypeEnum.nullable(),
    maxWeight: positiveFormNumber("Tải trọng tối đa phải lớn hơn 0"),
    maxCbm: positiveFormNumber("Thể tích tối đa phải lớn hơn 0"),
    minTemp: requiredFormNumber("Nhiệt độ tối thiểu không hợp lệ"),
    maxTemp: requiredFormNumber("Nhiệt độ tối đa không hợp lệ"),
    status: VehicleStatusEnum.nullable(),
  })
  .refine(
    (data) =>
      data.minTemp === null ||
      data.maxTemp === null ||
      data.minTemp <= data.maxTemp,
    {
      message: "Nhiệt độ tối thiểu không được lớn hơn nhiệt độ tối đa",
      path: ["minTemp"],
    }
  );

// ===== EXPORT TYPES =====
export type TVehicle              = z.infer<typeof VehicleSchema>;
export type TVehicleCreateRequest = z.infer<typeof VehicleCreateRequestSchema>;
export type TVehicleUpdateRequest = z.infer<typeof VehicleUpdateRequestSchema>;
export type TVehicleFormValues = {
  truckPlate: string | null;
  brand: string | null;
  manufactureYear: number | null;
  chassisNumber: string | null;
  engineNumber: string | null;
  standardFuelLiters: number | null;
  vehicleType: TVehicle["vehicleType"];
  maxWeight: number | null;
  maxCbm: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  status: TVehicle["status"];
};
