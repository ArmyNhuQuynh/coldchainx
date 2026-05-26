import { z } from "zod";

export const RoleSchema = z.enum([
    "Admin",
    "Manager",
]);

export type TRole = z.infer<typeof RoleSchema>;