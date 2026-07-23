import { z } from "zod";
import { DRIVER_STATUS } from "@/types/enums/driver-status.enum";

const VIETNAMESE_PHONE_PATTERN = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;
const IDENTITY_NUMBER_PATTERN = /^\d{12}$/;
const PERSON_NAME_PATTERN = /^[\p{L}]+(?:[\s'.-][\p{L}]+)*$/u;
const LICENSE_NUMBER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9./-]{3,29}$/;
const LICENSE_CLASS_PATTERN = /^[A-Za-z0-9]{1,5}$/;
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidDateInput = (value: string) => {
  if (!DATE_INPUT_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && toDateInputValue(parsed) === value;
};

const todayInputValue = () => toDateInputValue(new Date());

const yearsAgoInputValue = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return toDateInputValue(date);
};

const requiredName = z
  .string({ message: "Họ tên không hợp lệ" })
  .trim()
  .min(2, "Họ tên phải có ít nhất 2 ký tự")
  .max(100, "Họ tên không được vượt quá 100 ký tự")
  .regex(PERSON_NAME_PATTERN, "Họ tên chỉ được chứa chữ cái và dấu phân cách hợp lệ");

const requiredEmail = z
  .string({ message: "Email không hợp lệ" })
  .trim()
  .min(1, "Email không được để trống")
  .max(254, "Email không được vượt quá 254 ký tự")
  .email("Email không đúng định dạng, ví dụ: driver@example.com");

const requiredIdentityNumber = z
  .string({ message: "Số CCCD không hợp lệ" })
  .trim()
  .regex(IDENTITY_NUMBER_PATTERN, "CCCD phải gồm đúng 12 chữ số");

const requiredPhoneNumber = z
  .string({ message: "Số điện thoại không hợp lệ" })
  .trim()
  .regex(
    VIETNAMESE_PHONE_PATTERN,
    "Số điện thoại phải là số Việt Nam hợp lệ, bắt đầu bằng 0 hoặc +84"
  );

const requiredDate = (emptyMessage: string) =>
  z
    .string({ message: emptyMessage })
    .trim()
    .min(1, emptyMessage)
    .refine((value) => !value || isValidDateInput(value), "Ngày không hợp lệ");

const licenseNumberSchema = z
  .string({ message: "Số GPLX không hợp lệ" })
  .trim()
  .min(1, "Số GPLX không được để trống")
  .regex(
    LICENSE_NUMBER_PATTERN,
    "Số GPLX phải có 4-30 ký tự, chỉ gồm chữ, số, dấu chấm, gạch chéo hoặc gạch nối"
  );

const licenseClassSchema = z
  .string({ message: "Hạng GPLX không hợp lệ" })
  .trim()
  .min(1, "Hạng GPLX không được để trống")
  .regex(LICENSE_CLASS_PATTERN, "Hạng GPLX chỉ gồm 1-5 chữ hoặc số, ví dụ B2, C, FC");

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
  licenseNumber: licenseNumberSchema,
  licenseClass: licenseClassSchema,
  issueDate: requiredDate("Ngày cấp không được để trống"),
  expiryDate: requiredDate("Ngày hết hạn không được để trống"),
}).superRefine((values, context) => {
  if (isValidDateInput(values.issueDate) && values.issueDate > todayInputValue()) {
    context.addIssue({
      code: "custom",
      path: ["issueDate"],
      message: "Ngày cấp không được nằm trong tương lai",
    });
  }

  if (
    isValidDateInput(values.issueDate) &&
    isValidDateInput(values.expiryDate) &&
    values.expiryDate <= values.issueDate
  ) {
    context.addIssue({
      code: "custom",
      path: ["expiryDate"],
      message: "Ngày hết hạn phải sau ngày cấp",
    });
  }
});

export const DriverCreateRequestSchema = z
  .object({
    fullName: requiredName,
    email: requiredEmail,
    identityNumber: requiredIdentityNumber,
    phoneNumber: requiredPhoneNumber,
    dateOfBirth: requiredDate("Ngày sinh không được để trống"),
    joinDate: requiredDate("Ngày vào làm không được để trống"),
    license: InlineDriverLicenseRequestSchema.nullable().optional(),
  })
  .strict()
  .superRefine((values, context) => {
    validateDriverDates(values, context);
  });

