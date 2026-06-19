import { z } from "zod";
import { VEHICLE_STATUS } from "@/types/enums/vehicle-status.enum";
import { VEHICLE_TYPE } from "@/types/enums/vehicle-type.enum";

const nullableString = (message: string) =>
  z.string({ message }).nullable().optional();

const nullableNumber = (message: string) =>
  z.number({ message }).nullable().optional();

export const VehicleDocumentSchema = z.object({
  docId: z.string().uuid({ message: "ID giấy tờ xe không hợp lệ" }),
  vehicleId: z
    .string()
    .uuid({ message: "ID xe không hợp lệ" })
    .nullable(),
  documentType: z.string({ message: "Loại giấy tờ không hợp lệ" }),
  documentNumber: z.string({ message: "Số giấy tờ không hợp lệ" }),
  issuer: z.string({ message: "Nơi cấp không hợp lệ" }).nullable(),
  issueDate: z.string({ message: "Ngày cấp không hợp lệ" }),
  expireDate: z.string({ message: "Ngày hết hạn không hợp lệ" }).nullable(),
  status: z.string({ message: "Trạng thái giấy tờ không hợp lệ" }).nullable(),
});

export const InlineVehicleDocumentRequestSchema = z.object({
  documentNumber: z.string().min(1, "Số giấy tờ không được để trống"),
  issuer: nullableString("Nơi cấp không hợp lệ"),
  issueDate: z.string().min(1, "Ngày cấp không được để trống"),
  expireDate: nullableString("Ngày hết hạn không hợp lệ"),
});

export const VehicleSchema = z.object({
  vehicleId: z.string().uuid({ message: "ID xe không hợp lệ" }),
  driverId: z
    .string()
    .uuid({ message: "ID tài xế không hợp lệ" })
    .nullable(),
  truckPlate: z.string({ message: "Biển số xe không hợp lệ" }),
  brand: z.string({ message: "Thương hiệu xe không hợp lệ" }).nullable(),
  standardFuelLiters: z
    .number({ message: "Định mức nhiên liệu không hợp lệ" })
    .nullable(),
  vehicleType: z.string({ message: "Loại xe không hợp lệ" }),
  maxWeight: z.number({ message: "Tải trọng tối đa không hợp lệ" }),
  maxCbm: z.number({ message: "Thể tích tối đa không hợp lệ" }),
  minTemp: z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
  maxTemp: z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
  currentLocation: z.string({ message: "Vị trí hiện tại không hợp lệ" }).nullable(),
  currentOdometer: z.number({ message: "Số km hiện tại không hợp lệ" }),
  nextMaintenanceOdometer: z.number({
    message: "Mốc bảo dưỡng tiếp theo không hợp lệ",
  }),
  status: z.string({ message: "Trạng thái xe không hợp lệ" }).nullable(),
  documents: z.array(VehicleDocumentSchema),
});

export const VehicleCreateRequestSchema = z
  .object({
    truckPlate: z.string().trim().min(1, "Biển số xe không được để trống"),
    driverName: nullableString("Tên tài xế không hợp lệ"),
    driverId: z.string().uuid("ID tài xế không hợp lệ").nullable().optional(),
    brand: nullableString("Thương hiệu xe không hợp lệ"),
    standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
    vehicleType: z.string().trim().min(1, "Loại xe không được để trống"),
    maxWeight: z.number().positive("Tải trọng tối đa phải lớn hơn 0"),
    maxCbm: z.number().positive("Thể tích tối đa phải lớn hơn 0"),
    minTemp: z.number({ message: "Nhiệt độ tối thiểu không hợp lệ" }),
    maxTemp: z.number({ message: "Nhiệt độ tối đa không hợp lệ" }),
    currentLocation: nullableString("Vị trí hiện tại không hợp lệ"),
    currentOdometer: z.number().nonnegative("Số km hiện tại không hợp lệ"),
    nextMaintenanceOdometer: z
      .number()
      .nonnegative("Mốc bảo dưỡng tiếp theo không hợp lệ"),
    registration: InlineVehicleDocumentRequestSchema.nullable().optional(),
    insurance: InlineVehicleDocumentRequestSchema.nullable().optional(),
    cityPermit: InlineVehicleDocumentRequestSchema.nullable().optional(),
    foodSafety: InlineVehicleDocumentRequestSchema.nullable().optional(),
  })
  .refine((data) => data.minTemp <= data.maxTemp, {
    message: "Nhiệt độ tối thiểu không được lớn hơn nhiệt độ tối đa",
    path: ["minTemp"],
  });

