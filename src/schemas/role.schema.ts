import { z } from "zod";

export const RoleSchema = z.enum([
    "Admin",
    "Sale",
    "Dispatcher",
    "Accountant",
]);

export type TRole = z.infer<typeof RoleSchema>;
