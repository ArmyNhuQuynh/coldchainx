import { z } from "zod";
import { PERMISSION_EFFECT } from "@/types/enums/permission-effect.enum";

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  displayName: z.string(),
  module: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const RolePermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissionIds: z.array(z.string().uuid()),
});

export const RolePermissionMatrixSchema = z.object({
  permissions: z.array(PermissionSchema),
  roles: z.array(RolePermissionSchema),
});

export const UserPermissionSchema = z.object({
  userPermissionId: z.string().uuid(),
  userId: z.string().uuid(),
  permissionId: z.string().uuid(),
  permissionCode: z.string(),
  permissionName: z.string(),
  effect: z.enum([PERMISSION_EFFECT.ALLOW, PERMISSION_EFFECT.DENY]),
  validFrom: z.string().nullable().optional(),
  validTo: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  grantedBy: z.string().uuid(),
  grantedAt: z.string(),
  revokedBy: z.string().uuid().nullable().optional(),
  revokedAt: z.string().nullable().optional(),
});

export const EffectivePermissionsSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().nullable().optional(),
  permissionCodes: z.array(z.string()),
  userOverrides: z.array(UserPermissionSchema),
});

export const ReplaceRolePermissionsRequestSchema = z.object({
  permissionIds: z.array(z.string().uuid()),
});

export const UpsertUserPermissionRequestSchema = z
  .object({
    effect: z.enum([PERMISSION_EFFECT.ALLOW, PERMISSION_EFFECT.DENY]),
    validFrom: z.string().nullable().optional(),
    validTo: z.string().nullable().optional(),
    reason: z.string().trim().min(1, "Lý do không được để trống"),
  })
  .refine(
    (values) =>
      !values.validFrom ||
      !values.validTo ||
      new Date(values.validTo).getTime() > new Date(values.validFrom).getTime(),
    {
      path: ["validTo"],
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    }
  );

export type TPermission = z.infer<typeof PermissionSchema>;
export type TRolePermission = z.infer<typeof RolePermissionSchema>;
export type TRolePermissionMatrix = z.infer<
  typeof RolePermissionMatrixSchema
>;
export type TUserPermission = z.infer<typeof UserPermissionSchema>;
export type TEffectivePermissions = z.infer<
  typeof EffectivePermissionsSchema
>;
export type TReplaceRolePermissionsRequest = z.infer<
  typeof ReplaceRolePermissionsRequestSchema
>;
export type TUpsertUserPermissionRequest = z.infer<
  typeof UpsertUserPermissionRequestSchema
>;