export const DriverUpdateRequestSchema = z
  .object({
    fullName: requiredName.nullable().optional(),
    email: requiredEmail.nullable().optional(),
    identityNumber: requiredIdentityNumber.nullable().optional(),
    phoneNumber: requiredPhoneNumber.nullable().optional(),
    dateOfBirth: requiredDate("Ngày sinh không được để trống").nullable().optional(),
    joinDate: requiredDate("Ngày vào làm không được để trống").nullable().optional(),
    status: z.string({ message: "Trạng thái không hợp lệ" }).nullable().optional(),
  })
  .strict();

export const DriverLicenseRequestSchema = z
  .object({
    licenseNumber: licenseNumberSchema,
    licenseClass: licenseClassSchema,
    issueDate: requiredDate("Ngày cấp không được để trống"),
    expiryDate: requiredDate("Ngày hết hạn không được để trống"),
  })
  .strict()
  .superRefine((values, context) => {
    if (isValidDateInput(values.issueDate) && values.issueDate > todayInputValue()) {
      context.addIssue({
        code: "custom",
        path: ["issueDate"],
        message: "Ngày cấp không được nằm trong tương lai",
      });
    }

    if (
      isValidDateInput(values.issueDate) &&
      isValidDateInput(values.expiryDate) &&
      values.expiryDate <= values.issueDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Ngày hết hạn phải sau ngày cấp",
      });
    }
  });

export const DriverFormSchema = z
  .object({
    fullName: requiredName,
    email: requiredEmail,
    identityNumber: requiredIdentityNumber,
    phoneNumber: requiredPhoneNumber,
    dateOfBirth: requiredDate("Ngày sinh không được để trống"),
    joinDate: requiredDate("Ngày vào làm không được để trống"),
    status: z.string().nullable(),
    includeLicense: z.boolean(),
    licenseNumber: z.string().trim().optional(),
    licenseClass: z.string().trim().optional(),
    issueDate: z.string().trim().optional(),
    expiryDate: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    validateDriverDates(values, context);

    if (!values.includeLicense) return;

    const licenseResult = InlineDriverLicenseRequestSchema.safeParse({
      licenseNumber: values.licenseNumber,
      licenseClass: values.licenseClass,
      issueDate: values.issueDate,
      expiryDate: values.expiryDate,
    });

    if (!licenseResult.success) {
      licenseResult.error.issues.forEach((issue) => {
        context.addIssue({
          code: "custom",
          path: issue.path,
          message: issue.message,
        });
      });
    }
  });

function validateDriverDates(
  values: { dateOfBirth?: string | null; joinDate?: string | null },
  context: z.RefinementCtx
) {
  if (
    !values.dateOfBirth ||
    !values.joinDate ||
    !isValidDateInput(values.dateOfBirth) ||
    !isValidDateInput(values.joinDate)
  ) {
    return;
  }

  if (values.dateOfBirth > yearsAgoInputValue(18)) {
    context.addIssue({
      code: "custom",
      path: ["dateOfBirth"],
      message: "Tài xế phải đủ 18 tuổi",
    });
  }

  if (values.dateOfBirth < yearsAgoInputValue(70)) {
    context.addIssue({
      code: "custom",
      path: ["dateOfBirth"],
      message: "Ngày sinh không hợp lệ, tuổi tài xế không được vượt quá 70",
    });
  }

  if (values.joinDate > todayInputValue()) {
    context.addIssue({
      code: "custom",
      path: ["joinDate"],
      message: "Ngày vào làm không được nằm trong tương lai",
    });
  }

  const eighteenthBirthday = new Date(`${values.dateOfBirth}T00:00:00`);
  eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + 18);
  if (values.joinDate < toDateInputValue(eighteenthBirthday)) {
    context.addIssue({
      code: "custom",
      path: ["joinDate"],
      message: "Ngày vào làm phải sau khi tài xế đủ 18 tuổi",
    });
  }
}

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