export const VehicleUpdateRequestSchema = z
  .object({
    truckPlate: nullableString("Biển số xe không hợp lệ"),
    brand: nullableString("Thương hiệu xe không hợp lệ"),
    standardFuelLiters: nullableNumber("Định mức nhiên liệu không hợp lệ"),
    vehicleType: nullableString("Loại xe không hợp lệ"),
    maxWeight: nullableNumber("Tải trọng tối đa không hợp lệ"),
    maxCbm: nullableNumber("Thể tích tối đa không hợp lệ"),
    minTemp: nullableNumber("Nhiệt độ tối thiểu không hợp lệ"),
    maxTemp: nullableNumber("Nhiệt độ tối đa không hợp lệ"),
    status: nullableString("Trạng thái xe không hợp lệ"),
  })
  .strict();

const requiredFormText = (message: string) =>
  z.string({ message }).trim().min(1, message);

const nullableFormText = (message: string) =>
  z
    .string({ message })
    .trim()
    .transform((value) => (value.length ? value : null))
    .nullable();

const optionalFormNumber = (message: string) =>
  z.number({ message }).finite({ message }).nullable();

const requiredFormNumber = (message: string) =>
  optionalFormNumber(message).refine((value) => value !== null, { message });

const positiveFormNumber = (message: string) =>
  requiredFormNumber(message).refine(
    (value) => value === null || value > 0,
    { message }
  );

export const VehicleFormSchema = z
  .object({
    truckPlate: requiredFormText("Biển số xe không được để trống"),
    brand: nullableFormText("Thương hiệu xe không hợp lệ"),
    standardFuelLiters: optionalFormNumber(
      "Định mức nhiên liệu không hợp lệ"
    ).refine((value) => value === null || value > 0, {
      message: "Định mức nhiên liệu phải lớn hơn 0",
    }),
    vehicleType: requiredFormText("Loại xe không được để trống"),
    maxWeight: positiveFormNumber("Tải trọng tối đa phải lớn hơn 0"),
    maxCbm: positiveFormNumber("Thể tích tối đa phải lớn hơn 0"),
    minTemp: requiredFormNumber("Nhiệt độ tối thiểu không hợp lệ"),
    maxTemp: requiredFormNumber("Nhiệt độ tối đa không hợp lệ"),
    currentLocation: nullableFormText("Vị trí hiện tại không hợp lệ"),
    currentOdometer: optionalFormNumber("Số km hiện tại không hợp lệ").refine(
      (value) => value === null || value >= 0,
      { message: "Số km hiện tại không được âm" }
    ),
    nextMaintenanceOdometer: optionalFormNumber(
      "Mốc bảo dưỡng tiếp theo không hợp lệ"
    ).refine((value) => value === null || value >= 0, {
      message: "Mốc bảo dưỡng không được âm",
    }),
    status: z.string().nullable(),
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

export type TVehicleDocument = z.infer<typeof VehicleDocumentSchema>;
export type TInlineVehicleDocumentRequest = z.infer<
  typeof InlineVehicleDocumentRequestSchema
>;
export type TVehicle = z.infer<typeof VehicleSchema>;
export type TVehicleCreateRequest = z.infer<typeof VehicleCreateRequestSchema>;
export type TVehicleUpdateRequest = z.infer<typeof VehicleUpdateRequestSchema>;

export type TVehicleFormValues = {
  truckPlate: string;
  brand: string | null;
  standardFuelLiters: number | null;
  vehicleType: string;
  maxWeight: number | null;
  maxCbm: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  currentLocation: string | null;
  currentOdometer: number | null;
  nextMaintenanceOdometer: number | null;
  status: string | null;
};

export const VEHICLE_FORM_DEFAULTS = {
  vehicleType: VEHICLE_TYPE.REFRIGERATED,
  status: VEHICLE_STATUS.ACTIVE,
} as const;
