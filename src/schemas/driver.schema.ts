import { z } from "zod";
import { DRIVER_STATUS } from "@/types/enums/driver-status.enum";

const nullableString = (message: string) =>
  z.string({ message }).nullable().optional();

export const DriverStatusEnum = z.union([
  z.literal(DRIVER_STATUS.AVAILABLE, { message: "Trạng thái tài xế không hợp lệ" }),
  z.literal(DRIVER_STATUS.ON_TRIP, { message: "Trạng thái tài xế không hợp lệ" }),
  z.literal(DRIVER_STATUS.OFFLINE, { message: "Trạng thái tài xế không hợp lệ" }),
  z.literal(DRIVER_STATUS.INACTIVE, { message: "Trạng thái tài xế không hợp lệ" }),
]);

export const DriverLicenseSchema = z.object({
  licenseId: z.string().uuid({ message: "ID giấy phép không hợp lệ" }),
  driverId: z.string().uuid({ message: "ID tài xế không hợp lệ" }).nullable(),
  licenseNumber: nullableString("Số giấy phép không hợp lệ"),
  licenseClass: nullableString("Hạng giấy phép không hợp lệ"),
  issueDate: z.string({ message: "Ngày cấp không hợp lệ" }).nullable(),
  expiryDate: z.string({ message: "Ngày hết hạn không hợp lệ" }).nullable(),
  documentUrl: nullableString("Tài liệu giấy phép không hợp lệ"),
  status: nullableString("Trạng thái giấy phép không hợp lệ"),
  createdAt: z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
});

export const DriverSchema = z.object({
  driverId: z.string().uuid({ message: "ID tài xế không hợp lệ" }),
  userId: z.string().uuid({ message: "ID người dùng không hợp lệ" }).nullable(),
  username: nullableString("Tên đăng nhập không hợp lệ"),
  email: nullableString("Email không hợp lệ"),
  fullName: nullableString("Họ tên không hợp lệ"),
  dateOfBirth: z.string({ message: "Ngày sinh không hợp lệ" }),
  status: DriverStatusEnum.nullable(),
  createdAt: z.string({ message: "Thời gian tạo không hợp lệ" }).nullable(),
  driverLicenses: z.array(DriverLicenseSchema).nullable(),
});

export const DriverCreateRequestSchema = z.object({
  dateOfBirth: z.string({ message: "Ngày sinh không hợp lệ" }),
  status: DriverStatusEnum.nullable().optional(),
}).strict();

export const DriverUpdateRequestSchema = z.object({
  dateOfBirth: nullableString("Ngày sinh không hợp lệ"),
  status: DriverStatusEnum.nullable().optional(),
}).strict();

export type TDriverLicense = z.infer<typeof DriverLicenseSchema>;
export type TDriver = z.infer<typeof DriverSchema>;
export type TDriverCreateRequest = z.infer<typeof DriverCreateRequestSchema>;
export type TDriverUpdateRequest = z.infer<typeof DriverUpdateRequestSchema>;
