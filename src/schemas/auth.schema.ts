import { z } from "zod"
export const LoginRequestSchema = z.object({
    email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
    password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }).max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
}).strict();

export const AuthResponseSchema = z.object({
    userId: z.string().optional().nullable(),
    username: z.string().optional().nullable(),
    fullName: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    role: z.union([z.string(), z.number()]).optional().nullable(),
    accessToken: z.string(),
    refreshToken: z.string().optional().nullable(),
    accessTokenExpiresAt: z.union([z.string(), z.number()]).optional().nullable(),
});

export const CreateWarehouseWorkerRequestSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
    fullName: z.string().min(1, "Họ tên không được để trống"),
    email: z.string().email("Email không hợp lệ").nullable().optional(),
    phone: z.string().nullable().optional(),
    warehouseId: z.string().uuid("Kho không hợp lệ"),
});


export type TLoginRequest = z.TypeOf<typeof LoginRequestSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;
export type TCreateWarehouseWorkerRequest = z.infer<
    typeof CreateWarehouseWorkerRequestSchema
>;
