import { z } from "zod"

export const LoginRequestSchema = z.object({
    email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
    password: z.string().min(1, { message: "Mật khẩu không được bỏ trống" }).max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
}).strict();

export const AuthResponseSchema = z.object({
    userId: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    role: z.number(),
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiresAt: z.number(),
});


export type TLoginRequest = z.TypeOf<typeof LoginRequestSchema>;
export type TAuthResponse = z.TypeOf<typeof AuthResponseSchema>;