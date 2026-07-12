import { z } from "zod";
import { USER_ACCOUNT_TYPE } from "@/types/enums/user-account-type.enum";
import { USER_ROLE } from "@/types/enums/user-role.enum";
import { USER_STATUS_REQUEST } from "@/types/enums/user-status.enum";

export const USER_FILTER_ALL = "ALL";

export const USER_SORT_OPTIONS = [
  { label: "Ngày tạo", value: "createdat" },
  { label: "Tên đăng nhập", value: "username" },
  { label: "Email", value: "email" },
  { label: "Họ tên", value: "fullname" },
  { label: "Role", value: "role" },
  { label: "Trạng thái", value: "status" },
];

export const UserProfileSchema = z.object({
  userId: z.string().uuid({ message: "ID người dùng không hợp lệ" }),
  username: z.string({ message: "Tên đăng nhập không hợp lệ" }),
  fullName: z.string({ message: "Họ tên không hợp lệ" }),
  email: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  warehouseId: z.string().uuid().nullable().optional(),
  warehouseName: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const UserListResponseSchema = z.object({
  items: z.array(UserProfileSchema),
  page: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export const UserListParamsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.enum([
    USER_STATUS_REQUEST.ACTIVE,
    USER_STATUS_REQUEST.INACTIVE,
  ]).optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const CreateSaleUserRequestSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  phoneNumber: z.string().nullable().optional(),
  role: z.literal(USER_ROLE.SALES),
  status: z.enum([USER_STATUS_REQUEST.ACTIVE, USER_STATUS_REQUEST.INACTIVE]),
});

export const AdminUpdateUserRequestSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().nullable().optional(),
});

export const ChangeUserRoleRequestSchema = z.object({
  role: z.string().min(1, "Role không được để trống"),
});

export const ChangeUserStatusRequestSchema = z.object({
  status: z.enum([USER_STATUS_REQUEST.ACTIVE, USER_STATUS_REQUEST.INACTIVE]),
});

export const ChangeUserWarehouseRequestSchema = z.object({
  warehouseId: z.string().uuid("Kho không hợp lệ"),
});

export const ResetUserPasswordRequestSchema = z.object({
  newPassword: z.string().min(1, "Mật khẩu mới không được để trống"),
});

export const UserCreateFormSchema = z
  .object({
    accountType: z.enum([USER_ACCOUNT_TYPE.SALES, USER_ACCOUNT_TYPE.WAREHOUSE]),
    username: z.string().trim().optional(),
    fullName: z.string().trim().min(1, "Họ tên không được để trống"),
    email: z.string().trim().optional(),
    password: z.string().trim().min(1, "Mật khẩu không được để trống"),
    phoneNumber: z.string().trim().optional(),
    status: z.enum([USER_STATUS_REQUEST.ACTIVE, USER_STATUS_REQUEST.INACTIVE]),
    warehouseId: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      values.accountType === USER_ACCOUNT_TYPE.SALES &&
      !values.email
    ) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email không được để trống",
      });
    }

    if (
      values.email &&
      !z.string().email().safeParse(values.email).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email không hợp lệ",
      });
    }

    if (
      values.accountType === USER_ACCOUNT_TYPE.WAREHOUSE &&
      !values.username
    ) {
      context.addIssue({
        code: "custom",
        path: ["username"],
        message: "Tên đăng nhập không được để trống",
      });
    }

    if (
      values.accountType === USER_ACCOUNT_TYPE.WAREHOUSE &&
      !values.warehouseId
    ) {
      context.addIssue({
        code: "custom",
        path: ["warehouseId"],
        message: "Vui lòng chọn kho cho nhân viên kho",
      });
    }
  });

export const UserRoleFormSchema = z.object({
  role: z.string().min(1, "Role không được để trống"),
});

export const UserStatusFormSchema = z.object({
  status: z.enum([USER_STATUS_REQUEST.ACTIVE, USER_STATUS_REQUEST.INACTIVE]),
});

export const UserWarehouseFormSchema = z.object({
  warehouseId: z.string().uuid("Kho không hợp lệ"),
});

export const UserPasswordFormSchema = z
  .object({
    newPassword: z.string().trim().min(1, "Mật khẩu mới không được để trống"),
    confirmPassword: z.string().trim().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export type TUserProfile = z.infer<typeof UserProfileSchema>;
export type TUserListResponse = z.infer<typeof UserListResponseSchema>;
export type TUserListParams = z.infer<typeof UserListParamsSchema>;
export type TCreateSaleUserRequest = z.infer<typeof CreateSaleUserRequestSchema>;
export type TAdminUpdateUserRequest = z.infer<typeof AdminUpdateUserRequestSchema>;
export type TChangeUserRoleRequest = z.infer<typeof ChangeUserRoleRequestSchema>;
export type TChangeUserStatusRequest = z.infer<
  typeof ChangeUserStatusRequestSchema
>;
export type TChangeUserWarehouseRequest = z.infer<
  typeof ChangeUserWarehouseRequestSchema
>;
export type TResetUserPasswordRequest = z.infer<
  typeof ResetUserPasswordRequestSchema
>;
export type TUserCreateFormValues = z.infer<typeof UserCreateFormSchema>;
export type TUserRoleFormValues = z.infer<typeof UserRoleFormSchema>;
export type TUserStatusFormValues = z.infer<typeof UserStatusFormSchema>;
export type TUserWarehouseFormValues = z.infer<typeof UserWarehouseFormSchema>;
export type TUserPasswordFormValues = z.infer<typeof UserPasswordFormSchema>;

export const USER_CREATE_FORM_DEFAULTS: TUserCreateFormValues = {
  accountType: USER_ACCOUNT_TYPE.SALES,
  username: "",
  fullName: "",
  email: "",
  password: "@123@",
  phoneNumber: "",
  status: USER_STATUS_REQUEST.ACTIVE,
  warehouseId: "",
};
