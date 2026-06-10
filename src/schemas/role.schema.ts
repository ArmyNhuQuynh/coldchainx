import { z } from "zod";

export const RoleSchema = z.enum([
    "Admin",
    "Manager",
    "Sale",
    "Dispatcher",
]);

export type TRole = z.infer<typeof RoleSchema>;