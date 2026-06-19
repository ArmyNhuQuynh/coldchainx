import { z } from "zod";

const nullableString = (message: string) =>
  z.string({ message }).nullable().optional();

export const DriverLicenseSchema = z.object({
  licenseId: z.string().uuid({ message: "ID giấy phép không hợp lệ" }),
  driverId: z
    .string()
    .uuid({ message: "ID tài xế không hợp lệ" })
    .nullable(),
  licenseNumber: z.string({ message: "Số giấy phép không hợp lệ" }),
  licenseClass: z.string({ message: "Hạng giấy phép không hợp lệ" }),
  issueDate: z.string({ message: "Ngày cấp không hợp lệ" }),
  expiryDate: z.string({ message: "Ngày hết hạn không hợp lệ" }),
  status: z.string({ message: "Trạng thái giấy phép không hợp lệ" }).nullable(),
});

export const DriverSchema = z.object({
  driverId: z.string().uuid({ message: "ID tài xế không hợp lệ" }),
  userId: z
    .string()
    .uuid({ message: "ID người dùng không hợp lệ" })
    .nullable(),
  fullName: z.string({ message: "Họ tên không hợp lệ" }),
  email: z.string({ message: "Email không hợp lệ" }).nullable(),
  identityNumber: z.string({ message: "Số CCCD không hợp lệ" }),
  phoneNumber: z.string({ message: "Số điện thoại không hợp lệ" }),
  dateOfBirth: z.string({ message: "Ngày sinh không hợp lệ" }),
  joinDate: z.string({ message: "Ngày vào làm không hợp lệ" }),
  status: z.string({ message: "Trạng thái tài xế không hợp lệ" }).nullable(),
  licenses: z.array(DriverLicenseSchema),
});

export const InlineDriverLicenseRequestSchema = z.object({
  licenseNumber: z.string().min(1, "Số GPLX không được để trống"),
  licenseClass: z.string().min(1, "Hạng GPLX không được để trống"),
  issueDate: z.string().min(1, "Ngày cấp không được để trống"),
  expiryDate: z.string().min(1, "Ngày hết hạn không được để trống"),
});

export const DriverCreateRequestSchema = z
  .object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    identityNumber: z.string().min(1, "Số CCCD không được để trống"),
    phoneNumber: z.string().min(1, "Số điện thoại không được để trống"),
    dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
    joinDate: z.string().min(1, "Ngày vào làm không được để trống"),
    license: InlineDriverLicenseRequestSchema.nullable().optional(),
  })
  .strict();

export const DriverUpdateRequestSchema = z
  .object({
    fullName: nullableString("Họ tên không hợp lệ"),
    email: nullableString("Email không hợp lệ"),
    identityNumber: nullableString("Số CCCD không hợp lệ"),
    phoneNumber: nullableString("Số điện thoại không hợp lệ"),
    dateOfBirth: nullableString("Ngày sinh không hợp lệ"),
    joinDate: nullableString("Ngày vào làm không hợp lệ"),
    status: nullableString("Trạng thái không hợp lệ"),
  })
  .strict();

export type TDriverLicense = z.infer<typeof DriverLicenseSchema>;
export type TDriver = z.infer<typeof DriverSchema>;
export type TDriverCreateRequest = z.infer<typeof DriverCreateRequestSchema>;
export type TDriverUpdateRequest = z.infer<typeof DriverUpdateRequestSchema>;
