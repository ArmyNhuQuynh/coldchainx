import { z } from "zod";
import { DRIVER_STATUS } from "@/types/enums/driver-status.enum";

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

export const DriverLicenseRequestSchema = z
  .object({
    licenseNumber: z.string().min(1, "Số GPLX không được để trống"),
    licenseClass: z.string().min(1, "Hạng GPLX không được để trống"),
    issueDate: z.string().min(1, "Ngày cấp không được để trống"),
    expiryDate: z.string().min(1, "Ngày hết hạn không được để trống"),
  })
  .strict()
  .superRefine((values, context) => {
    if (values.issueDate && values.expiryDate && values.expiryDate <= values.issueDate) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Ngày hết hạn phải sau ngày cấp",
      });
    }
  });

const requiredFormText = (message: string) =>
  z.string({ message }).trim().min(1, message);

export const DriverFormSchema = z
  .object({
    fullName: requiredFormText("Họ tên không được để trống"),
    email: z.string({ message: "Email không hợp lệ" }).trim().email("Email không hợp lệ"),
    identityNumber: requiredFormText("Số CCCD không được để trống"),
    phoneNumber: requiredFormText("Số điện thoại không được để trống"),
    dateOfBirth: requiredFormText("Ngày sinh không được để trống"),
    joinDate: requiredFormText("Ngày vào làm không được để trống"),
    status: z.string().nullable(),
    includeLicense: z.boolean(),
    licenseNumber: z.string().optional(),
    licenseClass: z.string().optional(),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (!values.includeLicense) return;

    const requiredLicenseFields = [
      ["licenseNumber", "Số GPLX không được để trống"],
      ["licenseClass", "Hạng GPLX không được để trống"],
      ["issueDate", "Ngày cấp không được để trống"],
      ["expiryDate", "Ngày hết hạn không được để trống"],
    ] as const;

    requiredLicenseFields.forEach(([fieldName, message]) => {
      if (!values[fieldName]?.trim()) {
        context.addIssue({
          code: "custom",
          path: [fieldName],
          message,
        });
      }
    });

    if (
      values.issueDate &&
      values.expiryDate &&
      values.expiryDate <= values.issueDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Ngày hết hạn phải sau ngày cấp",
      });
    }
  });

export const DriverImportResultSchema = z.object({
  inserted: z.number(),
  updated: z.number(),
  skipped: z.number(),
  errors: z.array(z.string()),
});

export type TDriverLicense = z.infer<typeof DriverLicenseSchema>;
export type TDriver = z.infer<typeof DriverSchema>;
export type TDriverCreateRequest = z.infer<typeof DriverCreateRequestSchema>;
export type TDriverUpdateRequest = z.infer<typeof DriverUpdateRequestSchema>;
export type TDriverLicenseRequest = z.infer<typeof DriverLicenseRequestSchema>;
export type TDriverImportResult = z.infer<typeof DriverImportResultSchema>;

export type TDriverFormValues = z.infer<typeof DriverFormSchema>;

export const DRIVER_FORM_DEFAULTS = {
  status: DRIVER_STATUS.ACTIVE,
  includeLicense: true,
} as const;
